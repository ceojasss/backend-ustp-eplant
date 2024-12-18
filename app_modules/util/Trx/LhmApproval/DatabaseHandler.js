const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */

const baseQuery = `  SELECT ROWNUM                                              "rownum",
DOC_TYPE "doc_type",
DOC_NAME "doc_name",
DOC_NUM "doc_num",
REMARKS "remarks",
loginid                                             "userid",
TO_CHAR (DOC_DATE, 'yyyy-mm-dd')                    "date",
STATUS "status",
KEY_DOC "key_doc",
   V_URL_PREVIEW (DOC_TYPE,
                  SUBSTR (DOC_NUM, 0, INSTR (DOC_NUM, '/') - 1))
|| DOC_NUM                                          "urls",
RCE_CODE "rce_code",
RST_CODE "rst_code",
DECODE (STATUS,
        'A', 'APPROVED',
        'R', 'REJECTED',
        'C', 'REVISED',
        'HOLD')                                     "statusdesc",
STATUS_DESC                                         "comment",
DOC_NOTES "doc_notes",
up_approval_status (doc_num, rst_code, rce_code)    "up_status",
TRUNC (doc_date)                                    "DOC_DATE"
FROM (SELECT DOC_TYPE,
        DOC_NAME,
        DOC_NUM,
        d.REMARKS,
        u.Loginid,
        DOC_DATE,
        key_doc,
        d.rce_code,
        d.rst_code,
        d.status,
        STATUS_DESC,
        DOC_NOTES
   FROM doc_release_status  d,
        epmsapps.userprofile u,
        empmasterepms_consol e,
        (SELECT lhmno doc_code, remarks doc_notes
           FROM gangactivity_all
          /*WHERE NVL (closed, '0') = '0'*/) P
  WHERE     u.loginid = d.userid
        AND u.email = e.empcode
        AND P.DOC_CODE = D.DOC_NUM
        AND U.loginid = :loginid
        AND (doc_num like '%'||:search ||'%' or doc_name like '%'||:search ||'%') 
        AND to_char(DOC_DATE,'ddmmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'DD/MM/YYYY'),'ddmmyyyy'),to_char(DOC_DATE,'ddmmyyyy'))
 UNION
 SELECT DOC_TYPE,
        DOC_NAME,
        DOC_NUM,
        d.REMARKS,
        u.Loginid,
        DOC_DATE,
        key_doc,
        d.rce_code,
        d.rst_code,
        d.status,
        STATUS_DESC,
        DOC_NOTES
   FROM empmasterepms_consol e,
        epmsapps.userprofile u,
        doc_release_status  d,
        (SELECT lhmno doc_code, remarks doc_notes
           FROM gangactivity_all
          /*WHERE NVL (closed, '0') = '0'*/) P
  WHERE     d.userid = u.loginid
        AND u.email = e.empcode
        AND p.doc_code = d.doc_num
        AND U.loginid = :loginid
        AND (doc_num like '%'||:search ||'%' or doc_name like '%'||:search ||'%') 
        AND to_char(DOC_DATE,'ddmmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'DD/MM/YYYY'),'ddmmyyyy'),to_char(DOC_DATE,'ddmmyyyy'))
        AND e.empcode = d.empcode)
ORDER BY CASE WHEN STATUS IN ('I', 'H') THEN 0 ELSE 1 END, doc_date DESC`

/**
   * ! change query table detail
   */
const detailQuery = `  SELECT   y.rowid "rowid", empcode "itemcode",
get_empname (empcode) "itemdescription",
jobcode "jobcode",
getjob_des (jobcode) "jobdescription",
locationcode "locationcode",
x.gangcode || '/' || TO_CHAR (x.tdate, 'ddmmyyyy') "doc_num",
locationtypecode "locationtype",
units "quantity",
attdcode "remarks",
ROUND (mandays, 2) "hk",
ffb "jjg",
lf "brd",
rate "rate",
empcode_lf "nik_pasangan",get_empname(empcode_lf) "nama_pasangan",
1 urut
FROM   gangactivity x, gangactivitydetail y
WHERE       x.gangcode || '/' || TO_CHAR (x.tdate, 'ddmmyyyy') = :docnum
AND x.gangcode = y.gangcode
AND x.tdate = y.tdate
UNION ALL
SELECT   DISTINCT NULL "rowid", NULL "itemcode",
         'Pemakaian Material',
         NULL JOBCODE,
         NULL,
         NULL LOCATIONCODE,
         NULL,
         NULL,
         0 QUANTITY,
         NULL rotation,
         NULL,
         NULL,
         NULL,
         NULL,
         NULL,
         NULL,
         2 urut
FROM   gangitemlocation x
WHERE   x.gangcode || '/' || TO_CHAR (x.tdate, 'ddmmyyyy') = :docnum
UNION ALL
SELECT   ROWID "rowid",ITEMCODE "itemcode",
get_purchaseitemname (itemcode),
JOBCODE,
getjob_des (jobcode),
LOCATIONCODE,
x.gangcode || '/' || TO_CHAR (x.tdate, 'ddmmyyyy'),
locationtypecode,
QUANTITY,
TO_CHAR (rotation),
NULL,
NULL,
NULL,
NULL,
NULL,
NULL,
3 urut
FROM   gangitemlocation x
WHERE   x.gangcode || '/' || TO_CHAR (x.tdate, 'ddmmyyyy') = :docnum
order by urut,"itemcode"`





const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)
    //   binds.loginid = users.loginid

    let result

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)

        // console.log(result)
    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}
const fetchDataDetail = async function (users, routes, params, callback) {

    binds = {}

    console.log(params)

    /**
     * ! change the parameters according to the table
     */
    //  binds.doctype = (!params.doctype ? '' : params.doctype)
    binds.docnum = (!params.docnum ? '' : params.docnum)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)



    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}

const wf_approval = async function (users, context) {
    let query;// = baseQuery;
    let binds = {}

    let result



    if (context.actionchoice === 'Approve') {

        console.log('data ', context.actionchoice)

        binds = {
            doc_type: context.doc_type,
            doc_num: context.doc_num,
            user_id: context.userid,
            comment: context.notes,
            doc_process: "1",
            rid: {
                type: oracledb.STRING,
                dir: oracledb.BIND_OUT
            }
        }
        query = `DECLARE   BEGIN  
            :rid := doc_workflow.doc_approval (:doc_process,:doc_type,:doc_num,:user_id,:user_id,:comment,null);  
            commit;
            END;`
    } else if (context.actionchoice === 'Revise') {
        console.log('data ', context.actionchoice)

        binds = {
            doc_type: context.doc_type,
            doc_num: context.doc_num,
            user_id: context.userid,
            comment: context.notes,
            doc_process: "1",
            rid: {
                type: oracledb.STRING,
                dir: oracledb.BIND_OUT
            }
        }
        query = `DECLARE   BEGIN  
            :rid := doc_workflow.doc_revised (:doc_process,:doc_type,:doc_num,:user_id,:user_id,:comment,null);  
            commit;
            END;`
    } else if (context.actionchoice === 'Reject') {
        console.log('data ', context.actionchoice)

        binds = {
            doc_type: context.doc_type,
            doc_num: context.doc_num,
            user_id: context.userid,
            rst_code: context.rst_code,
            rce_code: context.rce_code,
            comment: context.notes,
            rid: {
                type: oracledb.STRING,
                dir: oracledb.BIND_OUT
            }
        }
        query = `DECLARE   BEGIN  
              :rid := doc_workflow.doc_rejected (:doc_type,
                :doc_num,
                null, 
                :user_id,
                :user_id,
                :comment,
                :rst_code,
                :rce_code);
    
      commit;
      END;`
    }
    //console.log(`quer -> ${JSON.stringify(binds)} , ${query}`)

    try {

        if (!_.isEmpty(query)) {
            //            result = await database.siteWithDefExecute(users, routes, detailQuery, binds)
            result = await database.execFunc(users, query, binds)

        }
    } catch (err) {

        console.log(`result ${err}`)
        result = err
    }

    return result
}

module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    wf_approval
}

