const Position = `SELECT code "code" ,description "description"
FROM mas_position
WHERE    ( upper(code) like upper('%'||:0||'%') or UPPER (description) LIKE UPPER ('%'||:0||'%'))
     order by code`

module.exports = Position