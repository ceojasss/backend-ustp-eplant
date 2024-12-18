const FieldCode = `SELECT FIELDCODE "fieldcode", DESCRIPTION "description"
FROM fieldcrop WHERE inactivedate is null and estatecode= :1 and divisioncode=:2 and blockid=:3 and ((fieldcode) LIKE UPPER ('%' || :0 || '%')
OR (description) LIKE UPPER ('%' || :0 || '%'))`
module.exports = FieldCode;
