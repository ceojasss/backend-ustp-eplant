const Site = `SELECT DISTINCT s.company_initial "site", companyname "companyname"
FROM epmsapps.usercompany u, epmsapps.companysite s, epmsapps.company c
WHERE     u.companyid = c.companyid
     AND c.companyid = s.companyid
     AND u.loginid = :0
     AND s.company_initial != :1
ORDER BY decode(company_initial,'APPS',1,'USTP',2,'GCM',3,'SMG',4,'SJE',5,'SBE',6,'SLM',7,'HHK',8,'BHMS',9,'TST',10,'JPA',11,'YAY',12,'KOP',13, 14) `

module.exports = Site