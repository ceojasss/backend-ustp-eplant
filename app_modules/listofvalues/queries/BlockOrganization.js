const BlockOrganization = ` SELECT DISTINCT o.DIVISIONCODE "divisioncode", o.DEPARTMENTCODE "departmentcode",
bm.CONCESSIONID "concessionid"
FROM organization o, blockmaster bm, blockorg bo where
 bo.blockid = bm.blockid
     AND (   UPPER (o.departmentcode) LIKE '%' || :0 || '%'
          OR UPPER (o.divisioncode) LIKE '%' || :0 || '%')
          order by o.departmentcode `

module.exports = BlockOrganization
