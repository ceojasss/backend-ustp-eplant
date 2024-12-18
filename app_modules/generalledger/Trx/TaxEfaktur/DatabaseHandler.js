const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = ` select KDJENISTRANSAKSI	"kdjenistransaksi",
FGPENGGANTI	"fgpengganti",
NOMORFAKTUR	"nomorfaktur",
TANGGALFAKTUR	"tanggalfaktur",
NPWPPENJUAL	"npwppenjual",
NAMAPENJUAL	"namapenjual",
ALAMATPENJUAL	"alamatpenjual",
NPWPLAWANTRANSAKSI	"npwptrx",
NAMALAWANTRANSAKSI	"namatrx",
ALAMATLAWANTRANSAKSI	"addrtrx",
JUMLAHDPP	"jumlahdpp",
JUMLAHPPN	"jumlahppn",
JUMLAHPPNBM	"jumlahppnbm",
STATUSAPPROVAL	"statusapproval",
STATUSFAKTUR	"statusfaktur",
REFERENSI	"referensi"
from efaktur_header
order by nomorfaktur `


const detailQuery = ` select rowid "rowid" , NOMORFAKTUR	"nomorfaktur",
NAMA	"nama",
HARGASATUAN	"hargasatuan",
JUMLAHBARANG	"jumlahbarang",
HARGATOTAL	"hargatotal",
DISKON	"diskon",
DPP	"dpp",
PPN	"ppn",
TARIFPPNBM	"tarifppnbm",
PPNBM	"ppnbm"
from efaktur_detail
 where nomorfaktur = :nomorfaktur order by nama`


const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    //binds.search = (!params.search ? '' : params.search)
    //    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

    let result

    //  console.log(baseQuery)

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
    binds.nomorfaktur = (!params.nomorfaktur ? '' : params.nomorfaktur)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)

        console.log(result)

    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}
module.exports = {
    fetchDataHeader,
    fetchDataDetail
}
