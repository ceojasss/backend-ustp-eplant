const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')



const baseQuery =`Select DISTINCT
b.ROWID "rowid",
b.CONCESSIONID "concessionid#code",
l.DESCRIPTION "concesionid#description",
b.BLOCKID "blockid",
b.DESCRIPTION "description",
b.HECTARAGE "hectarage",
b.INPUTBY "inputby",
b.updateby "updateby",
to_char( b.INACTIVEDATE, 'dd-mm-yyyy hh24:mi') "inactivedate",
to_char( b.INPUTDATE,'dd-mm-yyyy  hh24:mi') "inputdate",
to_char( b.UPDATEDATE,'dd-mm-yyyy  hh24:mi') "updatedate"
from blockmaster b , blockusage bu, landconcession l
where b.blockid = bu.blockid and b.CONCESSIONID = l.CONCESSIONID
and (b.blockid LIKE UPPER ('%' || :search || '%')) order by b.blockid ASC`


const detailQuery = `SELECT bu.ROWID "rowid",
bu.tid "tid",
CONCESSIONID "concessionid",
USAGEID "usageid#code", pv.parametervalue "usageid#description",
BLOCKID "blockid",
HECTARAGE "hectarage",
bu.INACTIVE "inactive",
to_char(bu.INPUTDATE,'dd-mm-yyyy  hh24:mi') "inputdate",
to_char(bu.UPDATEDATE,'dd-mm-yyyy  hh24:mi') "updatedate",
to_char(bu.INACTIVEDATE,'dd-mm-yyyy')"inactivedate",
bu.INPUTBY "inputby",
bu.UPDATEBY "updateby"
from blockusage bu, parametervalue pv  where pv.parametervaluecode=usageid and parametercode='FOP15' and
blockid=:blockid`




const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}
    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    // binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

    let result


    //console.log(binds.search, binds.dateperiode)
    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)

        // console.log(result)
    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}
const fetchDataDetail = async function (users, routes, params, callback) {

    binds = {}

    /**
   * ! change the parameters according to the table
   */
    // binds.concessionid = (!params.concessionid ? '' : params.concessionid)
    binds.blockid = (!params.blockid ? '' : params.blockid)
    

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)


    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}

module.exports = {
    fetchDataHeader,
    fetchDataDetail
}

