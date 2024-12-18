const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select "rowid",
"tphcode","tphdescription", 
"estatecode#code",
"estatecode#description",
"divisioncode#code",
"divisioncode#description",
"blockid#code",
"blockid#description",
NVL(f.FIELDCODE,'') "fieldcode#code",
f.DESCRIPTION"fieldcode#description",
"inactivedate", 
"inputdate",
"updatedate",
"inputby",
"updateby" from (select p.ROWID "rowid",
p.TPHCODE "tphcode",p.TPHDESCRIPTION "tphdescription",
p.ESTATECODE "estatecode#code",
o.DEPARTMENTNAME "estatecode#description",
p.DIVISIONCODE "divisioncode#code",
o.DIVISIONNAME "divisioncode#description",
p.BLOCKID "blockid#code",
b.DESCRIPTION "blockid#description",
FIELDCODE,
to_char(p.INACTIVEDATE,'dd-mm-yyyy hh24:mi') "inactivedate", 
to_char(p.INPUTDATE,'dd-mm-yyyy  hh24:mi') "inputdate",
to_char(p.UPDATEDATE,'dd-mm-yyyy  hh24:mi') "updatedate",
p.INPUTBY "inputby",
p.UPDATEBY "updateby" From OPTPHMASTER p , organization o, blockmaster b
WHERE  p.divisioncode = o.divisioncode and p.estatecode = o.departmentcode and b.blockid = p.blockid and (p.TPHCODE LIKE UPPER ('%' || :search || '%')) )xx left join fieldcrop f on xx.fieldcode = f.fieldcode`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}
    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    let result

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)
    } catch (error) {
        callback(error, '')
    }
    callback('', result)
}

module.exports = {
    fetchDataHeader
}


