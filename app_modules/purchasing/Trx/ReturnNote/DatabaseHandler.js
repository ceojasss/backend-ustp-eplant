const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select a.rowid "rowid",returnnotenumber "returnnotenumber",receivenotenumber "receivenotenumber#code",suppliercode "supplierdisplayonly",pocode "pocodedisplayonly",
v_url_preview_site (
    'RN',
    CASE WHEN a.process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || returnnotenumber "v_url_preview",to_char(rtndate, 'dd-mm-yyyy') "rtndate",a.remarks "remarks",
a.inputby "inputby", to_char(a.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", a.updateby "updateby", to_char(a.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"  from returnnote a, receivenote b
where (returnnotenumber LIKE  UPPER('%' || :search ||'%') OR a.remarks LIKE  UPPER('%' || :search ||'%') OR pocode LIKE  UPPER('%' || :search ||'%') OR receivenotenumber LIKE  UPPER('%' || :search ||'%')) and a.receivenotenumber = b.receivenotecode 
  and to_char(rtndate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(rtndate,'mmyyyy')) ORDER BY rtndate DESC`

/**
   * ! change query table detail
   */
const detailQuery = ` select rowid "rowid",
tid "tid",returnnotenumber "returnnotenumber",polineno "polinenondisplayonly#code" ,polineno "polineno",itemcode "itemcode",get_purchaseitemname(itemcode) "descriptiondisplayonly",qtyreceive "qtyreceive",polineno "polineno#code",
qtyreturn "qtyreturn",locationtype "locationtype",locationcode "locationcode",jobcode "jobcode",karung "karung",
inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from returnnotedetail
where returnnotenumber = :returnnotenumber`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

    let result

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
    binds.returnnotenumber = (!params.returnnotenumber ? '' : params.returnnotenumber)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)



    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}

const CheckItemSack = async function (users, routes, params, callback) {

    binds = {}
// console.log(params)
// 'L05805','HA',12
    /**
   * ! change the parameters according to the table
   */
    binds.itemcode = (!params.itemcode ? '' : params.itemcode)


    let result

    // console.log(users.loginid)

    //    (users, statement, binds, opts = {})
    try {
// console.log(binds)
        // const stmt = `select check_ha_cr ('L05805','HA',12) "ha" from dual`
        const stmt = `select itemcode "itemcode" from purchaseitem_karung where itemcode= :itemcode`

        result = await database.siteWithDefExecute(users, routes, stmt, binds)
        

    } catch (error) {
        callback(error)
    }

    callback('', result)
}

module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    CheckItemSack
}
