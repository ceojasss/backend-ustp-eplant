const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT I.ROWID            "rowid",
IFCODE             "ifcode",
IFNAME             "ifname",
IFTYPE             "iftype#code",
IFSUBTYPE          "ifsubtype#code",
ESTATE             "estate#code",
DEPARTMENTNAME             "estate#description",
DIVISION           "division#code",
DIVISIONNAME       "division#description",
I.BLOCKID          "blockid#code",
DESCRIPTION        "blockid#description",
LENGTH             "length",
LENGTH_UOM         "length_uom#code",
development_uom "development_uom",
distributiontype "distributiontype",
width "width",
width_uom "width_uom#code",
volume "volume",
volume_uom "volume_uom#code",
remarks "remarks", 
inputby "inputby", 
inactive "inactive",
to_char(inactive_date,'dd-mm-yyyy') "inactive_date",
to_char(inactivedate,'dd-mm-yyyy') "inactivedate",
to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby", 
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
FROM infrastructure  I,
(SELECT DEPARTMENTCODE,
        O.DEPARTMENTNAME,
        B.DIVISIONCODE,
        DIVISIONNAME,
        BM.BLOCKID,
        BM.DESCRIPTION
   FROM BLOCKORG B, ORGANIZATION O, BLOCKMASTER BM
  WHERE     B.ESTATECODE = O.DEPARTMENTCODE
        AND B.DIVISIONCODE = O.DIVISIONCODE
        AND B.BLOCKID = BM.BLOCKID) B
WHERE     I.BLOCKID = B.BLOCKID(+)
AND I.ESTATE = DEPARTMENTCODE(+)
AND I.DIVISION = DIVISIONCODE(+)
AND ( IFCODE LIKE  UPPER('%' || :search ||'%') 
OR IFNAME LIKE ('%' || :search ||'%') 
OR IFSUBTYPE LIKE  UPPER('%' || :search ||'%')
OR inputby LIKE  UPPER('%' || :search ||'%'))
order by ifcode,ifsubtype`

/**
   * ! change query table detail
   */
const detailQuery = ` select 
rowid "rowid",
tid "tid",
ifcode "ifcode",
locationtype "locationtype#code",
get_locationdesc (locationtype)            "locationtype#description",
locationcode "locationcode#code",
getloc_des (locationcode)                  "locationcode#description",
distributionaccount "distributionaccount#code",
getjob_des(distributionaccount) "distributionaccount#desc",
volume "volume",
ditributiontype "ditributiontype",
costtype "costtype"
from infrastructurecostdistribution
where ifcode= :ifcode `



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
const fetchDataDetail = async function (users, routes, params, callback) {

    binds = {}

    /**
     * ! change the parameters according to the table
     */
    binds.ifcode = (!params.ifcode ? '' : params.ifcode)

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


