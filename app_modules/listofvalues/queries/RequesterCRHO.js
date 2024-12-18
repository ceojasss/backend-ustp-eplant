const Requester = `SELECT   divisioncode "code", deptname "description"
FROM (SELECT storecode divisioncode, storename deptname
        FROM storeinfo
       WHERE NVL (inactivedate, TO_DATE ('01012099', 'ddmmyyyy')) >
                                                                   TO_DATE(:1,'dd-mm-yyyy')
      UNION ALL
      SELECT divisioncode, departmentname || ' ' || divisionname deptname
        FROM organization
       WHERE NVL (inactivedate, TO_DATE ('01012099', 'ddmmyyyy')) >
                                                                   TO_DATE(:1,'dd-mm-yyyy'))
WHERE (divisioncode like upper ('%'||:0||'%') OR deptname like ('%'||:0||'%'))
ORDER BY divisioncode DESC`

module.exports = Requester

