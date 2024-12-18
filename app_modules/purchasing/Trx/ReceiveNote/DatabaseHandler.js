const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = ` select rowid "rowid",receivenotecode "receivenotecode",to_char(rndate,'dd-mm-yyyy') "rndate",suppliercode "suppliercode",
deliveryordercode "deliveryordercode",
pocode "pocode",remarks "remarks",closed "closed",invoicecode "invoicecode",process_flag "process_flag",
v_url_preview_site (
    'GRN',
    CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || receivenotecode "v_url_preview",
    v_url_preview_site (
    'GRNR',
    CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || receivenotecode "v_url_preview_bpb",
inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from receivenote
where (receivenotecode LIKE  UPPER('%' || :search ||'%') OR remarks LIKE  UPPER('%' || :search ||'%')
OR pocode LIKE  UPPER('%' || :search ||'%'))
and case when :loginid not like '%HO' and receivenotecode like '%HO%' then null  else receivenotecode end = receivenotecode
AND TO_CHAR (rndate, 'mmyyyy') =
decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
TO_CHAR (rndate, 'mmyyyy')) ORDER BY rndate DESC `



/**
 * ! change query table detail
 */
const detailQuery = `select rd.rowid "rowid",
rd.tid "tid",rd.receivenotecode "receivenotecode",locationtype "locationtype#code",get_locationdesc(locationtype) "locationtype#description",locationcode "locationcode#code",getloc_des(locationcode) "locationcode#description",purchaseitemcode "purchaseitemcode",
jobcode "jobcode#code", getjob_des(jobcode) "jobcode#description", rd.quantity "quantity",karung "karung",qtyreturn "qtyreturn",rd.polineno "polineno",amountreceived "amountreceived",rd.itemdescription "itemdescription",rd.prcode "prcode", l.unitprice "unitpricedisplayonly",
rd.inputby "inputby",to_char(rd.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", rd.updateby "updateby", to_char(rd.updatedate,'dd-mm-yyyy hh24:mi') "updatedate"  from receivenotedetail rd,lpodetails l,receivenote rn
where rd.receivenotecode = :receivenotecode and purchaseitemcode=itemcode and rd.receivenotecode=rn.receivenotecode and rn.pocode=l.pocode and rd.polineno=l.polineno `


const QueryDataLink = `select prcode "prcode",TO_CHAR(prdate,'dd-mm-yyyy') "prdate",get_pr_rec(prrequestfrom) "prrequestfrom",prnotes "prnotes" from lpr 
where prcode in 
(select distinct prcode
from lprdetails where 
exists 
(SELECT DISTINCT prcode
            FROM lprpo a
           WHERE pocode = :pocode
             AND NOT EXISTS (
                    SELECT b.prcode, b.pocode, b.itemcode, b.polineno,
                           b.locationtype, b.locationcode, b.jobcode
                      FROM lprpodetails b
                     WHERE receivenotecode = :receivenotecode
                       AND b.prcode = a.prcode
                       AND b.pocode = a.pocode
                       AND b.itemcode = a.itemcode
                       AND b.polineno = a.polineno
                       AND b.locationtype = a.locationtype
                       AND b.locationcode = a.locationcode
                       AND b.jobcode = a.jobcode)
            and lprdetails.prcode = a.prcode
            and lprdetails.itemcode = a.itemcode
            and lprdetails.locationtype = a.locationtype
            and lprdetails.locationcode = a.locationcode
            and lprdetails.jobcode = a.jobcode 
            ))`

const QueryDataLinkDetails = `SELECT d.prcode "prcode", 
d.itemcode "purchaseitemcode",
d.itemdescription || ' '|| lpd.OTHERITEMDESC "itemdescription",
d.locationtype "locationtype#code",
get_locationdesc(d.locationtype) "locationtype#description",
d.locationcode "locationcode#code",
getloc_des(d.locationcode) "locationcode#description",
d.jobcode "jobcode#code",
getjob_des(d.jobcode) "jobcode#description",
TO_CHAR(d.expectdate,'dd-mm-yyyy') "expectdate",
lp.polineno "polineno",
cek_itemkarung(d.itemcode) "validatekarungdisplayonly",
d.tid "tid",
lpd.unitprice "unitpricedisplayonly",
qtyordered - nvl(qtycanceled,0) - nvl(grnqty,0)   "quantityorder" 
FROM lprdetails d, lprpo lp ,lpodetails lpd
,
(      SELECT   polineno, SUM (qtyreceived) grnqty
      FROM   lprpodetails
 WHERE   pocode = :pocode 
group by polineno) grn
WHERE     d.prcode = lp.prcode 
and d.itemcode= lp.itemcode 
and lpd.pocode=lp.pocode 
and lp.itemcode=lpd.itemcode
AND lp.pocode = :pocode
and lpd.polineno = grn.polineno(+)
AND EXISTS
        (SELECT DISTINCT prcode
           FROM lprpo a
          WHERE     pocode = :pocode
                AND NOT EXISTS
                        (SELECT b.prcode,
                                b.pocode,
                                b.itemcode,
                                b.polineno,
                                b.locationtype,
                                b.locationcode,
                                b.jobcode
                           FROM lprpodetails b
                          WHERE     receivenotecode =
                                    :receivenotecode
                                AND b.prcode = a.prcode
                                AND b.pocode = a.pocode
                                AND b.itemcode = a.itemcode
                                AND b.polineno = a.polineno
                                AND b.locationtype = a.locationtype
                                AND b.locationcode = a.locationcode
                                AND b.jobcode = a.jobcode)
                AND d.prcode = a.prcode
                AND d.itemcode = a.itemcode
                AND d.locationtype = a.locationtype
                AND d.locationcode = a.locationcode
                AND d.jobcode = a.jobcode)`

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
    binds.receivenotecode = (!params.receivenotecode ? '' : params.receivenotecode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)



    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}

const fetchDataLinkHeader = async function (users, routes, params, callback) {

    binds = {}


    /**
     * ! change the parameters according to the table
     */
    binds.pocode = (!params.pocode ? '' : params.pocode)
    binds.receivenotecode = (!params.receivenotecode ? '' : params.receivenotecode)
    // binds.search = (!params.search ? '' : params.search)
    // binds.purchasing_site = (!users.paramcode ? '' : users.paramcode)

    
    let result

    try {
        result = await database.siteWithDefExecute(users, routes, QueryDataLink, binds)

    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}


const fetchDataLinkDetails = async function (users, routes, params, callback) {

    binds = {}

    /**
     * ! change the parameters according to the table
     */
    binds.pocode = (!params.pocode ? '' : params.pocode)
    binds.receivenotecode = (!params.receivenotecode ? '' : params.receivenotecode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, QueryDataLinkDetails, binds)

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
    fetchDataLinkDetails,
    fetchDataLinkHeader,
    CheckItemSack
}
