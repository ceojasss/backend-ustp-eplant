const baseQuery = `select topcode "topcode",topdescription"topdescription"
from top
where topcode like ('%'||:0||'%')
order by topcode `

module.exports = baseQuery