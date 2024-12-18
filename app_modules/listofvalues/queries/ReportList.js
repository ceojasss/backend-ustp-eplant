const ReportList = `  SELECT REGISTRYID            "registryid",
r.MODULECODE          "modulecode",
r.subMODULECODE       "submodulecode",
REPORTDESC            "reportdesc",
REPORTNAME            "reportname",
STATUS                "status",
REPORTNAME_STATUS     "reportname_status"
FROM REGISTRYREPORT r, module m, accessrights a
WHERE     m.code = r.modulecode
AND loginid = :1
AND LOWER (controlsystem) = LOWER ( :2)
AND m.code = a.modulecode
AND a.submodulecode = r.submodulecode
AND AUTHORIZED = 'Y'
AND status = 'Y'
AND NVL (REPORTNAME, 'z') LIKE '%' || :0 || '%'
ORDER BY registryid`

module.exports = ReportList