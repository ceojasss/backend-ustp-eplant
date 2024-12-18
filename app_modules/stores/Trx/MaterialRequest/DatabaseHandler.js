const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 * ecode(mrpriority,'0','Low','1','Medium','2','High')
 */
const baseQuery = `SELECT rids "rowid",MR_STORECODE"mr_storecode",
v_url_preview_site ('MR',CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || MRCODE"v_url_preview",
v_url_preview_site ('MRSLR',CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || MRCODE"v_url_preview_solar",
mrcode             "mrcode",mrpriority_desc    "mrpriority_desc",mrpriority         "mrpriority",mrdate             "mrdate",
mrrequestfrom      "mrrequestfrom",mrnotes            "mrnotes",process_flag       "process_flag",
inputby            "inputby",inputdate          "inputdate",updateby           "updateby",UPDATEDATE         "updatedate"
FROM (  SELECT m.ROWID              rids,
          MR_STORECODE,
          SUM (
              SUM (
                  CASE
                      WHEN     ITEMCODE = 'DA002001'
                           AND MD.locationtype IN ('VH', 'MA')
                      THEN
                          1
                      ELSE
                          0
                  END))
              OVER (PARTITION BY m.mrcode)
              SOLAR_RA,
          SUM (
              SUM (
                  CASE
                      WHEN     ITEMCODE = 'DA002001'
                           AND MD.locationtype NOT IN ('VH', 'MA')
                      THEN
                          1
                      ELSE
                          0
                  END))
              OVER (PARTITION BY m.mrcode)
              SOLAR,
          m.mrcode,
          DECODE (mrpriority,  '0', 'Low',  '1', 'Medium',  '2', 'High')
              mrpriority_desc,
          mrpriority,
          TO_CHAR (mrdate, 'dd-mm-yyyy')
              mrdate,
          mrrequestfrom,
          mrnotes,
          CASE
              WHEN SUM (
                       SUM (
                           CASE
                               WHEN md.TID IS NOT NULL THEN 0
                               ELSE 1
                           END))
                       OVER (PARTITION BY m.mrcode) <>
                   0
              THEN
                  'CLOSED'
              ELSE
                  m.process_flag
          END
              process_flag,
          m.inputby,
          TO_CHAR (m.inputdate, 'dd-mm-yyyy hh24:mi')
              inputdate,
          m.updateby,
          TO_CHAR (m.updatedate, 'dd-mm-yyyy hh24:mi')
              updatedate
     FROM mr m, mrdetails md
    WHERE     m.mrcode = md.mrcode(+)
          AND NVL (md.status_transfer, 'Y') = 'Y'
          AND (   m.mrcode LIKE UPPER ('%' || :search || '%')
               OR mrdate LIKE UPPER ('%' || :search || '%')
               OR m.inputby LIKE UPPER ('%' || :search || '%')
               OR m.updateby LIKE UPPER ('%' || :search || '%'))
               AND TO_CHAR (mrdate, 'mmyyyy') =
               decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
               TO_CHAR (mrdate, 'mmyyyy'))
 GROUP BY mrdate,
          m.ROWID,
          MR_STORECODE,
          m.mrcode,
          process_flag,
          mrpriority,
          mrrequestfrom,
          mrnotes,
          m.inputby,
          m.inputdate,
          m.updatedate,
          m.updateby)
ORDER BY mrdate DESC, mrcode DESC`


// const baseQuery = `select rowid "rowid" ,MR_STORECODE "mr_storecode",v_url_preview_site (
//     'MR',
//     CASE
//         WHEN process_flag IS NULL THEN 'DRAFT'
//         ELSE 'APPROVED'
//     END) || MRCODE "v_url_preview",mrcode "mrcode",decode(mrpriority,'0','Low','1','Medium','2','High') "mrpriority_desc",mrpriority "mrpriority" ,to_char(mrdate,'dd-mm-yyyy') "mrdate", mrrequestfrom "mrrequestfrom", mrnotes "mrnotes", process_flag "process_flag", inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
// from mr 
// where (mrcode LIKE  UPPER('%' || :search ||'%') OR mrdate LIKE  UPPER('%' || :search ||'%')) 
// and to_char(mrdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(mrdate,'mmyyyy')) ORDER BY mrdate DESC`

/**
   * ! change query table detail
   */
const detailQuery = ` select mrs.rowid "rowid" ,
tid "tid",mrcode "mrcode", mrs.itemcode "itemcode#code",dosis "dosis",workorder "workorder",
 get_purchaseitemname(mrs.itemcode) "itemcode#description",mrs.itemdescription "itemdescription",
 quantity "quantity", jobcode "jobcode#code",getjob_des(jobcode) "jobcode#description",
locationtype "locationtype#code",
get_locationdesc (locationtype)            "locationtype#description",
locationcode "locationcode#code",
getloc_des (locationcode)                  "locationcode#description",
JOBORDER "joborder",
to_char(EXPECTDATE,'dd-mm-yyyy') "expectdate",
pi.uomcode "uom",emdek "emdek",check_jaluremdek(locationcode) "valemdekdisplayonly",
qty_available "qty_available",destination "destination",kmhm "kmhm",
 remarks "remarks", mrs.inputby "inputby", to_char(mrs.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", mrs.updateby "updateby", to_char(mrs.updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
from mrdetails mrs,purchaseitem pi
where mrs.itemcode = pi.itemcode  and mrcode= :mrcode
order by mrcode`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

    let result

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)


    } catch (error) {
        callback(error, '')
    }

    if (_.isEmpty(result)) {
        callback('', '')
    } else {
        callback('', result)
    }

    // callback('', result)
}
const fetchDataDetail = async function (users, routes, params, callback) {

    binds = {}

    /**
     * ! change the parameters according to the table
     */
    binds.mrcode = (!params.mrcode ? '' : params.mrcode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)


    } catch (error) {
        callback(error, '')
    }


    if (_.isEmpty(result)) {
        callback('', '')
    } else {
        callback('', result)
    }
}


const CheckEmdek = async function (users, routes, params, callback) {

    binds = {}
// console.log(params)
// 'L05805','HA',12
    /**
   * ! change the parameters according to the table
   */
    binds.fieldcode = (!params.fieldcode ? '' : params.fieldcode)


    let result

    // console.log(users.loginid)

    //    (users, statement, binds, opts = {})
    try {
// console.log(binds)
        // const stmt = `select check_ha_cr ('L05805','HA',12) "ha" from dual`
        const stmt = `select check_jaluremdek(:fieldcode) "valemdekdisplayonly" from dual`

        result = await database.siteWithDefExecute(users, routes, stmt, binds)
        

    } catch (error) {
        callback(error)
    }

    callback('', result)
}

module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    CheckEmdek
}





