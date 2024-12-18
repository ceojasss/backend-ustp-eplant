const _ = require('lodash');
const oracledb = require('oracledb');
const dbCreds = require('./dbCredentials.js');

const { parseISO, format } = require('date-fns');
const { reject } = require('lodash');


oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


/*
 * call to database & form component
 */

const statement2 = `SELECT a.rowid "rowid",a.modulecode        "modulecode",
a.submodulecode     "submodulecode",
a.formname          "formname",
a.blockname         "blockname",
a.itemname          "itemname",
a.subitemname       "subitemname",
a.itemtype          "itemtype",
a.prompt_eng        "prompt_eng",
a.prompt_ina        "prompt_ina",
a.prompt_jpn        "prompt_jpn",
a.label_eng         "label_eng",
a.label_ina         "label_ina",
a.label_jpn         "label_jpn",
a.radioprompt       "radioprompt",
a.required          "required",
a.msg_id            "msg_id",
a.seq_order         "seq_order",
a.formcomponent "formcomponent",
a.tablecomponent "tablecomponent",
a.TABLEPARENTKEY "tableparentkey",
a.statusactive "statusactive",
a.itemclass "itemclass",
a.lovs "lovs",
a.groupclassseq "groupclassseq",    
a.groupclasstype "groupclasstype"  ,
a.groupcomponent "groupcomponent",
a.datatype "datatype",
a.datatypelength "datatypelength",
a.formtype "formtype",
a.form_visibility "form_visibility",
S.mod_code "mod_code",
a.LOVS_DEPENDENT_COMPONENT "lov_dependent",
a.child_component "child_component",
a.lov_list_item "lov_list_item",iseditable "iseditable",
a.lov_default_parameter "lov_default_parameter",
a.transactionbased "transactionbased"
,a.isunique "isunique",
a.default_value "default_value",
a.datetransaction "datetransaction",
a.footer "footer",
a.formula "formula"
FROM apps_component a, submodule s
WHERE     a.submodulecode = s.code
AND a.modulecode = s.module
AND s.route = :route
and groupcomponent is not null
order by a.seq_order`

const statement3 = `SELECT a.rowid ,a.modulecode        "modulecode",
a.submodulecode     "submodulecode",
a.formname          "formname",
a.blockname         "blockname",
a.itemname          "itemname",
a.subitemname       "subitemname",
a.itemtype          "itemtype",
a.prompt_eng        "prompt_eng",
a.prompt_ina        "prompt_ina",
a.prompt_jpn        "prompt_jpn",
a.label_eng         "label_eng",
a.label_ina         "label_ina",
a.label_jpn         "label_jpn",
a.radioprompt       "radioprompt",
a.required          "required",
a.msg_id            "msg_id",
a.seq_order         "seq_order",
a.formcomponent "formcomponent",
a.tablecomponent "tablecomponent",
a.statusactive "statusactive",
a.itemclass "itemclass",
a.lovs "lovs",
a.groupclassseq "groupclassseq",    
a.groupclasstype "groupclasstype"  ,
a.groupcomponent "groupcomponent",
a.datatype "datatype",
a.datatypelength "datatypelength",
a.formtype "formtype",
a.form_visibility "form_visibility",
S.mod_code "mod_code",
a.LOVS_DEPENDENT_COMPONENT "lov_dependent",
a.lov_list_item "lov_list_item",
a.child_component "child_component",
a.lov_default_parameter "lov_default_parameter",
a.isunique "isunique",
a.default_value "default_value",
a.datetransaction "datetransaction",
a.footer "footer",
a.formula "formula"
FROM apps_component a, submodule s
WHERE     a.submodulecode = s.code
AND a.modulecode = s.module
AND s.route = :routing
and groupcomponent is not null
order by a.seq_order`


const OraDbType = v => {

    switch (v) {
        case 'oracledb.DB_TYPE_NVARCHAR':
            return oracledb.DB_TYPE_NVARCHAR
        case 'oracledb.STRING':
        case 'oracledb.string':
            return oracledb.STRING
        case 'oracledb.NUMBER':
        case 'oracledb.number':
            return oracledb.NUMBER
        default:
            return oracledb.STRING;
    }
}

const limitQuery = subquery => {
    return `SELECT z.*,ceil ("total_rows"/:limitsize ) "max_page"
            FROM (SELECT a.*, COUNT (*) OVER () "total_rows", ROWNUM "rnum"
            FROM ( ${subquery} ) a)z
            WHERE "rnum" BETWEEN (( (:page+1) * :limitsize) - :limitsize + 1 ) and ((:page+1) * :limitsize)` }

const getdbCreds = (sites) => {

    switch (sites) {
        case 'GCM':
            return dbCreds.gcmPool.alias;
            break;
        case 'SMG':
            return dbCreds.smgPool.alias;
            break;
        case 'SBE':
            return dbCreds.sbePool.alias;
            break;
        case 'SLM':
            return dbCreds.slmPool.alias;
            break;
        case 'SJE':
            return dbCreds.sjePool.alias;
            break;
        default:
            return dbCreds.appsPool.alias;
            break;
    }

}

const appsExecute = async (statement, binds = []) => {

    options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };


    return new Promise(async (resolve, reject) => {
        let conn;
        let errors = {}
        try {
            conn = await oracledb.getConnection(dbCreds.appsPool)

            const result = await conn.execute(statement, binds, options)

            resolve(result)
        } catch (error) {

            errors = { 'errorNum': error.errorNum, 'errorMessage': error.message }

            //console.log(errors)
            reject(errors)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    // console.log(err)
                }
            }
        }
    });
}

const getObject = async (statement, binds = []) => {


    options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };


    return new Promise(async (resolve, reject) => {
        let conn;
        let errors = {}

        try {
            conn = await oracledb.getConnection(dbCreds.appsPool)

            const result = await conn.execute(statement, binds, options)

            resolve(result)
        } catch (error) {
            //   console.log(error.message)
            reject(error.message)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    reject('error reject ' + error.message)
                    //            console.log(err)
                }
            }
        }
    });
}

const siteExecute = async (users, statement, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;

        /*         opts.outFormat = oracledb.OBJECT; */

        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            extendedMetaData: true,               // get extra metadata
            // prefetchRows:     100,                // internal buffer allocation size for tuning
            // fetchArraySize:   100                 // internal buffer allocation size for tuning
        };

        //console.log('binds', binds)



        switch (users.site) {
            case 'GCM':
                dbConnection = dbCreds.gcmPool;
                break;
            case 'SMG':
                dbConnection = dbCreds.smgPool;
                break;
            case 'SBE':
                dbConnection = dbCreds.sbePool;
                break;
            case 'SLM':
                dbConnection = dbCreds.slmPool;
                break;
            case 'SJE':
                dbConnection = dbCreds.sjePool;
                break;
            default:
                dbConnection = dbCreds.appsPool;
                break;
        }

        try {
            conn = await oracledb.getConnection(dbConnection);


            const result = await conn.execute(statement, binds, opts)

            resolve(result)


        } catch (err) {
            // console.log('handler error',err)
            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    // console.log('DB error',err)
                }
            }
        }
    });
}

const siteWithDefExecute = async (users, routes, statement, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;

        /*         opts.outFormat = oracledb.OBJECT; */

        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            //extendedMetaData: true,               // get extra metadata
            // prefetchRows:     100,                // internal buffer allocation size for tuning
            // fetchArraySize:   100                 // internal buffer allocation size for tuning
        };

        binds2 = {}
        binds2.route = routes
        // console.log(binds)


        dbConnection = getdbCreds(users.site)

        try {
            conn = await oracledb.getConnection(dbConnection);

            const result1 = await conn.execute(statement, binds, opts)

            const result2 = await conn.execute(statement2, binds2, opts)

            resolve({ data: result1.rows, component: result2.rows })//)}, { columndata: result2.rows }])

            //            Object.assign(t[o.key] = t[o.key] || {}, o)

        } catch (err) {
            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    // console.log('error db',err)
                }
            }
        }
    });
}

const getAdminComponent = async (users, routes, opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;

        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        };
        binds = {}
        binds.routing = 'admin'
        binds2 = {}
        binds2.route = routes
        // console.log(binds)


        dbConnection = getdbCreds(users.site)

        try {
            conn = await oracledb.getConnection(dbConnection);
            const result = await conn.execute(statement3, binds, opts)
            const result2 = await conn.execute(statement2, binds2, opts)

            resolve({ data: result2.rows, component: result.rows })

        } catch (err) {
            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    // console.log('error db',err)
                }
            }
        }
    });
}


const getFormComponents = async (users, routes, opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;

        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        };

        binds2 = {}
        binds2.route = routes
        // console.log(binds)


        dbConnection = getdbCreds(users.site)

        try {
            conn = await oracledb.getConnection(dbConnection);
            const result2 = await conn.execute(statement2, binds2, opts)

            resolve(_.filter(_.map(result2.rows, (v) => {
                //  console.log('v', v)
                return {
                    key: v.formcomponent,
                    label: v['prompt_eng'],
                    registername: v['formcomponent'],
                    isrequired: v['required'],
                    fieldtype: v['itemtype'],
                    className: v['itemclass'],
                    classRows: v['groupclasstype'],
                    grouprowsseq: v['groupclassseq'],
                    datatype: v['datatype'],
                    type: v['datatype'],
                    lovs: v['lovs'],
                    disabled: v['subitemname'],
                    maxSize: v['datatypelength'],
                    lov_default_parameter: v['lov_default_parameter']
                }
            }), (o) => { return !_.isNull(o.registername) }))//)}, { columndata: result2.rows }])

        } catch (err) {
            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    // console.log('error db',err)
                }
            }
        }
    });
}


const siteLimitExecute = async (users, routes, statement, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;

        opts.outFormat = oracledb.OUT_FORMAT_OBJECT;
        binds2 = {}
        binds2.route = routes

        dbConnection = getdbCreds(users.site)

        //console.log(limitQuery(statement))

        try {
            conn = await oracledb.getConnection(dbConnection);

            const result = await conn.execute(limitQuery(statement), binds, opts)

            const result2 = await conn.execute(statement2, binds2, opts)

            resolve({ data: result.rows, component: result2.rows })

            //            resolve(result)
        } catch (err) {

            console.log('1', err)
            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    console.log('2', err)

                    reject(err)
                    // console.log(err)
                }
            }
        }
    });
}


const simpleExecute = async (statement, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        opts.outFormat = oracledb.OUT_FORMAT_OBJECT;


        try {
            conn = await oracledb.getConnection(dbCreds.usPool);

            //  console.log(statement)
            const result = await conn.execute(statement, binds, opts)

            resolve(result)
        } catch (err) {
            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    // console.log(err)
                }
            }
        }
    });
}

const headerDetail = async (statement, statementdetails, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;
        opts.outFormat = oracledb.OUT_FORMAT_OBJECT;
        // opts.autoCommit = true;

        try {
            conn = await oracledb.getConnection(dbCreds.defaultPool);



            const header = await conn.execute(statement, binds, opts)
            const detail = await conn.execute(statementdetails, binds, opts)


            resolve({ header, detail })
        } catch (err) {
            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    // console.log(err)
                }
            }
        }
    });
}

const functionExecute = async (statement, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        opts.outFormat = oracledb.OUT_FORMAT_OBJECT;

        //  console.log(dbCreds.usPool , binds)
        try {
            conn = await oracledb.getConnection(dbCreds.usPool);

            const result = await conn.execute(
                statement,
                binds,
                opts
            );

            resolve(result)

        } catch (err) {
            // console.log(`error db executes -> ${JSON.stringify(err)}`)

            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    // console.log(err)
                }
            }
        }
    });
}

const insertdata = async (table, user, datas, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;
        let binds = [];
        let formCompsClean;

        const { data, formComps } = datas

        try {
            dbConnection = getdbCreds(user.site)

            data.map(v => binds.push(
                Object.fromEntries(
                    Object.entries(v).filter(
                        ([key]) => !key.includes('displayonly')
                    )
                )
            )
            )

            let accessor = Object.keys(binds[0])
            formCompsClean = formComps.filter(x => accessor.includes(x.key))

            let column = [], columnbinding = []




            formCompsClean.map(({ fieldtype, key }) => {
                let fvals = ''

                if (fieldtype === 'inputdate') {
                    fvals = `TO_TIMESTAMP_TZ(:${key}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                } else {
                    fvals = `:${key}`
                }

                columnbinding.push(fvals)
                column.push(key)
            })

            let insertstatement = `insert into ${table} (${column.join(',')}) values(${columnbinding.join(',')}) returning rowid into :rids`
            let bindefs = _.mapKeys(_.map(formCompsClean, ({ key, type, maxSize }) => ({ key: key, type: OraDbType(type), maxSize: Number(maxSize) })), 'key')

            console.log(insertstatement, binds)

            _.merge(bindefs, { 'rids': { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 45 } })

            const options = {
                autoCommit: true,
                bindDefs: bindefs
            }

            conn = await oracledb.getConnection(dbConnection);
            const result = await conn.executeMany(insertstatement, binds, options)

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

const insertdatas = async (table, user, datas, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;
        let binds = [];
        let formCompsClean;

        const { data, formComps } = datas

        // * 1. copy data to be inserted from datas param  */
        const datatoinsert = Object.values({ ...data[0].inputgrid })

        // * 2. re-check if datainserted value is an object, then get first value of object
        _.map(datatoinsert, (c) => {
            _.mapValues(c, (o, key) => {
                if (_.isObject(o))
                    _.set(c, key, Object.values(o)[0])

            })
        })

        try {
            dbConnection = getdbCreds(user.site)

            data.map(v => binds.push(
                Object.fromEntries(
                    Object.entries(v).filter(
                        ([key]) => !key.includes('displayonly')
                    )
                )
            )
            )

            let accessor = Object.keys(datatoinsert[0])

            formCompsClean = formComps.filter(x => accessor.includes(x.key))

            let column = [], columnbinding = []

            formCompsClean.map(({ fieldtype, key }) => {
                let fvals = ''

                if (fieldtype.match(/^(inputtime|inputdate)$/)) {
                    fvals = `TO_TIMESTAMP_TZ(:${key}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                } else {
                    fvals = `:${key}`
                }

                columnbinding.push(fvals)
                column.push(key)
            })

            // console.log(formCompsClean)

            let insertstatement = `insert into ${table} (${column.join(',')}) values(${columnbinding.join(',')}) returning rowid into :rids`
            let bindefs = _.mapKeys(_.map(formCompsClean, ({ key, datatype, maxSize }) => ({ key: key, type: OraDbType(datatype), maxSize: Number(maxSize) })), 'key')

            _.merge(bindefs, { 'rids': { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 45 } })

            const options = {
                autoCommit: true,
                bindDefs: bindefs
            }

            conn = await oracledb.getConnection(dbConnection);
            const result = await conn.executeMany(insertstatement, datatoinsert, options)

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

const insertdataheader = async (table, user, datas, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;
        let binds = [];
        let formCompsClean;

        const { data, formComps } = datas

        try {
            dbConnection = getdbCreds(user.site)

            data.map(v => binds.push(
                Object.fromEntries(
                    Object.entries(v).filter(
                        ([key]) => !key.includes('displayonly')
                    )
                )
            )
            )

            let accessor = Object.keys(binds[0])
            formCompsClean = formComps.filter(x => accessor.includes(x.key))

            let column = [], columnbinding = []




            formCompsClean.map(({ fieldtype, key }) => {
                let fvals = ''

                if (fieldtype === 'inputdate') {
                    fvals = `TO_TIMESTAMP_TZ(:${key}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                } else {
                    fvals = `:${key}`
                }

                columnbinding.push(fvals)
                column.push(key)
            })

            let insertstatement = `insert into ${table} (${column.join(',')}) values(${columnbinding.join(',')}) returning rowid into :rids`
            let bindefs = _.mapKeys(_.map(formCompsClean, ({ key, type, maxSize }) => ({ key: key, type: OraDbType(type), maxSize: Number(maxSize) })), 'key')

            console.log(insertstatement, binds)

            _.merge(bindefs, { 'rids': { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 45 } })

            const options = {
                autoCommit: true,
                bindDefs: bindefs
            }

            conn = await oracledb.getConnection(dbConnection);
            const result = await conn.executeMany(insertstatement, binds, options)

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

const insertGrid = async (conn, datas, formComps, user, table) => {
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

            accessor = Object.keys(datas[0])

            formCompsClean = _.filter(formComps, (x) => accessor.includes(x.key))

            formCompsClean.map(({ fieldtype, key }) => {
                let fvals = ''

                if (fieldtype.match(/^(inputtime|inputdate)$/)) {
                    fvals = `TO_TIMESTAMP_TZ(:${key}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                } else {
                    fvals = `:${key}`
                }

                columnbinding.push(fvals)
                column.push(key)
            })

            insertstatement = `insert into ${table} (${column.join(',')}) values(${columnbinding.join(',')}) returning rowid into :rids`

            bindefs = _.mapKeys(_.map(formCompsClean, ({ key, datatype, maxSize }) => ({ key: key, type: OraDbType(datatype), maxSize: Number(maxSize) })), 'key')
            _.merge(bindefs, { 'rids': { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 45 } })

            const result = await conn.executeMany(insertstatement, datas, options = { autoCommit: false, bindDefs: bindefs })

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


const updateGrid = async (conn, datas, formComps, user, table) => {


    const retval = await Promise.all(_.map(datas, (data) => {
        return new Promise(async (resolve, reject) => {

            let formCompsClean;
            let updateData = _.omit(data, 'rowids')


            try {


                let accessor = Object.keys(updateData)

                console.log('update', accessor)

                formCompsClean = formComps.filter(x => accessor.includes(x.key))

                let binding = formCompsClean.map((x) => {
                    // ! manually set data for datatype date

                    if (x['fieldtype'] === 'inputdate')
                        return `${x['key']} = TO_TIMESTAMP_TZ(:${x['key'].replace(/ /g)}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`

                    return `${x['key']} = :${x['key'].replace(/ /g)}`

                }).join(",")

                let updateStatement = `UPDATE ${table} set ${binding} where rowid = :rowids`

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
    }))//.then((v) => { return v })

    //S console.log(retval)

    return retval

}

const insertupdatedatas = async (table, user, datas) => {

    let retval, process = [];
    let conn;
    let dbConnection;
    const { data, formComps } = datas


    dbConnection = getdbCreds(user.site)
    conn = await oracledb.getConnection(dbConnection);

    // * 1. split data object for insert & update object
    const datatoinsert = Object.values({ ...data[0].inserts })
    const datatoupdate = Object.values({ ...data[0].updates })


    // * 2. shape insert data, flattening object as values
    _.map(datatoinsert, (c) => {
        _.mapValues(c, (o, key) => {
            if (_.isObject(o))
                _.set(c, key, Object.values(o)[0])

        })
    })

    // * 3. shape update data, flattening object as values
    _.map(datatoupdate, (c) => {
        _.mapValues(c, (o, key) => {
            if (_.isObject(o))
                _.set(c, key, Object.values(o)[0])

        })
    })

    if (datatoinsert.length > 0) {
        process.push(insertGrid(conn, datatoinsert, formComps, user, table))
    }

    if (datatoupdate.length > 0) {
        process.push(updateGrid(conn, datatoupdate, formComps, user, table))
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


const updateData = async (table, user, datas, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;
        let binds = [];
        let formCompsClean;

        const { data, formComps } = datas

        let rowid = _.pick(data[0], 'rowids')
        let updateData = _.omit(data[0], 'rowids')

        //console.log('data', _.omit(data[0], 'rowid'))

        console.log('update', Object.assign({}, data[0]))

        try {


            let accessor = Object.keys(updateData)

            formCompsClean = formComps.filter(x => accessor.includes(x.key))

            let binding = formCompsClean.map((x) => {
                // ! manually set data for datatype date

                if (x['fieldtype'] === 'inputdate')
                    return `${x['key']} = TO_TIMESTAMP_TZ(:${x['key'].replace(/ /g)}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`

                return `${x['key']} = :${x['key'].replace(/ /g)}`

            }).join(",")

            let updateStatement = `UPDATE ${table} set ${binding} where rowid = :rowids`

            console.log(updateStatement)

            const options = {
                outFormat: oracledb.OBJECT,
                autoCommit: true,
                //  bindDefs: bindefs
            }

            //opts.outFormat = oracledb.OBJECT;


            dbConnection = getdbCreds(user.site)

            conn = await oracledb.getConnection(dbConnection);

            //const result = await conn.executeMany(updateStatement, binds, options)


            result = await conn.execute(updateStatement, data[0], options)

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
            // console.log('masuk error', error)
            throw new Error(error)
            //reject(error)
        }
    );;
}

const DynamicTable = async (users, routes, statement, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;

        /*         opts.outFormat = oracledb.OBJECT; */

        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            //extendedMetaData: true,               // get extra metadata
            // prefetchRows:     100,                // internal buffer allocation size for tuning
            // fetchArraySize:   100                 // internal buffer allocation size for tuning
        };

        binds2 = {}
        binds2.route = routes
        // console.log(binds)


        dbConnection = getdbCreds(users.site)

        try {
            conn = await oracledb.getConnection(dbConnection);

            //const result1 = await conn.execute(statement, binds, opts)

            const result2 = await conn.execute(statement2, binds2, opts)

            resolve({/*  data: result1.rows, */ component: result2.rows })//)}, { columndata: result2.rows }])

            //            Object.assign(t[o.key] = t[o.key] || {}, o)

        } catch (err) {
            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    // console.log(err)
                }
            }
        }
    });
}

const deleteData = async (table, user, id) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;
        let binds = [];
        let stmt;
        //let opts = {};

        //opts.outFormat = oracledb.OUT_FORMAT_OBJECT;

        const options = {
            autoCommit: true,
            //   bindefs: _.mapKeys(formComps.map(x => _.pick(x, ['key', 'datatype'])), 'key')
        }

        binds = [{ Id: id }]
        //const { data, formComps } = datas

        dbConnection = getdbCreds(user.site)

        stmt = `DELETE ${table} where rowid = :Id`

        // console.log(binds)


        try {
            conn = await oracledb.getConnection(dbConnection);

            const result = await conn.executeMany(stmt, binds, options)


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

    });
}


const siteExecuteDynamicBinds = async (users, statement, binds, opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;

        /*         opts.outFormat = oracledb.OBJECT; */

        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            extendedMetaData: true,               // get extra metadata
            // prefetchRows:     100,                // internal buffer allocation size for tuning
            // fetchArraySize:   100                 // internal buffer allocation size for tuning
        };

        dbConnection = getdbCreds(users.site)

        try {
            conn = await oracledb.getConnection(dbConnection);
            const result = await conn.execute(statement, binds, opts)
            resolve(result)

        } catch (err) {
            reject({
                num: err.errorNum,
                message: err.message
            })
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    // console.log('DB error',err)
                }
            }
        }
    });
}

const execFunction = async (conn, statement, binds = [], opts = {}) => {

    return new Promise(async (resolve, reject) => {

        opts.outFormat = oracledb.OUT_FORMAT_OBJECT;

        //  console.log(dbCreds.usPool , binds)

        try {

            const result = await conn.execute(
                statement,
                binds,
                opts
            );

            resolve(result)

        } catch (err) {
            reject(err)
        }
    });
}


module.exports = {
    /* initConnection,
    closeConnection,
     */simpleExecute,
    OraDbType,
    insertdataheader,
    headerDetail,
    functionExecute,
    appsExecute,
    getObject,
    siteExecute,
    siteLimitExecute,
    siteWithDefExecute,
    insertdata,
    DynamicTable,
    deleteData,
    updateData,
    siteExecuteDynamicBinds,
    getFormComponents,
    getAdminComponent,
    insertdatas,
    insertupdatedatas,
    updateGrid,
    insertGrid,
    getdbCreds,
    execFunction
}
