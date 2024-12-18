const _ = require('lodash');
const oracledb = require('oracledb');
const dbCreds = require('./dbCredentials.js');


oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

/*
 * call to database & form component
 */

const statement2 = `SELECT a.ROWID                                      "rowid",
       a.modulecode                                 "modulecode",
       a.submodulecode                              "submodulecode",
       a.formname                                   "formname",
       a.blockname                                  "blockname",
       a.itemname                                   "itemname",
       a.subitemname                                "subitemname",
       a.itemtype                                   "itemtype",
       a.prompt_eng                                 "prompt_eng",
       a.prompt_ina                                 "prompt_ina",
       a.prompt_jpn                                 "prompt_jpn",
       a.label_eng                                  "label_eng",
       a.label_ina                                  "label_ina",
       a.label_jpn                                  "label_jpn",
       a.radioprompt                                "radioprompt",
       a.required                                   "required",
       a.msg_id                                     "msg_id",
       a.seq_order                                  "seq_order",
       a.formcomponent                              "formcomponent",
       a.tablecomponent                             "tablecomponent",
       a.TABLEPARENTKEY                             "tableparentkey",
       a.statusactive                               "statusactive",
       a.itemclass                                  "itemclass",
       a.lovs                                       "lovs",
       a.groupclassseq                              "groupclassseq",
       a.groupclasstype                             "groupclasstype",
       a.groupcomponent                             "groupcomponent",
       a.datatype                                   "datatype",
       a.datatypelength                             "datatypelength",
       a.formtype                                   "formtype",
       a.form_visibility                            "form_visibility",
       S.mod_code                                   "mod_code",
       a.LOVS_DEPENDENT_COMPONENT                   "lov_dependent",
       a.child_component                            "child_component",
       a.lov_list_item                              "lov_list_item",
       iseditable                                   "iseditable",
       a.lov_default_parameter                      "lov_default_parameter",
       a.transactionbased                           "transactionbased",
       a.isunique                                   "isunique",
       a.DEFAULT_VALUE                              "default_value",
       a.datetransaction                            "datetransaction",
       a.footer                                     "footer",
       a.formula                                    "formula",
       a.textalign                                  "textalign",
       a.autonumber_param                           "autonumber_param",
       a.sneak_peek                                 "sneak_peek",
       a.LOV_DEPENDENT_VALUES                       "lov_dependent_values",
       a.groupclassname                             "groupclassname",
       a.table_visibility                           "table_visibility",
       a.is_child_key                               "is_child_key",
       TO_CHAR (pr.startdate, 'dd/mm/yyyy')         "startdate",
       TO_CHAR (pr.enddate, 'dd/mm/yyyy')           "enddate",
       pr.periodctlid                               "periodctlid",
       a.icon                                       "icon",
       a.min_value                                  "min_value",
       a.readonly                                   "readonly",
       s.formtype                                   "masterdetailtype",
       s.flag_autoapprove                           "autoapprove",
       a.requireds                                  "validation_status",
       a.disabledcomponent                          "disabledcomponent",
       s.enable_wf                                  "formversion",
       X.ISDELETE                                   "isdelete",
       X.ISUPDATE                                   "isupdate",
       X.ISINSERT                                   "isinsert",
       X.isapprove                                  "isapprove",
       X.AUTHORIZED                                 "authorized",
       S.CALTYPE                                    "caltype",
       S.filtertype                                    "filtertype",
       S.filter1                                    "filter1",
       S.filter2                                    "filter2",
       s.editstatus "editstatus",
       a.field_dependence "field_dependence",
       a.action "action",
       a.is_detail_ref "is_detail_ref" 
       FROM apps_component a,
       submodule     s,
       accessrights  x,
       (SELECT accyear, periodseq, periodctlid, startdate, enddate
          FROM periodctlmst
         /*WHERE isclosed in ( 0,2) or remarks = 'AUDIT'*/) pr
         ,periodcontrol pc,
         module_shortname m
 WHERE     a.submodulecode = s.code
       AND a.modulecode = s.module
       AND s.code = x.submodulecode
       AND s.module = X.MODULECODE
       AND x.loginid = :loginid
       AND s.route = :route
       and pc.system = m.module
       and s.mod_code = m.shortname
       AND groupcomponent IS NOT NULL
       and pr.periodseq = pc.currentperiodseq 
       and pr.accyear = pc.CURRENTACCYEAR
ORDER BY a.seq_order`

/*      FROM apps_component a,
      submodule     s,
      accessrights  x,
      (SELECT periodctlid, startdate, enddate
         FROM periodctlmst
        WHERE isclosed = 0 AND ROWNUM = 1) pr
WHERE     a.submodulecode = s.code
      AND a.modulecode = s.module
      AND s.code = x.submodulecode
      AND s.module = X.MODULECODE
      AND x.loginid = :loginid
      AND s.route = :route
      AND groupcomponent IS NOT NULL
ORDER BY a.seq_order`*/

const statement3 = `SELECT a.rowid ,a.modulecode "modulecode",
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
a.formula "formula",
a.textalign "textalign",
a.autonumber_param "autonumber_param",
a.sneak_peek "sneak_peek",
a.LOV_DEPENDENT_VALUES "lov_dependent_values",
a.groupclassname "groupclassname",
a.table_visibility "table_visibility",
a.is_child_key "is_child_key",
to_char(pr.startdate,'dd/mm/yyyy') "startdate",to_char(pr.enddate,'dd/mm/yyyy') "enddate", pr.periodctlid "periodctlid",
a.icon "icon",
a.min_value "min_value",
a.readonly "readonly",
s.formtype "masterdetailtype",
s.flag_autoapprove "autoapprove",
a.disabledcomponent "disabledcomponent",
a.requireds "validation_status",
S.CALTYPE                                    "caltype",
S.filtertype                                    "filtertype",
S.filter1                                    "filter1",
S.filter2                                    "filter2",
s.editstatus "editstatus",
a.field_dependence "field_dependence",
a.action "action",
a.is_detail_ref "is_detail_ref"
FROM apps_component a, submodule s,(select periodctlid,startdate,enddate
    from periodctlmst
   where isclosed = 0
   and rownum = 1) pr
WHERE     a.submodulecode = s.code
AND a.modulecode = s.module
AND s.route = :routing
and groupcomponent is not null
order by a.seq_order`

const formComponentOnly = `SELECT a.ROWID                                      "rowid",
a.modulecode                                 "modulecode",
a.submodulecode                              "submodulecode",
a.formname                                   "formname",
a.blockname                                  "blockname",
a.itemname                                   "itemname",
a.subitemname                                "subitemname",
a.itemtype                                   "itemtype",
a.prompt_eng                                 "prompt_eng",
a.prompt_ina                                 "prompt_ina",
a.prompt_jpn                                 "prompt_jpn",
a.label_eng                                  "label_eng",
a.label_ina                                  "label_ina",
a.label_jpn                                  "label_jpn",
a.radioprompt                                "radioprompt",
a.required                                   "required",
a.msg_id                                     "msg_id",
a.seq_order                                  "seq_order",
a.formcomponent                              "formcomponent",
a.tablecomponent                             "tablecomponent",
a.TABLEPARENTKEY                             "tableparentkey",
a.statusactive                               "statusactive",
a.itemclass                                  "itemclass",
a.lovs                                       "lovs",
a.groupclassseq                              "groupclassseq",
a.groupclasstype                             "groupclasstype",
a.groupcomponent                             "groupcomponent",
a.datatype                                   "datatype",
a.datatypelength                             "datatypelength",
a.formtype                                   "formtype",
a.form_visibility                            "form_visibility",
S.mod_code                                   "mod_code",
a.LOVS_DEPENDENT_COMPONENT                   "lov_dependent",
a.child_component                            "child_component",
a.lov_list_item                              "lov_list_item",
iseditable                                   "iseditable",
a.lov_default_parameter                      "lov_default_parameter",
a.transactionbased                           "transactionbased",
a.isunique                                   "isunique",
a.DEFAULT_VALUE                              "default_value",
a.datetransaction                            "datetransaction",
a.footer                                     "footer",
a.formula                                    "formula",
a.textalign                                  "textalign",
a.autonumber_param                           "autonumber_param",
a.sneak_peek                                 "sneak_peek",
a.LOV_DEPENDENT_VALUES                       "lov_dependent_values",
a.groupclassname                             "groupclassname",
a.table_visibility                           "table_visibility",
a.is_child_key                               "is_child_key",
a.icon                                       "icon",
a.min_value                                  "min_value",
a.readonly                                   "readonly",
s.formtype                                   "masterdetailtype",
s.flag_autoapprove                           "autoapprove",
a.requireds                                  "validation_status",
a.disabledcomponent                          "disabledcomponent",
S.CALTYPE                                    "caltype",
S.filtertype                                    "filtertype",
S.filter1                                    "filter1",
S.filter2                                    "filter2",
s.parameter4 "component_load_type",
a.field_dependence "field_dependence",
a.action "action",
a.is_detail_ref "is_detail_ref"
FROM apps_component a,
submodule     s
WHERE     a.submodulecode = s.code
AND a.modulecode = s.module
AND s.route = :route
AND groupcomponent IS NOT NULL
ORDER BY a.seq_order`

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
            return dbCreds.gcmPool.poolAlias;
        case 'SMG':
            return dbCreds.smgPool.poolAlias;
        case 'SBE':
            return dbCreds.sbePool.poolAlias;
        case 'SLM':
            return dbCreds.slmPool.poolAlias;
        case 'SJE':
            return dbCreds.sjePool.poolAlias;
        case 'USTP':
            return dbCreds.usPool.poolAlias;
        case 'WEB':
            return dbCreds.webPool.poolAlias;
        case 'TST':
            return dbCreds.tstPool.poolAlias;
        default:
            return dbCreds.appsPool.poolAlias;
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

            reject(errors)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    console.log('appsExecute', err)
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
    let dbConnection;



    try {
        dbConnection = getdbCreds(binds.site)
    } catch (error) {
        reject(error)
    }

    return new Promise(async (resolve, reject) => {
        let conn;
        let errors = {}

        try {
            conn = await oracledb.getConnection(dbConnection/* dbCreds.appsPool.poolAlias */)

            const result = await conn.execute(statement, binds, options)

            resolve(result)
        } catch (error) {
            console.log('error getObject ', error.message)

            reject(error.message)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    reject('getObject', error.message)
                }
            }
        }
    });
}

const getSiteObject = async (statement, binds = [], siteconnection) => {


    options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };
    let dbConnection;



    try {
        dbConnection = getdbCreds(siteconnection)
    } catch (error) {
        reject(error)
    }

    return new Promise(async (resolve, reject) => {
        let conn;
        let errors = {}

        try {
            conn = await oracledb.getConnection(dbConnection/* dbCreds.appsPool.poolAlias */)


            const result = await conn.execute(statement, binds, options)

            resolve(result)
        } catch (error) {
            console.log('getSiteObject ', error.message)
            reject(error.message)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    reject('close getSiteObject ', error.message)
                }
            }
        }
    });
}

const getAppsObject = async (statement, binds = []) => {


    options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };
    let dbConnection;



    return new Promise(async (resolve, reject) => {
        let conn;
        let errors = {}

        try {
            conn = await oracledb.getConnection(dbCreds.appsPool.poolAlias)

            const result = await conn.execute(statement, binds, options)

            resolve(result)
        } catch (error) {
            reject(error.message)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    reject('getAppsObject ', error.message)
                }
            }
        }
    });
}

const siteExecute = async (users, statement, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;

        //console.log('query', statement)

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
            console.log('siteExecute', err)
            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    console.log('close siteExecute', err)
                }
            }
        }
    });
}

const fetchTemporaryData = async (users, statement, binds = [], opts = {}) => {
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

            await conn.execute(`begin rpt_paymnent_prod_r01_draft (1,'GCM/PV/K/2207/03581'); end;`);
            const result = await conn.execute(statement, (_.size(binds) === 0 ? [] : binds), opts)


            resolve(result)


        } catch (err) {
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
            // console.log('handler error',err)
            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    //  console.log(conn)
                    await conn.close()
                } catch (err) {
                    console.log('DB error', err)
                }
            }
        }
    });
}

const executeStmt = async (users, statement, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;

        /*         opts.outFormat = oracledb.OBJECT; */

        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            autoCommit: true,
            extendedMetaData: true,               // get extra metadata
            // prefetchRows:     100,                // internal buffer allocation size for tuning
            // fetchArraySize:   100                 // internal buffer allocation size for tuning
        };

        //console.log('binds', binds)

        dbConnection = getdbCreds(users.site)

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


        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            //extendedMetaData: true,               // get extra metadata
            // prefetchRows:     100,                // internal buffer allocation size for tuning
            // fetchArraySize:   100                 // internal buffer allocation size for tuning
        };


        binds2 = {}
        binds2.route = routes.match('/') ? routes.substr(0, routes.indexOf('/')) : routes
        binds2.loginid = users.loginid


        dbConnection = getdbCreds(users.site)

        try {
            conn = await oracledb.getConnection(dbConnection);

            const result1 = await conn.execute(statement, binds, opts)
            const result2 = await conn.execute(statement2, binds2, opts)

            resolve({ data: result1.rows, component: result2.rows })


        } catch (err) {
            reject(err)
        } finally {
            if (conn) {
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
        // binds.loginids = users.loginid
        binds2 = {}
        binds2.route = routes
        binds2.loginid = users.loginid
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

const getReportComponent = async (routing, users, routes, opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;

        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        };


        binds = {}
        binds.routing = 'report'
        // binds.loginids = users.loginid

        binds2 = {}
        binds2.routing = routes
        binds2.loginid = users.loginid


        try {
            dbConnection = getdbCreds(users.site)
        } catch (error) {
            reject(error)
        }



        const stmt = `  SELECT REGISTRYID            "registryid",
        r.MODULECODE          "modulecode",
        r.subMODULECODE       "submodulecode",
        REPORTDESC            "reportdesc",
        REPORTNAME            "reportname",
        STATUS                "status",
        REPORTNAME_STATUS     "reportname_status",
        route "route"
        FROM REGISTRYREPORT r, module m, accessrights a
        WHERE     m.code = r.modulecode
        AND loginid = :loginid
        AND LOWER (controlsystem) = LOWER ( :routing)
        AND m.code = a.modulecode
        AND a.submodulecode = r.submodulecode
        AND AUTHORIZED = 'Y'
        AND status = 'Y'
        ORDER BY registryid `

        try {
            conn = await oracledb.getConnection(dbConnection);


            // console.log(conn)

            const result = await conn.execute(statement3, binds, opts)
            const result2 = await conn.execute(stmt, binds2, opts)


            resolve({ data: result2.rows, component: result.rows })

        } catch (err) {
            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    reject(err)
                }
            }
        }
    });
}

const getReportComponentDetail = async (routing, users, routes, registryid, opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;

        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        };


        binds2 = {}

        binds2.registryid = registryid


        try {
            dbConnection = getdbCreds(users.site)
        } catch (error) {
            reject(error)
        }

        const stmt = `SELECT REGISTRYID          "registryid",
        PARAM_SEQ           "param_seq",
        PARAM_CODE          "param_code",
        PARAM_DISPLAY       "param_display",
        ITEMTYPE            "itemtype",
        DATATYPE            "datatype",
        DEF_VALUE           "def_value",
        DISPLAYITEM         "displayitem",
        ATTRB               "attrb",
        QUERY_LANG          "query_lang",
        ISVALUEASREPORT     "isvalueasreport",
        ISREQUIRED          "isrequired",
        ITEMLINK            "itemlink"
   FROM registryreportweb
   where registryid = :registryid
   order by param_seq`

        const stmtRB = `SELECT REGISTRYID     "registryid",
   PARAM_SEQ      "param_seq",
   rb_seq         "rb_seq",
   rb_label        "rb_label",
   rb_val         "rb_val"
FROM registryradiogroup
WHERE registryid = :registryid
order by rb_seq`

        try {

            //console.log('conn ', dbConnection)
            conn = await oracledb.getConnection(dbConnection);

            let res = {}


            if (!conn)
                reject('connection not found')


            // conn.close()

            const result2 = await conn.execute(stmt, binds2, opts)
            const resultRB = await conn.execute(stmtRB, binds2, opts)

            //_.assignIn(result2, { radiobutton: resultRB })

            const result = result2.rows

            res = _.map(result,
                (v) => {
                    if (_.some(resultRB.rows, ['param_seq', v.param_seq]) && v.itemtype === 'radiogroup') {
                        return _.assignIn(v, { 'rb': resultRB.rows })
                    } else {
                        return v
                    }
                }
            )


            resolve(res)

        } catch (err) {

            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {

                    reject(err)
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
        binds2.loginid = users.loginid
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

const getFormComponent = async (users, routes, opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;

        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        };

        binds2 = {}
        binds2.route = routes

        dbConnection = getdbCreds(users.site)

        try {

            conn = await oracledb.getConnection(dbConnection);

            const result2 = await conn.execute(formComponentOnly, binds2, opts)

            resolve(result2.rows)

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
        binds2.loginid = users.loginid

        dbConnection = getdbCreds(users.site)


        try {
            conn = await oracledb.getConnection(dbConnection);



            const b = statement.includes('loginid') ? _.merge(binds, { loginid: users.loginid }) : binds


            const result = await conn.execute(limitQuery(statement), statement.includes('loginid') ? _.merge(binds, { loginid: users.loginid }) : binds, opts)


            const result2 = await conn.execute(statement2, binds2, opts)

            resolve({ data: result.rows, component: result2.rows })

        } catch (err) {

            reject(err.message)
        } finally {

            if (conn) { // conn assignment worked, need to close
                await conn.close()
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

                if (fieldtype.match(/^(inputtime|inputdate|inputdatesimple)$/)) {
                    //  fvals = `TO_TIMESTAMP_TZ(:${key}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                    fvals = `TO_DATE(:${key.replace(/ /g)},'dd-mm-yyyy hh24:mi')`
                } else {
                    fvals = `:${key}`
                }

                columnbinding.push(fvals)
                column.push(key)
            })

            let insertstatement = `insert into ${table} (${column.join(',')}) values(${columnbinding.join(',')}) returning rowid into :rids`
            let bindefs = _.mapKeys(_.map(formCompsClean, ({ key, type, maxSize }) => ({ key: key, type: OraDbType(type), maxSize: Number(maxSize) })), 'key')

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

                if (fieldtype.match(/^(inputtime|inputdate|inputdatesimple)$/)) {
                    //fvals = `TO_TIMESTAMP_TZ(:${key}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                    fvals = `TO_DATE(:${key.replace(/ /g)},'dd-mm-yyyy hh24:mi')`
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

                if (fieldtype.match(/^(inputtime|inputdate|inputdatesimple)$/)) {
                    //fvals = `TO_TIMESTAMP_TZ(:${key}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                    fvals = `TO_DATE(:${key.replace(/ /g)},'dd-mm-yyyy hh24:mi')`
                } else {
                    fvals = `:${key}`
                }

                columnbinding.push(fvals)
                column.push(key)
            })

            let insertstatement = `insert into ${table} (${column.join(',')}) values(${columnbinding.join(',')}) returning rowid into :rids`
            let bindefs = _.mapKeys(_.map(formCompsClean, ({ key, type, maxSize }) => ({ key: key, type: OraDbType(type), maxSize: Number(maxSize) })), 'key')


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

    // ! this not standalone function ( should note call close connection function )

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

                if (fieldtype.match(/^(inputtime|inputdate|inputdatesimple)$/)) {
                    //fvals = `TO_TIMESTAMP_TZ(:${key}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                    fvals = `TO_DATE(:${key.replace(/ /g)},'dd-mm-yyyy hh24:mi')`
                } else {
                    fvals = `:${key}`
                }

                columnbinding.push(fvals)
                column.push(key)
            })

            insertstatement = `insert into ${table} (${column.join(',')}) values(${columnbinding.join(',')}) returning rowid into :rids`

            //   console.log(insertstatement)

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
    )
}

const updateGrid = async (conn, datas, formComps, user, table) => {


    const retval = await Promise.all(_.map(datas, (data) => {
        return new Promise(async (resolve, reject) => {

            let formCompsClean;
            let updateData = _.omit(data, 'rowids')


            try {


                let accessor = Object.keys(updateData)


                formCompsClean = formComps.filter(x => accessor.includes(x.key))

                let binding = formCompsClean.map((x) => {
                    // ! manually set data for datatype date

                    if (x['fieldtype'].match(/^(inputtime|inputdate|inputdatesimple)$/))
                        //return `${x['key']} = TO_TIMESTAMP_TZ(:${x['key'].replace(/ /g)}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                        return `${x['key']} = TO_DATE(:${x['key'].replace(/ /g)},'dd-mm-yyyy hh24:mi')`

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

const updateDataAdmin = async (table, user, datas, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;
        let binds = [];
        let formCompsClean;

        const { data, formComps } = datas

        let rowid = _.pick(data[0], 'rowids')
        let updateData = _.omit(data[0], 'rowids').header

        //console.log('update', updateData)

        try {


            let accessor = Object.keys(updateData)


            formCompsClean = formComps.filter(x => accessor.includes(x.key))

            let binding = formCompsClean.map((x) => {
                // ! manually set data for datatype date

                if (x['fieldtype'].match(/^(inputtime|inputdate|inputdatesimple)$/))
                    //return `${x['key']} = TO_TIMESTAMP_TZ(:${x['key'].replace(/ /g)}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                    return `${x['key']} = TO_DATE(:${x['key'].replace(/ /g)},'dd-mm-yyyy hh24:mi')`

                return `${x['key']} = :${x['key'].replace(/ /g)}`

            }).join(",")

            let updateStatement = `UPDATE ${table} set ${binding} where rowid = :ROWIDS`

            const options = {
                outFormat: oracledb.OBJECT,
                autoCommit: true,
                //  bindDefs: bindefs
            }


            dbConnection = getdbCreds(user.site)

            conn = await oracledb.getConnection(dbConnection);

            result = await conn.execute(updateStatement, updateData, options)

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

const updateData = async (table, user, datas, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;
        let binds = [];
        let formCompsClean;

        const { data, formComps } = datas
        _.map(data[0], v => binds.push(
            Object.fromEntries(
                Object.entries(v).filter(
                    ([key]) => !key.includes('displayonly')
                )
            )
        )
        )


        binds = _.reject(binds, _.isEmpty)
        let rowid = _.pick(data[0], 'rowids')
        // let updateData = _.omit(data[0], 'rowids').header
        let updateData = _.find(binds)

        try {

            // console.log(updateData,_.find(binds))

            let accessor = Object.keys(updateData)
            formCompsClean = formComps.filter(x => accessor.includes(x.key))

            let binding = formCompsClean.map((x) => {
                // ! manually set data for datatype date

                if (x['fieldtype'].match(/^(inputtime|inputdate|inputdatesimple)$/))
                    //return `${x['key']} = TO_TIMESTAMP_TZ(:${x['key'].replace(/ /g)}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                    return `${x['key']} = TO_DATE(:${x['key'].replace(/ /g)},'dd-mm-yyyy hh24:mi')`

                return `${x['key']} = :${x['key'].replace(/ /g)}`

            }).join(",")


            let updateby = `updateby=:updateby`

            let updateStatement = `UPDATE ${table} set ${binding},${updateby} where rowid = :ROWIDS`
            const users = (_.isUndefined(user.loginid) ? user.sub : user.loginid)

            Object.assign(updateData, { updateby: users })
            const options = {
                outFormat: oracledb.OBJECT,
                autoCommit: true,
                //  bindDefs: bindefs
            }


            dbConnection = getdbCreds(user.site)

            conn = await oracledb.getConnection(dbConnection);
            result = await conn.execute(updateStatement, updateData, options)

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
        binds2.loginid = users.loginid


        dbConnection = getdbCreds(users.site)

        try {
            conn = await oracledb.getConnection(dbConnection);

            const result2 = await conn.execute(statement2, binds2, opts)

            resolve({/*  data: result1.rows, */ component: result2.rows })
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
        }

        binds = [{ Id: id }]

        dbConnection = getdbCreds(user.site)

        stmt = `DELETE ${table} where rowid = :Id`

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

const executeStmtMany = async (users, statement, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;


        opts = {
            autoCommit: true
        };

        dbConnection = getdbCreds(users.site)

        try {
            conn = await oracledb.getConnection(dbConnection);

            //    console.log(statement, binds)

            const result = await conn.executeMany(statement, binds, opts)

            resolve(result)


        } catch (err) {
            console.log('executeStmtMany', err)
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

const execFunction = async (conn, statement, binds = [], opts = {}) => {

    // ! this not standalone function should not call close connection

    return new Promise(async (resolve, reject) => {

        opts.outFormat = oracledb.OUT_FORMAT_OBJECT;


        try {

            const result = await conn.execute(
                statement,
                binds,
                opts
            );


            resolve(result)

        } catch (err) {
            console.log('execFunction', err)
            reject(err)
        }
    });
}

const execFunc = async (users, statement, binds = [], opts = {}) => {

    return new Promise(async (resolve, reject) => {

        let conn;
        let dbConnection;

        /*         opts.outFormat = oracledb.OBJECT; */

        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            // prefetchRows:     100,                // internal buffer allocation size for tuning
            // fetchArraySize:   100                 // internal buffer allocation size for tuning
        };


        dbConnection = getdbCreds(users.site)


        try {
            conn = await oracledb.getConnection(dbConnection);

            const result = await conn.execute(
                statement,
                binds,
                opts
            );


            resolve(result)

        } catch (err) {
            console.log('handler error', err)
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


const insertdataCustom = async (table, user, datas, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn, dbConnection, autonumberdocument, formCompsClean;
        let binds = [];


        const { data, formComps } = datas
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

            const autonumbers = _.filter(formComps, x => x.default_value === 'autonumber')[0]

            //  CEK ADA KAH AUTONUMBER FUNCTION DISET UNTUK TRANSAKSI INI..
            if (!_.isEmpty(autonumbers)) {

                const { autonumber_param, registername } = autonumbers


                const autonumber_function = autonumber_param.substring(0, autonumber_param.indexOf('('))

                let autonumber_params = _.split(autonumber_param.substring(autonumber_param.indexOf('(') + 1, autonumber_param.indexOf(')')), ',')


                const autonumber_param_value = _.map(autonumber_params, (v) => {
                    return _.get(_.get(data[0], 'header'), v)
                }
                )

                // ? 4. GENERATE AUTONUMBER DOCUMENT --> AUTONUMBERDOCUMENT ALSO USED IN DETAIL DATA
                autonumberdocument = await customAutonumber(conn, autonumber_function, autonumber_param_value, user)

                // ? 5. REPLACE AUTONUMBER COLUMN VALUE IN MASTERDATA OBJECT 
                _.map(binds, (x) => {
                    _.update(x, registername, () => { return autonumberdocument })
                })

            }


            let insertstatement = `insert into ${table} (${column.join(',')}) values(${columnbinding.join(',')}) returning rowid into :rids`
            let bindefs = _.mapKeys(_.map(formCompsClean, ({ key, type, maxSize }) => ({ key: key, type: OraDbType(type), maxSize: Number(maxSize) })), 'key')




            _.merge(bindefs, { 'rids': { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 45 } })

            const options = {
                autoCommit: true,
                bindDefs: bindefs
            }





            const result = await conn.executeMany(insertstatement, binds, options)

            if (!_.isEmpty(autonumbers)) {
                resolve({ autonumberdocument, ...result })
            }
            else {
                resolve(result)
            }

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

const insertdataFile = async (table, user, datas, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn, dbConnection, autonumberdocument, formCompsClean;
        let binds = [];


        const { data, formComps } = datas
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

                if (fieldtype.match(/^(inputtime|inputdate|inputdatesimple)$/)) {
                    //  fvals = `TO_TIMESTAMP_TZ(:${key}, 'yyyy-mm-dd"T"hh24:mi:ss.fftzh:tzm')`
                    fvals = `TO_DATE(:${key.replace(/ /g)},'dd-mm-yyyy hh24:mi')`
                }
                else {
                    fvals = `:${key}`
                }
                columnbinding.push(fvals)
                column.push(key)
            })

            conn = await oracledb.getConnection(dbConnection);

            // ?  GET COLUMN SET AS AUTONUMBER COLUMN ~~ PREREQUISITE --> ONLY RECEIVED 1 COLUMN AS AUTONUMBER COLUMN

            insertstatement = `insert into ${table} (${column.join(',')},INPUTBY) values(${columnbinding.join(',')},'${user.loginid}') returning rowid into :rids`
            let bindefs = _.mapKeys(_.map(formCompsClean, ({ key, type, maxSize }) => ({ key: key, type: OraDbType(type), maxSize: Number(maxSize) })), 'key')



            _.merge(bindefs, { 'rids': { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 45 } })

            const options = {
                autoCommit: true,
                bindDefs: bindefs
            }



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

const customAutonumber = async (conn, func, val, user) => {

    // ! this not standalone function should not call close connection

    let values


    const binds = {
        nameval: val[0],
        companyval: val[1],
        retval: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
    }
    // console.log(binds)
    let statement = ` begin
                          :retval :=  ${func}(:nameval,:companyval);
                        end;`

    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT, };

    await execFunction(conn, statement, binds, options).then((x) => values = x)

    return values.outBinds.retval;
}

const ManualInsert = async (users, statement1, binds = [], statement2, binds2 = [], opts = {}) => {
    let retval, process = [];

    let conn;
    let dbConnection;


    dbConnection = getdbCreds(users.site)

    conn = await oracledb.getConnection(dbConnection);

    process.push(executeStmt(users, statement1, binds))

    process.push(executeStmtMany(users, statement2, binds2))


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

const fetchFromTempData = async (users, fillTempStatement, statement, bindsFill = [], BindsSt = []) => {
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

            await conn.execute(fillTempStatement, bindsFill);

            const result = await conn.execute(statement, BindsSt, opts)

            resolve(result)


        } catch (err) {
            console.log('handler error', err)
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

const fetchDetailSubDetail = async (users, routes, statement, statementdetails, binds = [], opts = {}) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;


        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            //extendedMetaData: true,               // get extra metadata
            // prefetchRows:     100,                // internal buffer allocation size for tuning
            // fetchArraySize:   100                 // internal buffer allocation size for tuning
        };


        binds2 = {}
        binds2.route = routes.match('/') ? routes.substr(0, routes.indexOf('/')) : routes
        binds2.loginid = users.loginid


        dbConnection = getdbCreds(users.site)

        try {
            conn = await oracledb.getConnection(dbConnection);



            const result1 = await conn.execute(statement, binds, opts)
            const resultd = await conn.execute(statementdetails, binds, opts)

            const components = await conn.execute(statement2, binds2, opts)



            if (_.size(resultd.rows) > 0) {
                _.map(result1.rows, (x, i) => {
                    const refKeys = {}

                    _.map(_.filter(components.rows, ['is_detail_ref', 'true']), f => {
                        refKeys[f.formcomponent] = x[f.formcomponent]
                    })


                    _.assignIn(x, {
                        'inputgriddetail':
                            _.filter(resultd.rows, refKeys)
                    })
                })
            }

            resolve({ data: result1.rows, component: components.rows })


        } catch (err) {
            reject(err)
        } finally {
            if (conn) {
                try {
                    await conn.close()
                } catch (err) {
                    // console.log('error db',err)
                }
            }
        }
    });
}


const fetchFromTempDataWithComp = async (users, routes, fillTempStatement, statement, bindsFill = [], params, bindSource) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;


        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            extendedMetaData: true,               // get extra metadata
        };

        let binds2 = {}
        binds2.route = routes
        binds2.loginid = users.loginid

        dbConnection = getdbCreds(users.site)




        try {


            conn = await oracledb.getConnection(dbConnection);

            const prestatements = await conn.execute(statement, bindSource, opts)

            if (!_.isEmpty(prestatements?.rows[0]?.pre_statement)) {

                const p_binds = (prestatements?.rows[0]?.pre_statement_bind === null ? [] : _.split(prestatements?.rows[0]?.pre_statement_bind, ";"))

                const bindsp = _.pick(params, p_binds)

                let zbinds = {}

                if (!_.isEmpty(p_binds)) {
                    zbinds = _.zipObject(p_binds, Array(p_binds.length).fill(''));
                }

                const bindSPs = _.merge(zbinds, bindsp);

                await conn.execute(prestatements?.rows[0]?.pre_statement, bindSPs) //(_.isNil(bindsp) ? bindsFill : bindsp));
            }

            oracledb.fetchAsString = [oracledb.CLOB];


            const result = await conn.execute(statement, bindSource, opts)



            if (_.isEmpty(result)) {
                resolve(null)
            } else {


                const data = Promise.all(

                    _.map(result.rows, async function (x, y) {

                        let xstats = `${x.query_statement}`
                        const xbinds = (x.binds === null ? [] : _.split(x.binds, ";"))
                        const bindst = _.pick(params, xbinds)


                        let bindc = _.zipObject(xbinds, '')//.mapValues()

                        _.merge(bindc, bindst)

                        if (bindc.hasOwnProperty('loginid')) {
                            bindc.loginid = users.loginid
                        }

                        const fetchResult = await conn.execute(xstats, bindc, opts);//, (x.binds === null ? [] : _.split(x.binds, ";")))

                        let labels = x.grouplabel

                        _.map(bindst, (x, y) => { labels = labels && labels.replace(`{${y}}`, x) })


                        return ({ group: labels, childroute: x.childroute, content: fetchResult, code: x.code, groupid: x.groupid, level: _.size(_.split(x.route, '/')) })
                    })

                )

                resolve(data)
            }

        } catch (err) {
            console.log('fetchFromTempDataWithComp handler error', err)
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

const fetchFromTempDataToXLS = async (users, routes, fillTempStatement, statement, bindsFill = [], params, bindSource) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;


        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            extendedMetaData: true,               // get extra metadata
        };

        let binds2 = {}
        binds2.route = routes
        binds2.loginid = users.loginid

        dbConnection = getdbCreds(users.site)

        //  console.log(params)


        try {


            conn = await oracledb.getConnection(dbConnection);

            const prestatements = await conn.execute(statement, bindSource, opts)

            if (!_.isEmpty(prestatements?.rows[0]?.pre_statement)) {

                const p_binds = (prestatements?.rows[0]?.pre_statement_bind === null ? [] : _.split(prestatements?.rows[0]?.pre_statement_bind, ";"))


                const bindsp = _.pick(params, p_binds)

                await conn.execute(prestatements?.rows[0]?.pre_statement, (_.isNil(bindsp) ? bindsFill : bindsp));
            }

            oracledb.fetchAsString = [oracledb.CLOB];



            const result = await conn.execute(statement, bindSource, opts)



            if (_.isEmpty(result)) {
                resolve(null)
            } else {


                const data = Promise.all(

                    _.map(result.rows, async function (x, y) {

                        let xstats = `${x.query_statement}`
                        const xbinds = (x.binds === null ? [] : _.split(x.binds, ";"))
                        const bindst = _.pick(params, xbinds)


                        let bindc = _.zipObject(xbinds, '')//.mapValues()

                        _.merge(bindc, bindst)

                        if (bindc.hasOwnProperty('loginid')) {
                            bindc.loginid = users.loginid
                        }

                        const fetchResult = await conn.execute(xstats, bindc, opts);//, (x.binds === null ? [] : _.split(x.binds, ";")))

                        let labels = x.grouplabel

                        _.map(bindst, (x, y) => { labels = labels && labels.replace(`{${y}}`, x) })

                        //  console.log(fetchResult.metaData)



                        let returnRows = []

                        returnRows[0] = _.map(fetchResult.metaData, (v) => v.name)

                        _.map(fetchResult.rows, (r) => returnRows.push(_.map(r, rd => {
                            return rd
                        })))

                        rows = {}

                        rows = _.mapValues(returnRows, crows => {
                            return {
                                cells: _.mapValues(crows, ccells => {
                                    return {
                                        text: ccells
                                    }
                                })
                            }
                        })

                        /*    
                         let rowx = _.mapValues(fetchResult.metaData, x => { return { text: x.name } })
                         
                        _.extend(returnRows, {
                                 0: {
                                     cells:
                                         _.mapValues(fetchResult.metaData, (v) => {
                                             return { text: v.name }
                                         })
                                 },
                             })
                         
                         
                             _.extend(returnRows, _.mapValues(fetchResult.rows, (v, x) => {
                                 return {
                                     cells: _.mapValues(_.map(v, (cv, cx) => {
                                         return { text: cv }
                                     }))
                                 }
                             }))
                        */

                        // console.log(rowx)

                        /*    rowz.concat(rowx, _.map(fetchResult.rows, (v, x) => {
                               return {
                                   cells: _.mapValues(_.map(v, (cv, cx) => {
                                       return { text: cv }
                                   }))
                               }
                           }))
                        */

                        /* 
                                                rows.push({
                                                    cells:
                                                        _.mapValues(fetchResult.metaData, (v) => {
                                                            return { text: v.name }
                                                        })
                                                })
                         
                                                _.assignIn(rows, {
                                                    0: {
                                                        cells:
                                                            _.mapValues(fetchResult.metaData, (v) => {
                                                                return { text: v.name }
                                                            })
                                                    }
                                                })
                         
                         
                        const zzzz = _.mapValues(fetchResult.rows, (v, x) => {
                            return {
                                cells: _.mapValues(_.map(v, (cv, cx) => {
                                    return { text: cv }
                                }))
                            }
                        })
                        
                        console.log(zzzz)
                        
                        const ret = _.mapValues(rows, (x) => x)
                        
                        _.assignIn(rows)
                        console.log(ret)
                            */

                        return ({ name: labels, group: labels, childroute: x.childroute, rows: rows, code: x.code, groupid: x.groupid })
                    })

                )

                resolve(data)
            }

        } catch (err) {
            console.log('fetchFromTempDataWithComp handler error', err)
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


const fetchDataFromClob = async (users, statement, bindSource) => {
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;

        opts = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            extendedMetaData: true,               // get extra metadata
        }


        console.log(bindSource)

        dbConnection = getdbCreds(users.site)

        try {

            conn = await oracledb.getConnection(dbConnection);

            oracledb.fetchAsString = [oracledb.CLOB];

            const result = await conn.execute(statement, bindSource, opts)


            if (_.isEmpty(result)) {
                resolve(null)
            } else {



                const data = Promise.all(_.map(result.rows, async function (x, y) {

                    let xstats = `${x.query_statement}`



                    let bindst = {}

                    const fetchTemplate = await conn.execute(xstats, bindst, opts)



                    return fetchTemplate

                }))



                resolve(data)
            }




        } catch (err) {

            console.log('dbhandler fetchDataFromClob handler error', err)


            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    console.log('dbhandler fetchDataFromClob close connection')

                    await conn.close()
                } catch (err) {
                    // console.log('DB error',err)
                }
            }
        }
    });
}


module.exports = {
    simpleExecute,
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
    execFunction,
    insertdataCustom,
    updateDataAdmin,
    getReportComponent,
    getReportComponentDetail,
    getAppsObject,
    getSiteObject,
    executeStmt,
    executeStmtMany,
    getFormComponent,
    ManualInsert,
    fetchTemporaryData,
    fetchFromTempData,
    insertdataFile,
    fetchDetailSubDetail,
    fetchFromTempDataWithComp,
    fetchFromTempDataToXLS,
    fetchDataFromClob,
    execFunc
}
