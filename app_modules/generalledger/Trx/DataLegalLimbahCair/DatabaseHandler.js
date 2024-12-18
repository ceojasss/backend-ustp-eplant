const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `  SELECT mst.dept "dept",
mst.tipe "tipe",
--mst.satuan "satuan",
to_char(trx.year) "year",
to_char(trx.month) "month",
SUM (DECODE (trx.code, 'PRODUKSI', trx.tvalue, 0))
        "produksilimbah",
SUM (DECODE (trx.code, 'TO_LAND_APLIKASI', trx.tvalue, 0))
        "landaplikasi",
SUM (DECODE (trx.code, 'TO_BIOGAS', trx.tvalue, 0))
        "biogas",
SUM (DECODE (trx.code, 'TO_LISTRIK', trx.tvalue, 0))
        "produksilistrik",
SUM (DECODE (trx.code, 'TO_LISTRIK_USED', trx.tvalue, 0))
        "produksilistrikused",
SUM (DECODE (trx.code, 'TO_LISTRIK_SALE', trx.tvalue, 0))
        "produksilistriksale"
        --,trx.inputby                                       "inputby",
        --TO_CHAR (trx.inputdate, 'dd-mm-yyyy hh24:mi')             "inputdate",
        --trx.updateby                                      "updateby",
        --TO_CHAR (trx.updatedate, 'dd-mm-yyyy hh24:mi')    "updatedate" 
FROM LEGAL_EXT_REPORT_DATA trx, LEGAL_EXT_REPORT mst
WHERE     mst.tipe = trx.tipe
AND mst.code = trx.code
AND MST.dept = 'SUST'
AND MST.TIPE = 'PRODUKSI_LIMBAH_CAIR'
and (mst.code LIKE  UPPER('%' || :search ||'%') OR mst.tipe LIKE  UPPER('%' || :search ||'%') OR mst.description LIKE  UPPER('%' || :search ||'%') )
AND to_char(to_date(year,'YYYY'),'yyyy') =
decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'YYYY'), 'yyyy'),
to_char(to_date(year,'YYYY'),'yyyy'))
GROUP BY mst.dept,
mst.tipe,
--mst.satuan,
trx.year,
trx.month
--,trx.inputby,
--trx.inputdate,
--trx.updateby,
--trx.updatedate
order by trx.month,trx.year`


const detailQuery = `         select a.rowid "rowid",a.tipe "tipe", satuan "satuan", a.code "code", a.description "description", to_char(year) "year", to_char(month) "month", tvalue "tvalue" from LEGAL_EXT_REPORT_DATA a, LEGAL_EXT_REPORT b 
where 
b.tipe = a.tipe
AND b.code = a.code
AND b.dept = 'SUST' and
a.tipe = :p_type
and month = :p_month
 and year = :p_year
 order by seq`


const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

    let result

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)

        //        console.log(result)
    } catch (error) {
        callback(error, '')
    }

    if (_.isEmpty(result)) {
        callback('', '')
    } else {
        callback('', result)
    }


}


const fetchDataDetail = async function (users, routes, params, callback) {

    binds = {}

    /**
   * ! change the parameters according to the table
   */
    binds.p_type = (!params.p_type ? '' : params.p_type)
    binds.p_month = (!params.p_month ? '' : params.p_month)
    binds.p_year = (!params.p_year ? '' : params.p_year)

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
