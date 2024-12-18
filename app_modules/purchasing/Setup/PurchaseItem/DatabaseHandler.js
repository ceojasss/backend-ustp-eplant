const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select  "rowid",  "itemcode", "itemtype_desc", "itemtype", 
"itemdescription",  "uomcode#code", "uomcode#description",  "stockgroupcode#code",  "stockgroupcode#description",  "averageprice", 
"minstockqty",  "maxstockqty",  "leadtime",  "inactive",  "inactivedate",  "valuation_method", 
"lifetime", NVL(lifetimeuom,'') "lifetimeuom#code" ,y.unitofmeasuredesc "lifetimeuom#description" , "using_whspecificlocdesc" , "using_whspecificloc",  "partno",  "specification",  "inputby" , "inputdate",
"updateby",  "updatedate" 
from
(
select pi.rowid "rowid", itemcode "itemcode",decode(itemtype,'0','Stock Item','1','Fixed Asset','2','Seeding','3','Expenses') "itemtype_desc",itemtype "itemtype", itemdescription "itemdescription", uomcode "uomcode#code",uo.unitofmeasuredesc "uomcode#description", stockgroupcode "stockgroupcode#code", sg.groupdescription "stockgroupcode#description", averageprice "averageprice", 
minstockqty "minstockqty", maxstockqty "maxstockqty", leadtime "leadtime", pi.inactive "inactive", to_char(pi.inactivedate,'dd-mm-yyyy') "inactivedate", valuation_method "valuation_method", 
lifetime "lifetime",  decode(using_whspecificloc,'0','No','1','Yes') "using_whspecificlocdesc" ,using_whspecificloc "using_whspecificloc", partno "partno", specification "specification", pi.inputby "inputby" ,to_char(pi.inputdate,'dd-mm-yyyy hh24:mi') "inputdate",
pi.updateby "updateby", to_char(pi.updatedate,'dd-mm-yyyy hh24:mi') "updatedate", lifetimeuom 
from purchaseitem pi, stockgroup sg,unitofmeasure uo, parametervalue pv
where parametercode='EPMS106' and valuation_method = parametervaluecode and stockgroupcode = groupcode and uo.unitofmeasurecode= uomcode and 
(UPPER(itemcode) LIKE UPPER ('%' || :search || '%')
    OR UPPER(itemdescription) LIKE UPPER ('%' || :search || '%')
    OR UPPER(stockgroupcode) LIKE UPPER ('%' || :search || '%')
    ) order by pi.itemcode desc
 ) xx
 left join
 unitofmeasure y
on  xx.lifetimeuom=y.UNITOFMEASURECODE`

/**
   * ! change query table detail
   */
// const detailQuery = ` select rowid "rowid",
// tid "tid",vouchercode "vouchercode",
// locationtype "locationtype#code",
// get_locationdesc (locationtype)            "locationtype#description",
// locationcode "locationcode#code",
// getloc_des (locationcode)                  "locationcode#description",
// jobcode  "jobcode#code",
// getjob_des (jobcode)     "jobcode#description",
// amount "amount" ,reference "reference", remarks "remarks"
// from paymentvoucherdetail
// where vouchercode= :vouchercode `



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    // binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

    let result

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)

        // console.log(result)
    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}
// const fetchDataDetail = async function (users, routes, params, callback) {

//     binds = {}

//     /**
//      * ! change the parameters according to the table
//      */
//     binds.vouchercode = (!params.vouchercode ? '' : params.vouchercode)

//     let result

//     try {
//         result = await database.siteWithDefExecute(users, routes, detailQuery, binds)



//     } catch (error) {
//         callback(error, '')
//     }



//     callback('', result)
// }

module.exports = {
    fetchDataHeader,
    // fetchDataDetail
}


