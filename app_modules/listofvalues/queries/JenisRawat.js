const JenisRawat = `SELECT RAWAT_ID "code" ,DESCRIPTION "description"
FROM HR_REF_RAWAT
WHERE    ( upper(RAWAT_ID) like upper('%'||:0||'%') or UPPER (DESCRIPTION) LIKE UPPER ('%'||:0||'%'))
     order by RAWAT_ID`

module.exports = JenisRawat