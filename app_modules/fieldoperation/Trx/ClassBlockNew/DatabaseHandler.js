const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select a.estatecode "estatecode", a.divisioncode "divisioncode", to_char(a.tdate,'dd-mm-yyyy') "tdate", a.officer "officer", b.fieldcode "fieldcode", v.description "description",a.inputby "inputby", to_char(a.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", a.updateby "updateby", to_char(a.updatedate,'dd-mm-yyyy hh24:mi') "updatedate"  from classblockheader a, classblockblock b, blockmaster v
where a.ESTATECODE = b.estatecode  and a.divisioncode = b.divisioncode and a.tdate = b.tdate and b.fieldcode = v.blockid and
(a.estatecode LIKE  UPPER('%' || :search ||'%') OR a.officer LIKE  UPPER('%' || :search ||'%') )
and to_char(a.tdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(a.tdate,'mmyyyy')) ORDER BY a.tdate DESC`

/**
 * ! change query table detail
 */
const detailQuery = ` select  rowid "rowid",
estatecode "estatecode", divisioncode "divisioncode", to_char(tdate,'dd-mm-yyyy') "tdate", fieldcode "fieldcode", piringan "piringan",
gawangan "gawangan", pasarpikul "pasarpikul", tph "tph", lineno "lineno", sampletrees "sampletrees", tphcount "tphcount", cpt "cpt", pruning "pruning",inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from classblockdetails2 
where estatecode = :estatecode and divisioncode= :divisioncode and fieldcode=:fieldcode and to_char(tdate,'mmyyyy') = nvl(to_char(TO_DATE(:period, 'MM/YYYY'),'mmyyyy'),to_char(tdate,'mmyyyy')) ORDER BY tdate DESC`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

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
    binds.estatecode = (!params.estatecode ? '' : params.estatecode)
    binds.divisioncode = (!params.divisioncode ? '' : params.divisioncode)
    binds.fieldcode = (!params.fieldcode ? '' : params.fieldcode)
    binds.period = (!params.period ? '' : params.period)

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
