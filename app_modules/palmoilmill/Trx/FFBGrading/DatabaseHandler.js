const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT a.rowid "rowid",nomorsortasi "nomorsortasi", TO_CHAR(tanggal, 'dd-mm-yyyy') "tanggal", nomorspb "nomorspb", to_char(jamsortasi,'hh24:mi') "jamsortasi",idtukangbongkar1 "idtukangbongkar1",estate "estate",b.nokendaraan "nokendaraan",ffbunitgrading "ffbunitgrading",a.noticket "noticket", 
a.divisi "divisi", tahuntanam "tahuntanam",a.beratbersih "beratbersih",a.jumlahjanjang "jumlahjanjang",blockid "blockid",inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate"
, updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from sortasiheader a, wbticket_all b where a.noticket=b.noticket(+) and (nomorsortasi LIKE UPPER ('%' || :search || '%')
AND  TO_CHAR (tanggal, 'mmyyyy') =
decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'))) 
order by nomorsortasi desc`


/**
   * ! change query table detail
   */
const detailQuery = `SELECT a.rowid "rowid",nomorsortasi "nomorsortasi",a.tid "tid",  jenissortasi "jenissortasi",parametervalue "namesortasidisplayonly", jumlah "jumlah", berat "berat",remarks "remarks", a.inputby "inputby", to_char(a.inputdate, 'dd-mm-yyyy hh24:mm') "inputdate",
a.updateby "updateby",to_char(a.updatedate, 'dd-mm-yyyy hh24:mm') "updatedate", uom "uomdisplayonly", rate "ratedisplayonly", image  "image"
from  sortasidetail a, parametervalue b  where nomorsortasi = :nomorsortasi and a.jenissortasi=b.parametervaluecode and parametercode = 'POM02' order by jenissortasi`

const requestData = `select parametervaluecode /*||' ' ||parametervalue*/ "jenissortasi",parametervalue "namesortasidisplayonly", uom "uomdisplayonly", rate "ratedisplayonly" from PARAMETERVALUE where parametercode = 'POM02' order by parametervaluecode`

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
    binds.nomorsortasi = (!params.nomorsortasi ? '' : params.nomorsortasi)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)


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



    // binds.progressdate = (!params.progressdate ? '' : params.progressdate)
    // binds.progressno = (!params.progressno ? '' : params.progressno)
    // binds.agreementcode = (!params.agreementcode ? '' : params.agreementcode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, requestData, binds)

    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}

module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    fetchDataLinkDetails
}






