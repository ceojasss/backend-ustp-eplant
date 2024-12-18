const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../oradb/dbHandler')

const baseQuery = `    SELECT MODULE                                           "module",
MODULENAME                                       "modulename",
SUBMODULE                                        "submodule",
SUBMODULENAME                                    "title",
CLASSNAME                                        "classname",
ICON                                             "icon",
ROUTE                                            "route",
PARAMETER1                                       "parameter1",
PARAMETER2                                       "parameter2",
PARAMETER3                                       "parameter3",
PARAMETER4                                       "parameter4",
PARAMETER5                                       "parameter5",
PARAMETER6                                       "parameter6",
PARAMETER7                                       "parameter7",
PARAMETER8                                       "parameter8",
TIPE                                             "tipe",
SUM (isdetail) OVER (PARTITION BY MODULE)        "isdetail",
CASE
        WHEN TIPE = 'HEADER'
        THEN
                TO_CHAR (MODULE)
        WHEN TIPE = 'FOLDER'
        THEN
                TO_CHAR (MODULE) || PARAMETER1
        WHEN TIPE = 'FORM'
        THEN
                TO_CHAR (MODULE) || classname || TO_CHAR (SUBMODULE)
END                                              "key",
CASE
        WHEN PARAMETER1 IN ('C', 'R')
        THEN
                TO_CHAR (MODULE)
        WHEN TIPE = 'HEADER'
        THEN
                NULL
        WHEN TIPE = 'FOLDER'
        THEN
                TO_CHAR (MODULE)
        ELSE
                CASE
                        WHEN SUM (isdetail) OVER (PARTITION BY MODULE) =
                             0
                        THEN
                                TO_CHAR (MODULE)
                        ELSE
                                CLASSNAME
                END
END                                              "parent",
LOWER (controlsystem)                            "controlsystem",
ISUPDATE                                         "isupdate",
ISDELETE                                         "isdelete",
ISINSERT                                         "isinsert",
useweb                                           "useweb",
formtype                                         "typeform",
enable_wf "formversion",
filtertype "filtertype",
filter1 "filter1",
filter2 "filter2"
FROM (SELECT S.MODULE,
        M.NAME
                MODULENAME,
        S.CODE
                SUBMODULE,
        S.NAME
                SUBMODULENAME,
        CLASSNAME,
        ICON,
        ROUTE,
        PARAMETER1,
        PARAMETER2,
        PARAMETER3,
        PARAMETER4,
        PARAMETER5,
        PARAMETER6,
        PARAMETER7,
        PARAMETER8,
        FORMNAME,
        0
                isdetail,
        CASE
                WHEN NVL (FORMNAME, '#') LIKE '%#%' THEN 'FOLDER'
                ELSE 'FORM'
        END
                TIPE,
        COUNT (*) OVER (PARTITION BY s.module, parameter1)
                counts,
        m.controlsystem,
        A.ISUPDATE,
        A.ISDELETE,
        A.ISINSERT,
        s.useweb,
        s.formtype,
        s.enable_wf,
        S.filtertype      ,
        s.filter1,
        s.filter2                              
   FROM ACCESSRIGHTS A, SUBMODULE S, MODULE M
  WHERE     A.LOGINID = :loginid
        AND A.MODULECODE = S.MODULE
        AND A.SUBMODULECODE = S.CODE
        AND S.MODULE = M.CODE
        AND A.AUTHORIZED = 'Y'
        --AND S.PARAMETER1 NOT IN ('R')
        AND S.MOD_CODE IS NOT NULL
 UNION ALL
   SELECT DISTINCT
          m.code                      MODULE,
          m.name                      MODULENAME,
          m.code                      SUBMODULE,
          m.name                      SUBMODULENAME,
          'H'                         CLASSNAME,
          ''                          ICON,
          ''                          ROUTE,
          ''                          PARAMETER1,
          ''                          PARAMETER2,
          ''                          PARAMETER3,
          ''                          PARAMETER4,
          ''                          PARAMETER5,
          ''                          PARAMETER6,
          ''                          PARAMETER7,
          ''                          PARAMETER8,
          ''                          FORMNAME,
          SUM (
                  DISTINCT
                          CASE
                                  WHEN REGEXP_INSTR (s.classname,
                                                     '[[:digit:]]') =
                                       0
                                  THEN
                                          1
                                  ELSE
                                          0
                          END)        isdetail,
          'HEADER'                    TIPE,
          0                           counts,
          m.controlsystem,
          'Y'                         ISUPDATE,
          'Y'                         ISDELETE,
          'Y'                         ISINSERT,
          'Y'                         useweb,
          'F'                         formtype,
          '' enable_wf, 
        '' filtertype    ,
        '' filter1,
        ''  filter2                                
     FROM module M, ACCESSRIGHTS A, submodule s
    WHERE     A.LOGINID = :loginid
          AND A.AUTHORIZED = 'Y'
          AND m.code = s.module
          AND a.submodulecode = s.code
          AND A.MODULECODE = s.module
          AND S.MOD_CODE IS NOT NULL
 GROUP BY m.code, m.name, m.controlsystem
 ORDER BY module)
WHERE     MODULE IN (11,
               6,
               9,
               10,
               14,
               7,
               1,
               8,
               4,
               29,
               37,
               4,
               29,
               70,
               17,
               32,
               35,
               47,
               16,
               5,
               25,
               3,
               48,
               49,
               99,
               50)
AND NOT (tipe = 'FOLDER' AND COUNTS = 1)
ORDER BY  CASE WHEN MODULENAME= 'Employee Self Service' OR MODULENAME='Executive Summary' OR MODULENAME='Business Intelligence' OR MODULENAME='Executive Dashboard' THEN MODULE END ASC,MODULE,
PARAMETER1 DESC,
PARAMETER3,
SUBMODULE`

const baseQueryOut = `    SELECT MODULE                                           "module",
MODULENAME                                       "modulename",
SUBMODULE                                        "submodule",
SUBMODULENAME                                    "title",
CLASSNAME                                        "classname",
ICON                                             "icon",
ROUTE                                            "route",
PARAMETER1                                       "parameter1",
PARAMETER2                                       "parameter2",
PARAMETER3                                       "parameter3",
PARAMETER4                                       "parameter4",
PARAMETER5                                       "parameter5",
PARAMETER6                                       "parameter6",
PARAMETER7                                       "parameter7",
PARAMETER8                                       "parameter8",
TIPE                                             "tipe",
SUM (isdetail) OVER (PARTITION BY MODULE)        "isdetail",
CASE
        WHEN TIPE = 'HEADER'
        THEN
                TO_CHAR (MODULE)
        WHEN TIPE = 'FOLDER'
        THEN
                TO_CHAR (MODULE) || PARAMETER1
        WHEN TIPE = 'FORM'
        THEN
                TO_CHAR (MODULE) || classname || TO_CHAR (SUBMODULE)
END                                              "key",
CASE
        WHEN PARAMETER1 IN ('C', 'R')
        THEN
                TO_CHAR (MODULE)
        WHEN TIPE = 'HEADER'
        THEN
                NULL
        WHEN TIPE = 'FOLDER'
        THEN
                TO_CHAR (MODULE)
        ELSE
                CASE
                        WHEN SUM (isdetail) OVER (PARTITION BY MODULE) =
                             0
                        THEN
                                TO_CHAR (MODULE)
                        ELSE
                                CLASSNAME
                END
END                                              "parent",
LOWER (controlsystem)                            "controlsystem",
ISUPDATE                                         "isupdate",
ISDELETE                                         "isdelete",
ISINSERT                                         "isinsert",
useweb                                           "useweb",
formtype                                         "typeform",
enable_wf "formversion",
filtertype "filtertype",
filter1 "filter1",
filter2 "filter2"
FROM (SELECT S.MODULE,
        M.NAME
                MODULENAME,
        S.CODE
                SUBMODULE,
        S.NAME
                SUBMODULENAME,
        CLASSNAME,
        ICON,
        ROUTE,
        PARAMETER1,
        PARAMETER2,
        PARAMETER3,
        PARAMETER4,
        PARAMETER5,
        PARAMETER6,
        PARAMETER7,
        PARAMETER8,
        FORMNAME,
        0
                isdetail,
        CASE
                WHEN NVL (FORMNAME, '#') LIKE '%#%' THEN 'FOLDER'
                ELSE 'FORM'
        END
                TIPE,
        COUNT (*) OVER (PARTITION BY s.module, parameter1)
                counts,
        m.controlsystem,
        A.ISUPDATE,
        A.ISDELETE,
        A.ISINSERT,
        s.useweb,
        s.formtype,
        s.enable_wf,
        S.filtertype      ,
        s.filter1,
        s.filter2                              
   FROM ACCESSRIGHTS A, SUBMODULE S, MODULE M
  WHERE     A.LOGINID = :loginid
        AND A.MODULECODE = S.MODULE
        AND A.SUBMODULECODE = S.CODE
        AND S.MODULE = M.CODE
        AND A.AUTHORIZED = 'Y'
        --AND S.PARAMETER1 NOT IN ('R')
        AND S.MOD_CODE IS NOT NULL
 UNION ALL
   SELECT DISTINCT
          m.code                      MODULE,
          m.name                      MODULENAME,
          m.code                      SUBMODULE,
          m.name                      SUBMODULENAME,
          'H'                         CLASSNAME,
          ''                          ICON,
          ''                          ROUTE,
          ''                          PARAMETER1,
          ''                          PARAMETER2,
          ''                          PARAMETER3,
          ''                          PARAMETER4,
          ''                          PARAMETER5,
          ''                          PARAMETER6,
          ''                          PARAMETER7,
          ''                          PARAMETER8,
          ''                          FORMNAME,
          SUM (
                  DISTINCT
                          CASE
                                  WHEN REGEXP_INSTR (s.classname,
                                                     '[[:digit:]]') =
                                       0
                                  THEN
                                          1
                                  ELSE
                                          0
                          END)        isdetail,
          'HEADER'                    TIPE,
          0                           counts,
          m.controlsystem,
          'Y'                         ISUPDATE,
          'Y'                         ISDELETE,
          'Y'                         ISINSERT,
          'Y'                         useweb,
          'F'                         formtype,
          '' enable_wf, 
        '' filtertype    ,
        '' filter1,
        ''  filter2                                
     FROM module M, ACCESSRIGHTS A, submodule s
    WHERE     A.LOGINID = :loginid
          AND A.AUTHORIZED = 'Y'
          AND m.code = s.module
          AND a.submodulecode = s.code
          AND A.MODULECODE = s.module
          AND S.MOD_CODE IS NOT NULL
 GROUP BY m.code, m.name, m.controlsystem
 ORDER BY module)
WHERE     MODULE IN (
               70,
               47,
               49,
               50)
AND NOT (tipe = 'FOLDER' AND COUNTS = 1)
ORDER BY  CASE WHEN MODULENAME= 'Employee Self Service' OR MODULENAME='Executive Summary' OR MODULENAME='Business Intelligence' OR MODULENAME='Executive Dashboard' THEN MODULE END ASC,MODULE,
PARAMETER1 DESC,
PARAMETER3,
SUBMODULE`




const fetchMenu = async function (users, callback) {

        let result

        binds = {}
        binds.loginid = users.loginid


        try {
                if (_.isUndefined(process.env.MENU)) {
                        result = await database.siteExecute(users, baseQuery, binds)
                } else {
                        result = await database.siteExecute(users, baseQueryOut, binds)
                }
        } catch (error) {
                callback(error, '')
        }

        if (_.isEmpty(result))
                return callback('', [])

        callback('', result.rows)
}

module.exports = {
        fetchMenu
}