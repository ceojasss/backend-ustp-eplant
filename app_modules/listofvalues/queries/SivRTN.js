const Sivrtn = `SELECT 
sivcode "sivcode",
storecode "description"
FROM siv 
where (sivcode like upper('%'||:0||'%') or storecode like upper('%'||:0||'%'))
and storecode =:1 and rownum < 90 order by sivcode desc`

module.exports = Sivrtn