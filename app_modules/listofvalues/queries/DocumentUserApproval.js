const DocumentUserApproval = `  SELECT USERID           "userid",
rst_code         "rst_code",
rce_code         "rce_code",
RCE_NAME         "rce_name",
empname          "empname",
jobdesc          "jabatan",
doc_num          "docnum",
status           "status",
statusdate "statusdate",
remarks          "remarks"
FROM (SELECT m.USERID,
        m.rst_code,
        m.rce_code,
        M.RCE_NAME,
        s.doc_num,
        s.status,
        s.remarks,
        nvl(s.updatedate , s.inputdate) statusdate , 
   FROM (SELECT U.USERID,
                R.RST_CODE,
                u.RCE_CODE,
                M.RCE_NAME
           FROM epms_ustp.doc_release_strategy   R,
                epms_ustp.DOC_AMOUNT_RANGE       D,
                epms_ustp.DOC_USER_APPROVAL_LEVEL U,
                epms_ustp.DOC_APPROVAL_LEVELS    M
          WHERE     doc_type = :1
                AND R.RST_CODE = D.RST_CODE
                AND U.RST_CODE = D.RST_CODE
                AND U.RST_CODE = M.RST_CODE
                AND U.RCE_CODE = M.RCE_CODE
                AND D.VALUE = :2) M
        LEFT JOIN epms_ustp.DOC_RELEASE_STATUS S
        ON m.RST_CODE = s.RST_code AND M.RCE_CODE = S.RCE_CODE AND doc_num = :0
 UNION ALL
 SELECT CR.VALUE,
        R.RST_CODE,
        '-1'         RCE_CODE,
        'Created By',
        '',
        '',
        ''
   FROM epms_ustp.DOC_AMOUNT_RANGE    CR,
        epms_ustp.doc_release_strategy R
  WHERE CR.VALUE = :2 AND R.RST_CODE = CR.RST_CODE AND doc_type = :1)
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

module.exports = DocumentUserApproval