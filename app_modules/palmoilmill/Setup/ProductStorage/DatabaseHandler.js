const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = `SELECT ps.ROWID "rowid", STORAGECODE "storagecode", DESCRIPTION "description",
ps.PRODUCTCODE "productcode#code",
PRODUCTdescription "productcode#description",STORAGETYPE "storagetype#code",STORAGETYPE "storagetype#desc",
MAXCAPACITY "maxcapacity", LUASALAS "luasalas", DIAMETER "diameter",
ALFA "alfa",SUHU_TANGKI "suhu_tangki",SUHU_DINDING "suhu_dinding",
HEIGHT "height",to_char(INACTIVEDATE,'dd-mm-yyyy') "inactivedate",
OWNER "owner",inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
FROM PRODUCTSTORAGE ps,PRODUCT p where ps.PRODUCTCODE=p.PRODUCTCODE order by STORAGECODE`;



const fetchdata = async function (users, route, callback) {

    binds = {}

    let result

    // console.log(route)

    try {
        result = await database.siteWithDefExecute(users, route, baseQuery, binds)
        // console.log(result)
    } catch (error) {
        callback(error, '')
    }

    callback('', result)
}




module.exports = {
    fetchdata
}


