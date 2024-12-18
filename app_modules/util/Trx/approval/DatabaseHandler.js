const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `  SELECT ROWNUM
"rownum",
DOC_TYPE
"doc_type",
DOC_NAME
"doc_name",
DOC_NUM
"doc_num",
d.REMARKS
"remarks",
u.Loginid
"userid",
TO_CHAR (DOC_DATE, 'DD-MM-YYYY')
"date",
status
"status",
key_doc
"key_doc",
V_URL_PREVIEW (DOC_TYPE,
          SUBSTR (DOC_NUM, 0, INSTR (DOC_NUM, '/') - 1))
|| DOC_NUM
"urls",
d.rce_code
"rce_code",
d.rst_code
"rst_code",
DECODE (D.STATUS,
'A', 'APPROVED',
'R', 'REJECTED',
'C', 'REVISED',
'HOLD')
"statusdesc",
STATUS_DESC
"comment",
DOC_NOTES
"doc_notes",
up_approval_status (d.doc_num, d.rst_code, d.rce_code)
"up_status",
TRUNC (doc_date)
"DOC_DATE"
FROM EPMS_USTP.doc_release_status  d,
epmsapps.userprofile u,
empmasterepms_consol e,
(SELECT DOC_CODE, DOC_NOTES
FROM (SELECT MRCODE DOC_CODE, MRNOTES DOC_NOTES
   FROM MR_ALL
  WHERE     process_flag NOT IN ('REJECTED')
        AND NVL (closed, '0') = '0'
 UNION
 SELECT PRCODE DOC_CODE, PRNOTES DOC_NOTES
   FROM LPR_ALL
  WHERE     process_flag NOT IN ('REJECTED')
        AND NVL (closed, '0') = '0'
 UNION
 SELECT RECEIVENOTECODE DOC_CODE, REMARKS DOC_NOTES
   FROM RECEIVENOTE_ALL
  WHERE     process_flag NOT IN ('REJECTED')
        AND INVOICECODE IS NULL)) P
WHERE     u.loginid = d.userid
AND u.email = e.empcode
AND P.DOC_CODE = D.DOC_NUM
AND U.loginid = :loginid
and  (doc_num like '%'||:search ||'%' or doc_name like '%'||:search ||'%') 
ORDER BY CASE WHEN STATUS IN ('I', 'H') THEN 0 ELSE 1 END, doc_date DESC`

/**
   * ! change query table detail
   */
const detailQuery = `  SELECT RID                          "rowid",
ITEMCODE                     "itemcode",
ITEMDESCRIPTION              "itemdescription",
JOBCODE                      "jobcode",
getjob_des (jobcode)         "jobdescription",
LOCATIONCODE                 "locationcode",
LOCATIONTYPE                 "locationtype",
DOC_NUM                      "doc_num",
QUANTITY                     "quantity",
REMARKS                      "remarks"
FROM (SELECT RID,
        ITEMCODE,
        ITEMDESCRIPTION,
        JOBCODE,
        LOCATIONCODE,
        LOCATIONTYPE,
        MRCODE                     DOC_NUM,
        TO_CHAR (QUANTITY)         QUANTITY,
        REMARKS
   FROM V_MRDETAILS_ALL
  WHERE MRCODE = :docnum
 UNION
 SELECT RID,
        ITEMCODE,
        ITEMDESCRIPTION,
        JOBCODE,
        LOCATIONCODE,
        LOCATIONTYPE,
        prcode                     DOC_NUM,
        TO_CHAR (QUANTITY)         QUANTITY,
        REMARKS
   FROM V_PRDETAILS_ALL
  WHERE prcode = :docnum
 UNION
 SELECT RID,
        ITEMCODE,
        ITEMDESCRIPTION,
        JOBCODE,
        LOCATIONCODE,
        LOCATIONTYPE,
        RECEIVENOTECODE            DOC_NUM,
        TO_CHAR (QUANTITY)         QUANTITY,
        REMARKS
   FROM RECEIVENOTEDETAIL_ALL
  WHERE RECEIVENOTECODE = :docnum)
ORDER BY ITEMCODE`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
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
            :rid := epms_ustp.doc_workflow.doc_approval (:doc_process,:doc_type,:doc_num,:user_id,:user_id,:comment,null);  
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
            :rid := epms_ustp.doc_workflow.doc_revised (:doc_process,:doc_type,:doc_num,:user_id,:user_id,:comment,null);  
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
              :rid := epms_ustp.doc_workflow.doc_rejected (:doc_type,
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

