const Requester = `SELECT   divisioncode "code", departmentname || ' ' || divisionname "description", ASSIGN_TO "assign_to"
FROM   organization
WHERE   ( (APP_SECURITY_PKG.get_sessioninfo_f@APPSDBLINK('ESTATECODE') = divisioncode AND divisioncode = 'BOD')
        OR (DIVISIONCODE = DIVISIONCODE AND DIVISIONCODE <> 'BOD')) and (   UPPER (divisioncode) LIKE ('%' || UPPER ( :0) || '%')
  OR UPPER (departmentname) LIKE ('%' ||  ( :0) || '%'))
ORDER BY   3, 1`

module.exports = Requester

