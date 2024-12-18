const FieldCode = `select fieldcode "code", estatecode "description", divisioncode "divisioncode", breeder "breeder" from epms_ustp.fieldcrop_consol where site = :1 and inactivedate is null and
(fieldcode like upper ('%'||:0||'%') or estatecode like upper ('%'||:0||'%') or divisioncode like upper ('%'||:0||'%') or breeder like upper ('%'||:0||'%') ) and rownum < 50 order by fieldcode`
module.exports = FieldCode;
