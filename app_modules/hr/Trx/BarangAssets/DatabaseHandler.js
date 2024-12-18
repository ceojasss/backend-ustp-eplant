const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid", facode "facode", image "image",kategori "kategori", status "status",deskripsi "deskripsi", empcode "empcode#code",
empname "empcode#description", receivenotecode "receivenotecode", housing "housing", ruangan "ruangan", kondisi "kondisi",tahunbeli "tahunbeli",remarks "remarks" from faassetnew
where (facode like '%'||:search ||'%' or kategori like upper ('%'||:search ||'%'))  order by facode`


const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)

    let result

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)

        // console.log(result)
    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}
const CheckFacode = async function (users, routes, params, callback) {

    binds = {}
// console.log(params)
// 'L05805','HA',12
    /**
   * ! change the parameters according to the table
   */
    binds.kategori = (!params.kategori ? '' : params.kategori)
    binds.tahunbeli = (!params.tahunbeli ? '' : params.tahunbeli)


    let result

    // console.log(users.loginid)

    //    (users, statement, binds, opts = {})
    try {
// console.log(binds)
        // const stmt = `select check_ha_cr ('L05805','HA',12) "ha" from dual`
        const stmt = `select get_new_facode(:kategori, :tahunbeli) "facode" from dual`

        result = await database.siteWithDefExecute(users, routes, stmt, binds)
        

    } catch (error) {
        callback(error)
    }

    callback('', result)
}

module.exports = {
    fetchDataHeader,
    CheckFacode
}

