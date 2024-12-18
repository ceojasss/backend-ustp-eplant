const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

// const baseQuery = ` select CONTROLJOB "controljob", GROUPCODE "groupcode",
// GROUPDESCRIPTION "groupdescription", LEVELCODE "levelcode", PARENTCODE "parentcode"
// from stockgroup `

const baseQuery = ` select rowid "rowid",groupid "groupid#code",assetname "assetname", fixedassetcode "fixedassetcode", seq "seq", assetkey "assetkey", assetname "ssetname", spesification "spesification", madein "madein", tagnumber "tagnumber",
serialprodnumber "serialprodnumber", faqty "faqty", pocode "pocode", vouc_num "vouc_num", parentfaassetcode "parentfaassetcode#code",ytddepreciation "ytddepreciation",accumdepreciatetax "accumdepreciatetax", locationid "locationid#code", costcenterid "costcenterid#code", to_char(installdate,'dd-mm-yyyy') "installdate",
assettype "assettype", to_char(startdepreciatedate, 'dd-mm-yyyy') "startdepreciatedate", estimatelifeyear "estimatelifeyear", taxgroup "taxgroup", acquisitionvalue "acquisitionvalue", additionvalue "additionvalue",
currentmounthdepr "currentmounthdepr", to_char(accumdate,'dd-mm-yyyy') "accumdate", accumdepreciate "accumdepreciate", residualvalue "residualvalue", to_char(disposedate,'dd-mm-yyyy') "disposedate", disposeaccum "disposeaccum",
disposevalue "disposevalue", inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from fafixedasset
where (fixedassetcode LIKE  UPPER('%' || :search ||'%') OR assetname LIKE UPPER('%' || :search ||'%'))`





const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}

    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    // binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

    let result

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)

        //console.log(result)
    } catch (error) {
        callback(error, '')
    }

    callback('', result)
}




module.exports = {
    fetchDataHeader
}


