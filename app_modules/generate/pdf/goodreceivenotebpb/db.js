const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `/* Formatted on 24/01/2024 14:16:01 (QP5 v5.360) */
SELECT get_suppliername (a.suppliercode)
           "supplierdesc",
       a.deliveryordercode
           "deliverycode",
       a.pocode
           "pocode",
       e.prcode
           "prcode",
       g.remarks
           "remarkspo",
       a.remarks
           "remarksgrn",
       TO_CHAR (a.rndate, 'dd-mm-yyyy')
           "rndate",
       a.receivenotecode
           "rncode",
       g.franco
           "franco",
       a.inputby
           "createdby",
       h.status
           "status",
       h.userid
           "userid",
       a.STATUS_TRANSFER"statustf",
       TO_CHAR (h.updatedate, 'DD-MM-YYYY HH24:MI')
           "signdate",
       TO_CHAR (a.inputdate, 'DD-MM-YYYY HH24:MI')
           "createddate",
       purchaseitemcode
           "DETAIL#purchaseitemcode",
       b.itemdescription || ' ' || f.otheritemdesc
           "DETAIL#itemdescription",
       b.quantity
           "DETAIL#quantity",
       d.unitofmeasuredesc
           "DETAIL#unitofmeasuredesc",
          b.LOCATIONTYPE
       || ' - '
       || b.LOCATIONCODE
       || ' - '
       || b.jobcode
       || get_itemmap (purchaseitemcode)
           "DETAIL#loc",
       NVL ((SELECT storecode || ' - ' || storename
               FROM storeinfo
              WHERE storecode = b.locationcode),
            'Direct Charges')
           "Gudang",
       CASE
           WHEN purchaseitemcode IN
                    (SELECT itemcode FROM purchaseitem_karung)
           THEN
               TO_CHAR (NVL (karung, 0)) || ' Krg '
           ELSE
               a.remarks
       END
            "Keterangan"
  FROM receivenote                   a,
       receivenotedetail             b,
       purchaseitem                  c,
       unitofmeasure                 d,
       lprpodetails                  e,
       lpodetails                    f,
       lpo                           g,
       epms_USTP.DOC_RELEASE_STATUS  h
 WHERE     a.receivenotecode = b.receivenotecode
       AND h.doc_num = a.receivenotecode
       AND b.purchaseitemcode = c.itemcode
       AND f.uom = d.unitofmeasurecode(+)
       AND a.receivenotecode = e.receivenotecode
       AND b.purchaseitemcode = e.itemcode
       AND a.receivenotecode = :receivenotecode
       AND e.pocode = f.pocode
       AND f.pocode = g.pocode
       AND e.itemcode = f.itemcode`


const queryApprovalStatement=`SELECT USERID "userid",
rst_code         "rst_code",
rce_code         "rce_code",
RCE_NAME         "rce_name",
empname          "empname",
jobdesc          "jabatan",
doc_num          "docnum",
status           "status",
remarks          "remarks",
statusdate       "statusdate"
FROM (SELECT m.USERID,
        m.rst_code,
        m.rce_code,
        M.RCE_NAME,
        s.doc_num,
        s.status,
        s.remarks,
       to_char(nvl(S.UPDATEDATE, S.inputdate), 'dd-mm-yyyy hh24:mi:ss') statusdate
   FROM (SELECT U.USERID,
                R.RST_CODE,
                u.RCE_CODE,
                M.RCE_NAME
           FROM epms_ustp.doc_release_strategy   R,
                epms_ustp.DOC_AMOUNT_RANGE       D,
                epms_ustp.DOC_USER_APPROVAL_LEVEL U,
                epms_ustp.DOC_APPROVAL_LEVELS    M
          WHERE     doc_type = 'GRN'
                AND R.RST_CODE = D.RST_CODE
                AND U.RST_CODE = D.RST_CODE
                AND U.RST_CODE = M.RST_CODE
                AND U.RCE_CODE = M.RCE_CODE
                AND D.VALUE = 'SETYAWAN GCM') M
        LEFT JOIN epms_ustp.DOC_RELEASE_STATUS S
        ON m.RST_CODE = s.RST_code AND M.RCE_CODE = S.RCE_CODE AND doc_num = 'GCM/GRN/2401/00198'
 UNION ALL
 SELECT CR.VALUE,
        R.RST_CODE,
        '-1'         RCE_CODE,
        'Created By',
        '',
        '',
        '',
        ''
   FROM epms_ustp.DOC_AMOUNT_RANGE    CR,
        epms_ustp.doc_release_strategy R
  WHERE CR.VALUE = 'SETYAWAN GCM' AND R.RST_CODE = CR.RST_CODE AND doc_type = 'GRN')
t
LEFT JOIN
(SELECT u.loginid,
        e.empname,
        e.id_position,
        m.description         jobdesc
   FROM empmasterepms_consol e, userprofile u, mas_position m
  WHERE     e.empcode = u.email
        AND e.dateterminate IS NULL
        AND e.id_position = m.code) u
        ON u.loginid = t.userid
ORDER BY rce_code`

const fetchData = async function (users, find, callback) {
    let result

    binds = {}
    binds.find = find
    // console.log("users",users);
    try {
        result = await database.fetchTemporaryData(users, queryStatement, binds)
    } catch (error) {
        callback(error, '')
    }
    callback('', result)
}
const fetchDataDynamic = async function (users, find, callback) {


    binds = {}
    
    binds.receivenotecode = (!find.receivenotecode ? '' : find.receivenotecode)
    
    
    let result, error

    try {
        result = await database.fetchTemporaryData(users, queryStatement, binds)

    } catch (errors) {
        console.log('error fetch', errors.message)
        error = errors.message
        //callback(error, '')
    }


    callback(error, result)
}


const fetchDataApproval = async function (users, find, callback) {
    let result, error

    //    console.log(find)

    // console.log('site D', '<' + users.site + '>')
    /* 
        binds = {}
        binds.find = find
     */
    try {
        result = await database.fetchTemporaryData(users, queryApprovalStatement, find)

    } catch (errors) {
        console.log('error fetch', errors.message)
        error = errors.message
        //callback(error, '')
    }


    callback(error, result)
}

module.exports = {
   fetchData,
   fetchDataDynamic,
   fetchDataApproval,
}
