const Facode = `SELECT FIXEDASSETCODE "code" ,ASSETNAME "description"
FROM fafixedasset
WHERE    ( upper(FIXEDASSETCODE) like upper('%'||:0||'%') or UPPER (ASSETNAME) LIKE UPPER ('%'||:0||'%'))
     order by FIXEDASSETCODE`

module.exports = Facode