const Requester = `SELECT VALUE "code", VALUE_DESC "description"
    FROM v_rs_values
   WHERE value_type = 'ORU' and value like upper('%'||:0||'%')
ORDER BY VALUE`

module.exports = Requester

