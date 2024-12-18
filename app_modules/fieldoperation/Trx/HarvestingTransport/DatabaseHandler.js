const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid" ,nomorspb "nomorspb", estate "estate", to_char(tanggal, 'dd-mm-yyyy') "tanggal" , nokendaraan "nokendaraan", transporter "transporter", idsopir "idsopir", idkernet1 "idkernet1", idkernet2 "idkernet2",
idkernet3 "idkernet3",  idkernet4 "idkernet4",  idkernet5 "idkernet5", idtukangmuat1 "idtukangmuat1",idtukangmuat2 "idtukangmuat2",idtukangmuat3 "idtukangmuat3",idtukangmuat4 "idtukangmuat4", 
totaljanjang "totaljanjang", noticket "noticket", berat "berat", destinationcode "destinationcode", kernetname1 "kernetname1", kernetname2 "kernetname2", kernetname3 "kernetname3",
  kernetname4 "kernetname4", kernetname5 "kernetname5", to_char(tanggalmuat,'dd-mm-yyyy') "tanggalmuat" , inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
from notaangkutbuahheader where (nomorspb LIKE  UPPER('%' || :search ||'%') OR nokendaraan LIKE  UPPER('%' || :search ||'%') )
and to_char(tanggal,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(tanggal,'mmyyyy')) ORDER BY tanggal DESC`

/**
 * ! change query table detail
 */
const detailQuery = `select rowid "rowid", 
nomorspb "nomorspb", estate "estate", divisi "divisi", block "block", to_char (tanggalpanen, 'dd-mm-yyyy') "tanggalpanen", jumlahjanjang "jumlahjanjang", keterangan "keterangan" 
, inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from notaangkutbuahdetail where nomorspb = :nomorspb and to_char(tanggalpanen,'mmyyyy') = nvl(to_char(TO_DATE(:period, 'MM/YYYY'),'mmyyyy'),to_char(tanggalpanen,'mmyyyy')) ORDER BY tanggalpanen DESC`



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
    binds.nomorspb = (!params.nomorspb ? '' : params.nomorspb)
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
