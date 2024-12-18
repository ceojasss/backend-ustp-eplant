const _ = require('lodash');
const oracledb = require('oracledb');
const { getdbCreds, execFunction, OraDbType } = require('./dbHandler.js');
const { INSERT, SUBINSERT, SUBUPDATE, UPDATE } = require('../util/Constants.js');

const getAllKeys = obj => _.union(
    _.isArray(obj) ? [] : _.keys(obj),
    _.flatMap(obj, o => _.isObject(o) ? getAllKeys(o) : [])
)


const createmasterdetail = async (table, document, user, datas, isautonumber, extras) => {

    const { data, formComp, formComps } = datas
    let retval, conn, dbConnection, formCompMaster, formCompDetail, autonumberkey = '', autonumberdocument = '', keytrxdate

    let process = [], binds = [], column = [], columnbinding = []

    //    console.log(data)

    // * 1. PREPARE CONNECTION TO BE USED THROUGOUT THE PROCESS...
    dbConnection = getdbCreds(user.site)
    conn = await oracledb.getConnection(dbConnection);

    // * 2. SPLIT DATAS OBJECT TO MASTER & DETAIL

    //  console.log('data', _.filter(_.keys(data[0].header), x => (x === 'inputgrid' || x.includes('displayonly'))))

    //  console.log(data)
    // ?    1. MASTER
    const masteroriginal = data[0].header
    const masterinserts = _.omit(data[0].header, _.filter(_.keys(data[0].header), x => (x === 'inputgrid' || x.includes('displayonly'))))

    //    console.log('data', masterinserts, formComps)

    // ?    2. DETAIL --> insert & update object
    const detailtoinsert = Object.values({ ...data[0].inserts })

    const datatoupdate = Object.values({ ...data[0].updates })

    // console.log(detailtoinsert)

    // * 3. UPDATE DATA OBJECT & GENERATE AUTONUMBER
    // ? 1. FILTER MASTERDATA COMPONENTS FROM MASTERDATA OBJECT
    formCompMaster = _.filter(formComp, x => _.keys(masterinserts).includes(x.key))

    // ? 3. GET COLUMN SET AS AUTONUMBER COLUMN  
    autonumberkey = _.findKey(masterinserts, (x) => { return x === 'autonumber' })

    if (!_.isUndefined(autonumberkey)) {

        // ? 2. GET DATE COLUMN SET AS TRANSACTION DATE FOR AUTONUMBER PERIOD 
        keytrxdate = _.filter(formCompMaster, x => x.datetransaction === 'true')[0].key

        //  console.log('original', masteroriginal)
        // ? 4. GENERATE AUTONUMBER DOCUMENT --> AUTONUMBERDOCUMENT ALSO USED IN DETAIL DATA
        autonumberdocument = await generateautonumber(conn, document, masteroriginal[keytrxdate], user, masteroriginal)

        // ? 5. REPLACE AUTONUMBER COLUMN VALUE IN MASTERDATA OBJECT 
        _.update(masterinserts, autonumberkey, () => { return autonumberdocument })

        // ? 7. REPLACE AUTONUMBER COLUMN VALUE IN DETAIL OBJECT 
        _.map(detailtoinsert, x => { _.update(x, autonumberkey, () => { return autonumberdocument }) })
    }
    // ? 6. ADD MASTERDATAOBJECT TO DATABASE INSERT PROCESS 
    process.push(createMaster(conn, masterinserts, formCompMaster, user, table[0]))

    // ? 8.  FILTER DETAILDATA COMPONENTS FROM DETAIL OBJECT
    //formCompDetail = _.filter(formComps, (x) => _.keys(detailtoinsert[0]).includes(x.key))
    formCompDetail = _.filter(formComps, (x) => getAllKeys(detailtoinsert).includes(x.key))

    // ? 9. ADD DETAILDATAOBJECT TO DATABASE INSERT PROCESS 
    //  console.log(getAllKeys(detailtoinsert), formCompDetail)

    if (!_.isEmpty(detailtoinsert))
        process.push(createDetail(conn, detailtoinsert, formCompDetail, user, table[1], INSERT))


    if (!_.isEmpty(extras))
        process.push(execFunction(conn, extras, { 1: autonumberdocument, 2: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, 3: { dir: oracledb.BIND_OUT, type: oracledb.STRING } }))


    // * 4. RUN ALL PROCESS ARRAY IN PROMISE PROCESS..
    await Promise.all(process).then((returnvalues) => {

        retval = { autonumberdocument, returnvalues }

        conn.commit(() => { conn.close() })

    }).catch(error => {

        conn.rollback(() => { conn.close() });
        throw new Error(error)
    })

    return retval
}

const createMaster = async (conn, datas, formComps, user, table) => {
    let insertstatement, bindefs;
    let binds = [], column = [], columnbinding = [];

    return new Promise(async (resolve, reject) => {
        try {
            // * 1. push data to array tob inserted in oracledb.executemany function 
            binds.push(datas)

            // * 2. convert form component into column binding and column for insert statement 
            _.map(formComps, ({ fieldtype, key }) => {
                let fvals = ''
                if (fieldtype.match(/^(inputtime|inputdate|inputdatesimple|inputdatesimpleold|inputtimeold)$/)) {
                    //if (fieldtype === 'inputdate') {
                    if (fieldtype.indexOf('inputdate') > -1) {
                        fvals = `TRUNC(TO_DATE(:${key},'dd-mm-yyyy hh24:mi'))`
                    } else {
                        fvals = `TO_DATE(:${key},'dd-mm-yyyy hh24:mi')` // `TO_TIMESTAMP_TZ(:${key}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                    }
                } else {
                    fvals = `:${key}`
                }

                columnbinding.push(fvals)
                column.push(key)
            })

            insertstatement = `insert into ${table} (${column.join(',')}) values(${columnbinding.join(',')}) returning rowid into :rids`

            bindefs = _.mapKeys(_.map(formComps, ({ key, datatype, maxSize }) => ({ key: key, type: OraDbType(datatype), maxSize: Number(maxSize) })), 'key')

            _.merge(bindefs, { 'rids': { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 45 } })

            const options = {
                autoCommit: false,
                bindDefs: bindefs
            }

            const result = await conn.executeMany(insertstatement, binds, options)

            resolve({ 'header': result })

        } catch (err) {

            reject(err)
        }
    }).catch(
        (error) => {
            throw new Error(error)
        }
    );;
}

const updateMaster = async (conn, data, formComps, user, table) => {

    return new Promise(async (resolve, reject) => {

        let formCompsClean;
        let updateData = _.omit(data, 'ROWIDS')
        try {

            let accessor = Object.keys(updateData)

            formCompsClean = formComps.filter(x => accessor.includes(x.key))

            let binding = formCompsClean.map((x) => {
                // ! manually set data for datatype date

                if (x['fieldtype'].match(/^(inputdate|inputdatesimple|inputtime|inputdatesimpleold|inputtimeold)$/)) {

                    //if (x['fieldtype'] === 'inputdate') {
                    if (x['fieldtype'].indexOf('inputdate') > -1) {
                        return `${x['key']} = trunc(TO_DATE(:${x['key'].replace(/ /g)},'dd-mm-yyyy hh24:mi'))`
                    } else {
                        return `${x['key']} = TO_DATE(:${x['key'].replace(/ /g)},'dd-mm-yyyy hh24:mi')`
                    }
                }


                return `${x['key']} = :${x['key'].replace(/ /g)}`

            }).join(",")

            let updateby = `updateby=:updateby`
            let updateStatement = `UPDATE ${table} set ${binding},${updateby} where rowid = :ROWIDS`
            Object.assign(data, { updateby: user.loginid })
            result = await conn.execute(updateStatement, data, options = { outFormat: oracledb.OBJECT, autoCommit: false, })

            resolve({ 'header': result })

        } catch (err) {
            reject(err)
        }
    }).catch(
        (error) => {
            throw new Error(error)
        }
    )
}

const createDetail = async (conn, datas, formComps, user, table, _type) => {
    let formCompsClean, accessor, insertstatement, bindefs;
    let binds = [], column = [], columnbinding = [];




    return new Promise(async (resolve, reject) => {
        try {
            // dbConnection = getdbCreds(user.site)

            datas.map(v => binds.push(
                Object.fromEntries(
                    Object.entries(v).filter(
                        ([key]) => !key.includes('displayonly')
                    )
                )))
            binds = _.reject(binds, _.isEmpty)
            // * 2. shape insert data, flattening object as values
            _.map(binds, (c) => {
                _.mapValues(c, (o, key) => {
                    if (_.isObject(o))
                        _.set(c, key, Object.values(o)[0])

                })
            })

            accessor = getAllKeys(binds)
            formCompsClean = _.filter(formComps, (x) => accessor.includes(x.key))

            _.map(formCompsClean, ({ fieldtype, key }) => {


                let fvals = ''


                if (fieldtype.match(/^(inputtime|inputdate|inputdatesimple|inputdatesimpleold|inputtimeold)$/)) {
                    //str.indexOf(st) > -1
                    if (fieldtype.indexOf('inputdate') > -1) {
                        //if (fieldtype === 'inputdate') {
                        fvals = `TRUNC(TO_DATE(:${key},'dd-mm-yyyy hh24:mi'))`
                    } else {
                        fvals = `TO_DATE(:${key},'dd-mm-yyyy hh24:mi')` // `TO_TIMESTAMP_TZ(:${key}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                    }
                } else {
                    fvals = `:${key}`
                }

                columnbinding.push(fvals)
                column.push(key)
            })
            // console.log('testing',user.loginid)
            insertstatement = `insert into ${table} (${column.join(',')},INPUTBY) values(${columnbinding.join(',')},'${user.loginid}') returning rowid , tid into :rids,:tids`
            // insertstatement = `insert into ${table} (${column.join(',')}) values(${columnbinding.join(',')}) returning rowid , tid into :rids,:tids`

            //console.log(insertstatement)

            bindefs = _.mapKeys(_.map(formCompsClean, ({ key, datatype, maxSize }) => ({ key: key, type: OraDbType(datatype), maxSize: Number(maxSize) })), 'key')
            _.merge(bindefs, {
                'rids': { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 45 },
                'tids': { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 250 },
            })

            console.log(insertstatement)
            console.log(binds)

            const result = await conn.executeMany(insertstatement, binds, options = { autoCommit: false, bindDefs: bindefs })

            // console.log('testing',datas);

            const types = (_.isUndefined(_type) ? INSERT : _type)

            resolve({ [types]: result })
        } catch (err) {
            reject(err)
        }
    }).catch(
        (error) => {
            throw new Error(error)
        }
    );;
}

const updateDetail = async (conn, datas, formComps, user, table, _type) => {
    let binds = [], column = [], columnbinding = [];
    datas.map(v => binds.push(
        Object.fromEntries(
            Object.entries(v).filter(
                ([key]) => !key.includes('displayonly')
            )
        )))

    // * 2. shape insert data, flattening object as values
    binds = _.reject(binds, _.isEmpty)
    _.map(binds, (c) => {
        _.mapValues(c, (o, key) => {
            // console.log(o)

            if (_.isObject(o))
                _.set(c, key, Object.values(o)[0])

        })
    })


    const retval = await Promise.all(_.map(binds, (data) => {
        return new Promise(async (resolve, reject) => {

            let formCompsClean;
            let updateData = _.omit(data, 'rowids')


            try {


                let accessor = Object.keys(updateData)

                // console.log('update', accessor)

                formCompsClean = formComps.filter(x => accessor.includes(x.key))

                let binding = formCompsClean.map((x) => {
                    // ! manually set data for datatype date



                    if (x['fieldtype'].match(/^(inputdate|inputdatesimple|inputtime|inputdatesimpleold|inputtimeold)$/)) {

                        //if (x['fieldtype'] === 'inputdate') {
                        if (x['fieldtype'].indexOf('inputdate') > -1) {
                            return `${x['key']} = trunc(TO_DATE(:${x['key'].replace(/ /g)},'dd-mm-yyyy hh24:mi'))`
                        } else {
                            return `${x['key']} = TO_DATE(:${x['key'].replace(/ /g)},'dd-mm-yyyy hh24:mi')`
                        }
                    }


                    return `${x['key']} = :${x['key'].replace(/ /g)}`


                }).join(",")

                if (!_.isEmpty(binding)) {
                    let updateby = `updateby=:updateby`
                    let updateStatement = `UPDATE ${table} set ${binding},${updateby} where rowid = :rowids`

                    Object.assign(data, { updateby: user.loginid })
                    // let updateStatement = `UPDATE ${table} set ${binding} where rowid = :rowids`

                    //console.log(data)



                    result = await conn.execute(updateStatement, data, options = { outFormat: oracledb.OBJECT, autoCommit: false, })

                    resolve(result)
                } else {
                    resolve()

                }



            } catch (err) {
                reject(err)
            }
        }).catch(
            (error) => {
                throw new Error(error)
            }
        )
    }))

    const types = (_.isUndefined(_type) ? UPDATE : _type)

    return { [types]: retval }

}

const deleteDetail = async (conn, datas, formComps, user, table) => {

    //! this is not standalone function should not close connection 

    let binds = [], column = [], columnbinding = [];
    datas.map(v => binds.push(
        Object.fromEntries(
            Object.entries(v).filter(
                ([key]) => !key.includes('displayonly')
            )
        )))

    // * 2. shape insert data, flattening object as values
    _.map(datas, (c) => {
        _.mapValues(c, (o, key) => {
            // console.log(o)

            if (_.isObject(o))
                _.set(c, key, Object.values(o)[0])

        })
    })

    const retval = await Promise.all(_.map(datas, (data) => {
        return new Promise(async (resolve, reject) => {

            let DeleteData = _.omit(data, 'rowids')

            // console.log('12', DeleteData)

            try {
                binds = [{ Id: _.get(DeleteData, 'rowid') }]
                let deleteStatement = `DELETE FROM ${table} where rowid =  :Id`
                result = await conn.executeMany(deleteStatement, binds, options = { autoCommit: true })

                //   console.log(result)

                resolve({ ...result, ...binds[0] })

            } catch (err) {
                reject(err)
            }
        }).catch(
            (error) => {
                throw new Error(error)
            }
        )
    }))

    return { "delete": retval }
}

const generateautonumber = async (conn, document, trxdate, user, master) => {


    let values, strxdate, document_param = "", document_param2 = "";

    //  console.log('autonumber', document, master)

    if (trxdate instanceof (Date)) {
        strxdate = `${String(trxdate.getDate()).padStart(2, '0')}-${String(trxdate.getMonth() + 1).padStart(2, '0')}-${trxdate.getFullYear()}`
    }
    else {
        strxdate = trxdate.substring(0, 10)
    }

    // ? Handle customize parameter 
    if (document === 'HR MEDICAL') {
        document_param = master['nik_staff']
    }
    else if (document === 'HR MEDICAL STAFF') {
        document_param = master['empccdisplayonly']
    }
    else if (document === 'PETTY CASH HO') {
        document_param = master['site']
    }
    else if (document === 'PAYMENT VOUCHER WEB' || document === 'RECEIVE VOUCHER WEB') {
        if (master['bankcode'].charAt(0) === 'Z') {
            document_param2 = 'K'
        } else {
            document_param2 = 'B'
        }

        if (user.loginid.match(/^.*HO$/)) {
            document_param = 'HO'
        } else {
            document_param = ''
        }
    } else if (document === 'PROFORMA CONTRACT REQUEST WEB') {
        if (user.loginid.match(/^.*HO$/)) {
            document_param = 'HO'
        } else {
            document_param = ''
        }
    }
    else {
        if (user.loginid.match(/^.*HO$/)) {
            document_param = 'HO'
        } else {
            document_param = ''
        }
    }


    // console.log(document, master)

    const binds = {
        doc_type: document,
        doc_date: strxdate,
        doc_param: document_param,// document == 'HR MEDICAL' ? master['nik_staff'] : (user.paramcode == 'SO' || user.paramcode == 'SITE') ? '' : user.paramcode,
        doc_param2: document_param2,
        retval: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
    }


    let statement = ` begin
                        :retval :=  FFN_DOCNUMBER_F (:doc_type , to_date (:doc_date,'dd-mm-yyyy'), :doc_param,:doc_param2);
                      end;`

    //console.log(binds, statement)

    const options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
    };

    await execFunction(conn, statement, binds, options).then((x) => values = x)

    //    console.log('x', values.outBinds.retval)

    return values.outBinds.retval;

}

const insertupdatemasterdetail = async (table, user, datas) => {

    const { data, formComp, formComps } = datas
    let retval, conn, dbConnection, CompDetailInsert, CompDetailUpdate, CompMaster, CompDetailDelete

    let process = [], binds = [], column = [], columnbinding = []

    // * 1. PREPARE CONNECTION TO BE USED THROUGOUT THE PROCESS...
    dbConnection = getdbCreds(user.site)
    conn = await oracledb.getConnection(dbConnection);


    /*    console.log('MASTERUPDATE')
       console.log('MASTERUPDATE', datas) */

    // * 1. split data object for insert & update object
    //const headertoupdate = data[0].header

    //  console.log(data[0])

    const masterupdate = _.omit(data[0].header, _.filter(_.keys(data[0].header), x => (x === 'inputgrid' || x.includes('displayonly'))))
    const datatoinsert = Object.values({ ...data[0].inserts })
    const datatoupdate = Object.values({ ...data[0].updates })
    const datatodelete = Object.values({ ...data[0].deletes })




    // * 1.1 get component from data object
    CompMaster = _.filter(formComp, x => _.keys(masterupdate).includes(x.key))
    CompDetailInsert = _.filter(formComps, (x) => _.some(datatoinsert, (v) => _.keys(v).includes(x.key)))
    CompDetailUpdate = _.filter(formComps, (x) => _.some(datatoupdate, (v) => _.keys(v).includes(x.key)))
    CompDetailDelete = _.filter(formComps, (x) => _.some(datatodelete, (v) => _.keys(v).includes(x.key)))


    if (datatodelete.length > 0) {
        process.push(deleteDetail(conn, datatodelete, CompDetailDelete, user, table[1]))
    }


    if (_.keys(masterupdate).length > 1) {
        // console.log('update')
        process.push(updateMaster(conn, masterupdate, CompMaster, user, table[0]))
    }


    if (datatoinsert.length > 0) {
        process.push(createDetail(conn, datatoinsert, CompDetailInsert, user, table[1], INSERT))
    }


    // console.log('component', datatoupdate[0])

    if (datatoupdate.length > 0) {
        process.push(updateDetail(conn, datatoupdate, CompDetailUpdate, user, table[1], UPDATE))
    }

    await Promise.all(process)
        .then(
            (promised) => {
                retval = promised
                conn.commit(() => { conn.close() })
            })
        .catch(error => {
            conn.rollback(() => { conn.close() });
            throw new Error(error)
        })

    return retval
}

const createmasteronly = async (table, document, user, datas) => {

    const { data, formComps } = datas
    let retval, conn, dbConnection, formCompMaster, formCompDetail, autonumberkey = '', autonumberdocument = '', keytrxdate

    let process = [], binds = [], column = [], columnbinding = []

    // * 1. PREPARE CONNECTION TO BE USED THROUGOUT THE PROCESS...
    dbConnection = getdbCreds(user.site)
    conn = await oracledb.getConnection(dbConnection);


    // * 3. UPDATE DATA OBJECT & GENERATE AUTONUMBER
    // ? 1. FILTER MASTERDATA COMPONENTS FROM MASTERDATA OBJECT
    formCompMaster = _.filter(formComps, x => _.keys(masterinserts).includes(x.key))


    // ? 6. ADD MASTERDATAOBJECT TO DATABASE INSERT PROCESS 
    process.push(createMaster(conn, masterinserts, formCompMaster, user, table[0]))


    // * 4. RUN ALL PROCESS ARRAY IN PROMISE PROCESS..
    await Promise.all(process).then((returnvalues) => {
        retval = { returnvalues }

        conn.commit(() => { conn.close() })

    }).catch(error => {
        conn.rollback(() => { conn.close() });
        throw new Error(error)
    })

    return retval
}


const createmstdetailsub = async (table, document, user, datas, isautonumber, extras) => {

    const { data, formComp, formComps, formSubComps } = datas
    let retval, conn, dbConnection, formCompMaster, formCompDetail, formCompSubDetail, autonumberkey = '', autonumberdocument = '', keytrxdate

    let process = [], binds = [], column = [], columnbinding = []

    //    console.log(data)

    // * 1. PREPARE CONNECTION TO BE USED THROUGOUT THE PROCESS...
    dbConnection = getdbCreds(user.site)
    conn = await oracledb.getConnection(dbConnection);

    // * 2. SPLIT DATAS OBJECT TO MASTER & DETAIL

    //  console.log('data', _.filter(_.keys(data[0].header), x => (x === 'inputgrid' || x.includes('displayonly'))))

    //  console.log(data)
    // ?    1. MASTER
    const masteroriginal = data[0].header
    const masterinserts = _.omit(data[0].header, _.filter(_.keys(data[0].header), x => (x === 'inputgrid' || x.includes('displayonly'))))

    //    console.log('data', masterinserts, formComps)

    // ?    2. DETAIL --> insert & update object
    const detailtoinsert = Object.values({ ...data[0].inserts })

    const datatoupdate = Object.values({ ...data[0].updates })


    // ?    2. DETAIL --> insert & update object
    const subdetailtoinsert = Object.values({ ...data[0].subInserts })


    // * 3. UPDATE DATA OBJECT & GENERATE AUTONUMBER
    // ? 1. FILTER MASTERDATA COMPONENTS FROM MASTERDATA OBJECT
    formCompMaster = _.filter(formComp, x => _.keys(masterinserts).includes(x.key))

    // ? 3. GET COLUMN SET AS AUTONUMBER COLUMN  
    autonumberkey = _.findKey(masterinserts, (x) => { return x === 'autonumber' })

    if (!_.isUndefined(autonumberkey)) {

        // ? 2. GET DATE COLUMN SET AS TRANSACTION DATE FOR AUTONUMBER PERIOD 
        keytrxdate = _.filter(formCompMaster, x => x.datetransaction === 'true')[0].key

        //  console.log('original', masteroriginal)
        // ? 4. GENERATE AUTONUMBER DOCUMENT --> AUTONUMBERDOCUMENT ALSO USED IN DETAIL DATA
        autonumberdocument = await generateautonumber(conn, document, masteroriginal[keytrxdate], user, masteroriginal)

        // ? 5. REPLACE AUTONUMBER COLUMN VALUE IN MASTERDATA OBJECT 
        _.update(masterinserts, autonumberkey, () => { return autonumberdocument })

        // ? 7. REPLACE AUTONUMBER COLUMN VALUE IN DETAIL OBJECT 
        _.map(detailtoinsert, x => { _.update(x, autonumberkey, () => { return autonumberdocument }) })


        // ? 8. REPLACE AUTONUMBER COLUMN VALUE IN SUB DETAIL OBJECT 
        _.map(subdetailtoinsert, x => { _.update(x, autonumberkey, () => { return autonumberdocument }) })

    }
    // ? 6. ADD MASTERDATAOBJECT TO DATABASE INSERT PROCESS 
    process.push(createMaster(conn, masterinserts, formCompMaster, user, table[0]))

    // ? 8.  FILTER DETAILDATA COMPONENTS FROM DETAIL OBJECT
    //formCompDetail = _.filter(formComps, (x) => _.keys(detailtoinsert[0]).includes(x.key))
    formCompDetail = _.filter(formComps, (x) => getAllKeys(detailtoinsert).includes(x.key))

    // ? 9. ADD DETAILDATAOBJECT TO DATABASE INSERT PROCESS 


    if (!_.isEmpty(detailtoinsert))
        process.push(createDetail(conn, detailtoinsert, formCompDetail, user, table[1], INSERT))


    // ? 8.  FILTER subDETAILDATA COMPONENTS FROM DETAIL OBJECT
    formCompSubDetail = _.filter(formSubComps, (x) => getAllKeys(subdetailtoinsert).includes(x.key))

    // ? 9. ADD DETAILDATAOBJECT TO DATABASE INSERT PROCESS 


    if (!_.isEmpty(subdetailtoinsert))
        process.push(createDetail(conn, subdetailtoinsert, formCompSubDetail, user, table[2], SUBINSERT))


    if (!_.isEmpty(extras))
        process.push(execFunction(conn, extras, { 1: autonumberdocument, 2: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, 3: { dir: oracledb.BIND_OUT, type: oracledb.STRING } }))




    // * 4. RUN ALL PROCESS ARRAY IN PROMISE PROCESS..
    await Promise.all(process).then((returnvalues) => {

        console.log('process', returnvalues)

        retval = { autonumberdocument, returnvalues }

        conn.commit(() => { conn.close() })

    }).catch(error => {
        conn.rollback(() => { conn.close() });
        throw new Error(error)
    })

    return retval
}

const insertupdatemasterdetailsub = async (table, user, datas) => {

    const { data, formComp, formComps, formSubComps } = datas
    let retval, conn, dbConnection, CompDetailInsert, CompDetailUpdate, CompMaster, CompDetailDelete

    let process = [], binds = [], column = [], columnbinding = []

    // * 1. PREPARE CONNECTION TO BE USED THROUGOUT THE PROCESS...
    dbConnection = getdbCreds(user.site)
    conn = await oracledb.getConnection(dbConnection);


    /*    console.log('MASTERUPDATE')
       console.log('MASTERUPDATE', datas) */

    // * 1. split data object for insert & update object
    //const headertoupdate = data[0].header

    //  console.log(data[0])

    const masterupdate = _.omit(data[0].header, _.filter(_.keys(data[0].header), x => (x === 'inputgrid' || x.includes('displayonly'))))
    const datatoinsert = Object.values({ ...data[0].inserts })
    const datatoupdate = Object.values({ ...data[0].updates })
    const datatodelete = Object.values({ ...data[0].deletes })

    const subDetailtoinsert = Object.values({ ...data[0].subInserts })
    const subDetailtoupdate = Object.values({ ...data[0].subUpdates })
    const subDetailtodelete = Object.values({ ...data[0].subDeletes })



    // * 1.1 get component from data object
    CompMaster = _.filter(formComp, x => _.keys(masterupdate).includes(x.key))
    CompDetailInsert = _.filter(formComps, (x) => _.some(datatoinsert, (v) => _.keys(v).includes(x.key)))
    CompDetailUpdate = _.filter(formComps, (x) => _.some(datatoupdate, (v) => _.keys(v).includes(x.key)))
    CompDetailDelete = _.filter(formComps, (x) => _.some(datatodelete, (v) => _.keys(v).includes(x.key)))

    CompSubdetailInsert = _.filter(formSubComps, (x) => _.some(subDetailtoinsert, (v) => _.keys(v).includes(x.key)))
    CompSubdetailUpdate = _.filter(formSubComps, (x) => _.some(subDetailtoupdate, (v) => _.keys(v).includes(x.key)))
    CompSubdetailDelete = _.filter(formSubComps, (x) => _.some(subDetailtodelete, (v) => _.keys(v).includes(x.key)))

    //   console.log('update', subDetailtoupdate)

    if (datatodelete.length > 0) {
        process.push(deleteDetail(conn, datatodelete, CompDetailDelete, user, table[1]))
    }

    if (_.keys(masterupdate).length > 1) {
        // console.log('update')
        process.push(updateMaster(conn, masterupdate, CompMaster, user, table[0]))
    }


    if (datatoinsert.length > 0) {
        process.push(createDetail(conn, datatoinsert, CompDetailInsert, user, table[1], INSERT))
    }

    if (datatoupdate.length > 0) {
        process.push(updateDetail(conn, datatoupdate, CompDetailUpdate, user, table[1], UPDATE))
    }

    if (subDetailtodelete.length > 0) {
        process.push(deleteDetail(conn, subDetailtodelete, CompSubdetailDelete, user, table[2]))
    }

    if (subDetailtoinsert.length > 0) {
        process.push(createDetail(conn, subDetailtoinsert, CompSubdetailInsert, user, table[2], SUBINSERT))
    }

    if (subDetailtoupdate.length > 0) {
        process.push(updateDetail(conn, subDetailtoupdate, CompSubdetailUpdate, user, table[2], SUBUPDATE))
    }

    await Promise.all(process)
        .then(
            (promised) => {
                retval = promised
                conn.commit(() => { conn.close() })
            })
        .catch(error => {
            conn.rollback(() => { conn.close() });
            throw new Error(error)
        })

    return retval
}

const createMasterEmail = async (table, tableemail, user, datas, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn, dbConnection, autonumberdocument, formCompsClean;
        let binds = [];


        const { data, formComps } = datas
        let functionEmail = _.filter(formComps, x => x.default_value === 'autonumber')[0]
        // let bindsEmail =  functionEmail.lov_dependent_values
        let bindsEmail = _.split(functionEmail.lov_dependent_values, ';')
        functionEmail = functionEmail.autonumber_param

        // console.log(bindsEmail)
        try {
            dbConnection = getdbCreds(user.site)

            _.map(data[0], v => binds.push(
                Object.fromEntries(
                    Object.entries(v).filter(
                        ([key]) => !key.includes('displayonly')
                    )
                )
            )
            )

            binds = _.reject(binds, _.isEmpty)


            let accessor = Object.keys(binds[0])

            formCompsClean = formComps.filter(x => accessor.includes(x.key))

            let column = [], columnbinding = []


            formCompsClean.map(({ fieldtype, key }) => {
                let fvals = ''

                if (fieldtype.match(/^(inputtime|inputdate|inputdatesimple|inputdatesimpleold|inputtimeold)$/)) {
                    //if (fieldtype === 'inputdate') {
                    if (fieldtype.indexOf('inputdate') > -1) {
                        fvals = `TRUNC(TO_DATE(:${key},'dd-mm-yyyy hh24:mi'))`
                    } else {
                        fvals = `TO_DATE(:${key},'dd-mm-yyyy hh24:mi')` // `TO_TIMESTAMP_TZ(:${key}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                    }
                } else {
                    fvals = `:${key}`
                }

                columnbinding.push(fvals)
                column.push(key)
            })



            conn = await oracledb.getConnection(dbConnection);

            // ?  GET COLUMN SET AS AUTONUMBER COLUMN ~~ PREREQUISITE --> ONLY RECEIVED 1 COLUMN AS AUTONUMBER COLUMN



            let insertstatement = `insert into ${table} (${column.join(',')}) values(${columnbinding.join(',')}) returning rowid into :rids`
            let bindefs = _.mapKeys(_.map(formCompsClean, ({ key, type, maxSize }) => ({ key: key, type: OraDbType(type), maxSize: Number(maxSize) })), 'key')




            _.merge(bindefs, { 'rids': { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 45 } })

            const options = {
                autoCommit: true,
                bindDefs: bindefs
            }





            const result = await conn.executeMany(insertstatement, binds, options)
            // const statement = `select key_leave, id_leave from hr_short_leave where id_leave in (select max(id_leave) from hr_short_leave where empcode = '${user.empcode}' and approvedby1 is null)`
            // console.log(result)
            if (!_.isNil(result)) {
                const result1 = await conn.execute(tableemail, opts)
                // console.log(user,statement)
                // console.log(_.get(result1.rows[0],bindsEmail[0]))
                const bindss = {
                    key: _.get(result1.rows[0], bindsEmail[0]),
                    id: _.get(result1.rows[0], bindsEmail[1]),
                    // retval: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                }


                let statement = `BEGIN  ${functionEmail}(:key , :id,NULL);
                                     END;`

                //console.log(binds, statement)

                // const optionss = {
                //     outFormat: oracledb.OUT_FORMAT_OBJECT,
                // };
                const email = await conn.execute(statement, bindss, opts)
                // await execFunction(conn, statement, bindss, optionss).then((x) => values = x)

                // //    console.log('x', values.outBinds.retval)

                // return email;
                // console.log(result1.rows[0].KEY_LEAVE,result1.rows[0].ID_LEAVE)
            }
            resolve(result)

        } catch (err) {
            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    // console.log(err)
                    reject(err)
                }
            }
        }
    }).catch(
        (error) => {
            //console.log('masuk error')
            throw new Error(error)
            //reject(error)
        }
    );;
}



module.exports = {
    createmasterdetail,
    createMaster,
    createDetail,
    updateDetail,
    insertupdatemasterdetail,
    createmasteronly,
    deleteDetail,
    createmstdetailsub,
    insertupdatemasterdetailsub,
    createMasterEmail
}