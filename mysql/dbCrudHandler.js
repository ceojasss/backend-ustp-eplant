const { tr } = require('date-fns/locale');
const { includes, create } = require('lodash');
const _ = require('lodash');
const oracledb = require('oracledb');
const { getdbCreds, execFunction, OraDbType } = require('./dbHandler.js');

const createmasterdetail = async (table, document, user, datas, isautonumber) => {

    const { data, formComp, formComps } = datas
    let retval, conn, dbConnection, formCompMaster, formCompDetail, autonumberkey = '', autonumberdocument = '', keytrxdate

    let process = [], binds = [], column = [], columnbinding = []

    // * 1. PREPARE CONNECTION TO BE USED THROUGOUT THE PROCESS...
    dbConnection = getdbCreds(user.site)
    conn = await oracledb.getConnection(dbConnection);

    // * 2. SPLIT DATAS OBJECT TO MASTER & DETAIL
    // ?    1. MASTER
    const masterinserts = _.omit(data[0].header, _.filter(_.keys(data[0].header), x => (x === 'inputgrid' || x.includes('displayonly'))))

    // ?    2. DETAIL --> insert & update object
    const detailtoinsert = Object.values({ ...data[0].inserts })

    const datatoupdate = Object.values({ ...data[0].updates })


    // * 3. UPDATE DATA OBJECT & GENERATE AUTONUMBER
    // ? 1. FILTER MASTERDATA COMPONENTS FROM MASTERDATA OBJECT
    formCompMaster = _.filter(formComp, x => _.keys(masterinserts).includes(x.key))

    // ? 3. GET COLUMN SET AS AUTONUMBER COLUMN  
    autonumberkey = _.findKey(masterinserts, (x) => { return x === 'autonumber' })


    if (!_.isUndefined(autonumberkey)) {
        // ? 2. GET DATE COLUMN SET AS TRANSACTION DATE FOR AUTONUMBER PERIOD 
        keytrxdate = _.filter(formCompMaster, x => x.datetransaction === 'true')[0].key


        // ? 4. GENERATE AUTONUMBER DOCUMENT --> AUTONUMBERDOCUMENT ALSO USED IN DETAIL DATA
        autonumberdocument = await generateautonumber(conn, document, masterinserts[keytrxdate], user, masterinserts)

        // ? 5. REPLACE AUTONUMBER COLUMN VALUE IN MASTERDATA OBJECT 
        _.update(masterinserts, autonumberkey, () => { return autonumberdocument })

        // ? 7. REPLACE AUTONUMBER COLUMN VALUE IN DETAIL OBJECT 
        _.map(detailtoinsert, x => { _.update(x, autonumberkey, () => { return autonumberdocument }) })
    }
    // ? 6. ADD MASTERDATAOBJECT TO DATABASE INSERT PROCESS 
    process.push(createMaster(conn, masterinserts, formCompMaster, user, table[0]))

    // ? 8.  FILTER DETAILDATA COMPONENTS FROM DETAIL OBJECT
    formCompDetail = _.filter(formComps, (x) => _.keys(detailtoinsert[0]).includes(x.key))

    // ? 9. ADD DETAILDATAOBJECT TO DATABASE INSERT PROCESS 

    if (!_.isEmpty(detailtoinsert))
        process.push(createDetail(conn, detailtoinsert, formCompDetail, user, table[1]))

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

                if (fieldtype.match(/^(inputtime|inputdate|inputdatesimple)$/)) {
                    if (fieldtype === 'inputdate') {
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


            console.log(binds)

            const result = await conn.executeMany(insertstatement, binds, options)

            console.log(result)
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

                if (x['fieldtype'].match(/^(inputdate|inputdatesimple|inputtime)$/)) {

                    if (x['fieldtype'] === 'inputdate') {
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

const createDetail = async (conn, datas, formComps, user, table) => {
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

            accessor = Object.keys(binds[0])

            //  console.log(datas)

            formCompsClean = _.filter(formComps, (x) => accessor.includes(x.key))

            // console.log(formComps)

            _.map(formCompsClean, ({ fieldtype, key }) => {


                let fvals = ''

                /*   if (fieldtype.match(/^(inputtime|inputdate|inputdatesimple)$/)) {
  
                      fvals = `TO_DATE(:${key},'dd-mm-yyyy hh24:mi')`//`TO_TIMESTAMP_TZ(:${key}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                      //     console.log('datanya', fieldtype, key, fvals)
                  } else {
                      fvals = `:${key}`
                  } */

                if (fieldtype.match(/^(inputtime|inputdate|inputdatesimple)$/)) {
                    if (fieldtype === 'inputdate') {
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

            //  console.log(insertstatement)

            bindefs = _.mapKeys(_.map(formCompsClean, ({ key, datatype, maxSize }) => ({ key: key, type: OraDbType(datatype), maxSize: Number(maxSize) })), 'key')
            _.merge(bindefs, {
                'rids': { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 45 },
                'tids': { type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 45 },
            })


            const result = await conn.executeMany(insertstatement, binds, options = { autoCommit: false, bindDefs: bindefs })

            // console.log('testing',datas);

            resolve({ 'insert': result })
        } catch (err) {
            reject(err)
        }
    }).catch(
        (error) => {
            throw new Error(error)
        }
    );;
}

const updateDetail = async (conn, datas, formComps, user, table) => {
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
            console.log(o)

            if (_.isObject(o))
                _.set(c, key, Object.values(o)[0])

        })
    })

    const retval = await Promise.all(_.map(datas, (data) => {
        return new Promise(async (resolve, reject) => {

            let formCompsClean;
            let updateData = _.omit(data, 'rowids')



            //   console.log('12', updateData)

            try {


                let accessor = Object.keys(updateData)

                // console.log('update', accessor)

                formCompsClean = formComps.filter(x => accessor.includes(x.key))

                let binding = formCompsClean.map((x) => {
                    // ! manually set data for datatype date



                    if (x['fieldtype'].match(/^(inputdate|inputdatesimple|inputtime)$/)) {

                        if (x['fieldtype'] === 'inputdate') {
                            return `${x['key']} = trunc(TO_DATE(:${x['key'].replace(/ /g)},'dd-mm-yyyy hh24:mi'))`
                        } else {
                            return `${x['key']} = TO_DATE(:${x['key'].replace(/ /g)},'dd-mm-yyyy hh24:mi')`
                        }
                    }


                    return `${x['key']} = :${x['key'].replace(/ /g)}`


                }).join(",")

                let updateby = `updateby=:updateby`
                let updateStatement = `UPDATE ${table} set ${binding},${updateby} where rowid = :rowids`
                Object.assign(data, { updateby: user.loginid })
                // let updateStatement = `UPDATE ${table} set ${binding} where rowid = :rowids`

                //console.log(data)

                result = await conn.execute(updateStatement, data, options = { outFormat: oracledb.OBJECT, autoCommit: false, })

                resolve(result)

            } catch (err) {
                reject(err)
            }
        }).catch(
            (error) => {
                throw new Error(error)
            }
        )
    }))

    return { "update": retval }

}

const deleteDetail = async (conn, datas, formComps, user, table) => {
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


    let values, strxdate;

    // console.log(master)

    if (trxdate instanceof (Date)) {
        strxdate = `${String(trxdate.getDate()).padStart(2, '0')}-${String(trxdate.getMonth() + 1).padStart(2, '0')}-${trxdate.getFullYear()}`
    }
    else {
        strxdate = trxdate.substring(0, 10)//`${trxdate.substring(8, 10)}-${trxdate.substring(5, 7)}-${trxdate.substring(0, 4)}`
    }
    // console.log(user)
    const binds = {
        doc_type: document,
        doc_date: strxdate,
        doc_param: document == 'HR MEDICAL' ? master['nik_staff'] : (user.paramcode == 'SO' || user.paramcode == 'SITE') ? ' ' : user.paramcode,
        retval: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
    }


    let statement = ` begin
                        :retval :=  FFN_DOCNUMBER_F (:doc_type , to_date (:doc_date,'dd-mm-yyyy'), :doc_param);
                      end;`

    // console.log(binds, statement)

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
    const masterupdate = _.omit(data[0].header, _.filter(_.keys(data[0].header), x => (x === 'inputgrid' || x.includes('displayonly'))))
    const datatoinsert = Object.values({ ...data[0].inserts })
    const datatoupdate = Object.values({ ...data[0].updates })
    const datatodelete = Object.values({ ...data[0].deletes })

    // * 1.1 get component from data object
    CompMaster = _.filter(formComp, x => _.keys(masterupdate).includes(x.key))
    CompDetailInsert = _.filter(formComps, (x) => _.some(datatoinsert, (v) => _.keys(v).includes(x.key)))
    CompDetailUpdate = _.filter(formComps, (x) => _.some(datatoupdate, (v) => _.keys(v).includes(x.key)))
    CompDetailDelete = _.filter(formComps, (x) => _.some(datatodelete, (v) => _.keys(v).includes(x.key)))


    if (_.keys(masterupdate).length > 1) {
        // console.log('update')
        process.push(updateMaster(conn, masterupdate, CompMaster, user, table[0]))
    }

    if (datatoinsert.length > 0) {
        process.push(createDetail(conn, datatoinsert, CompDetailInsert, user, table[1]))
    }


    // console.log('component', datatoupdate[0])

    if (datatoupdate.length > 0) {
        process.push(updateDetail(conn, datatoupdate, CompDetailUpdate, user, table[1]))
    }

    if (datatodelete.length > 0) {
        process.push(deleteDetail(conn, datatodelete, CompDetailDelete, user, table[1]))
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

module.exports = {
    createmasterdetail,
    createMaster,
    createDetail,
    updateDetail,
    insertupdatemasterdetail,
    createmasteronly,
    deleteDetail
}