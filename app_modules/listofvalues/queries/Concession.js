const Concession = `select CONCESSIONID "code", CONCESSIONID "description",description "desc"
from landconcession where ( CONCESSIONID like UPPER ('%'||:0||'%') OR description like UPPER ('%'||:0||'%')  )
order by CONCESSIONID
`

module.exports = Concession