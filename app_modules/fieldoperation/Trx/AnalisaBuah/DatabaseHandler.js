const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')



const baseQuery = ` Select a.ROWID "rowid",to_char(TGL_TERIMA,'dd-mm-yyyy') "tgl_terima", to_char(TGL_SELESAI,'dd-mm-yyyy') "tgl_selesai", a.SITE "site", a.FIELDCODE "fieldcode#code", breeder "fieldcode#description", NO_POKOK "no_pokok", NO_LAB "no_lab", VARIETAS "varietas", JML_BRD_LEPAS "jml_brd_lepas", 
SEBELUM_PANEN "sebelum_panen", SESUDAH_PANEN "sesudah_panen", DALAM_PERJALANAN "dalam_perjalanan",foto "foto",excluded "excluded", BUAH_TANDAN "buah_tandan", BERAT_TANGKAI "berat_tangkai", 
BERAT_SPIKELET "berat_spikelet", TOTAL_SPIKELET "total_spikelet", BERAT_SPIKELET_SAMPLE_1 "berat_spikelet_sample_1", BERAT_SPIKELET_SAMPLE_2 "berat_spikelet_sample_2",BERAT_SPIKELET_SAMPLE_1+BERAT_SPIKELET_SAMPLE_2 "beratspikeletdisplayonly",TOTAL_SPIKELET_SAMPLE "total_spikelet_sample", 
BERAT_INNER_FRUIT "berat_inner_fruit", BERAT_OUTER_FRUIT "berat_outer_fruit", BERAT_INNER_PARTHENO "berat_inner_partheno", 
BERAT_OUTER_PARTHENO "berat_outer_partheno", JML_INNER_FRUIT "jml_inner_fruit", JML_OUTER_FRUIT "jml_outer_fruit", JML_INNER_PARHENO "jml_inner_parheno", JML_OUTER_PARTHENO "jml_outer_partheno", 
JML_BRONDOLAN "jml_brondolan", BERAT_30_BRONDOL_SAMPLE "berat_30_brondol_sample", BERAT_SAMPAH_SPIKELET "berat_sampah_spikelet", BERAT_CAWAN_NUT "berat_cawan_nut", 
BERAT_FRESH_NUT "berat_fresh_nut", BERAT_CAWAN_MESOCARP "berat_cawan_mesocarp", BERAT_CAWAN_MESOCARP_BASAH "berat_cawan_mesocarp_basah", BERAT_30_INNER_FRUIT "berat_30_inner_fruit", 
BERAT_30_OUTER_FRUIT "berat_30_outer_fruit", BERAT_30_INNER_PHARTENO "berat_30_inner_pharteno", BERAT_30_OUTER_PHARTENO "berat_30_outer_pharteno", 
JML_30_INNER_FRUIT "jml_30_inner_fruit", JML_30_OUTER_FRUIT "jml_30_outer_fruit", JML_30_INNER_PHARTENO "jml_30_inner_pharteno", JML_30_OUTER_PHARTENO "jml_30_outer_pharteno", 
BERAT_CAWAN_MESOCARP_KERING "berat_cawan_mesocarp_kering", BERAT_KERTAS_WHATMAN_1 "berat_kertas_whatman_1", BERAT_KERTAS_WHATMAN_2 "berat_kertas_whatman_2", 
BERAT_KERTAS_WHATMAN_3 "berat_kertas_whatman_3", BERAT_MESOCARP_1 "berat_mesocarp_1", BERAT_MESOCARP_2 "berat_mesocarp_2", BERAT_MESOCARP_3 "berat_mesocarp_3", 
BERAT_KERTAS_MESOCARP_1 "berat_kertas_mesocarp_1", BERAT_KERTAS_MESOCARP_2 "berat_kertas_mesocarp_2", BERAT_KERTAS_MESOCARP_3 "berat_kertas_mesocarp_3", 
BERAT_CAWAN_NUT_KERING "berat_cawan_nut_kering", BERAT_CAWAN_KERNEL "berat_cawan_kernel", INPUTBY "inputby", to_char(INPUTDATE,'dd-mm-yyyy hh24:mi') "inputdate", UPDATEBY "updateby", to_char(UPDATEDATE,'dd-mm-yyyy hh24:mi') "updatedate" from analisabuah a, epms_ustp.fieldcrop_consol b
where a.site = b.site and a.fieldcode= b.fieldcode 
AND to_char(TGL_TERIMA,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(TGL_TERIMA,'mmyyyy'))
AND (   a.FIELDCODE LIKE '%' || :search || '%'
OR a.site LIKE '%' || :search || '%')`





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




module.exports = {
    fetchDataHeader
}


