const itasset = `select groupid "code", description "description" from epmsapps.itassetgroup 
where :1='HO_IT' and (groupid like upper ('%'||:0||'%') or description like ('%'||:0||'%'))`

module.exports = itasset