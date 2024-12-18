const hgu = `select CONCESSIONID "code", nohgu "description"
from landhgu where CONCESSIONID=:1 and ( CONCESSIONID like UPPER ('%'||:0||'%') OR nohgu like UPPER ('%'||:0||'%')  )
order by CONCESSIONID
`

module.exports = hgu