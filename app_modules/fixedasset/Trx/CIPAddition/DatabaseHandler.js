const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

/**
 * ! change query table header
 */
const baseQuery = `select cipcode "cipcode", assetjobcode "assetjobcode", 
fixedassetcode "fixedassetcode", assetname "assetname", tagnumber "tagnumber",
assetkey "assetkey", groupid "groupid", assettype "assettype",
taxgroup "taxgroup", spesification "spesification",
serialprodnumber "serialprodnumber", faqty "faqty", uom "uom",
pocode "pocode", invoicecode "invoicecode", suppliername "suppliername",
brand "brand", madein "madein", locationid "locationid",
costcenterid "costcenterid", to_char(installdate,'dd-mm-yyyy') "installdate",
to_char(startdepreciatedate,'dd-mm-yyyy') "startdepreciatedate",estimatelifeyear "estimatelifeyear",
acquisitionvalue "acquisitionvalue", additionvalue "additionvalue",
residualvalue "residualvalue",inputby "inputby",to_char(inputdate, 'dd-mm-yyyy hh24:mi')"inputdate",updateby "updateby",to_char(updatedate, 'dd-mm-yyyy hh24:mi')"updatedate" from cipheader
where (fixedassetcode LIKE UPPER('%' || :search ||'%') OR cipcode LIKE  UPPER('%' || :search ||'%') OR assetname LIKE UPPER('%' || :search ||'%'))
  and to_char(installdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(installdate,'mmyyyy')) ORDER BY installdate DESC`;
  
/**
 * ! change query table detail
 */
const detailQuery = ` select rowid "rowid",cipcode "cipcode",period "period",year "year" from cipdetail
where cipcode=:cipcode and period=:period and year=:year`;

const fetchDataHeader = async function (users, params, routes, callback) {
  binds = {};

  binds.limitsize = !params.size ? 0 : params.size;
  binds.page = !params.page ? 1 : params.page;
  binds.search = !params.search ? "" : params.search;
  binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

  let result;

  //console.log(binds.search, binds.dateperiode)
  try {
    result = await database.siteLimitExecute(users, routes, baseQuery, binds);

    // console.log(result)
  } catch (error) {
    callback(error, "");
  }

  // console.log(binds)
  callback("", result);
};
const fetchDataDetail = async function (users, routes, params, callback) {
  binds = {};

  /**
   * ! change the parameters according to the table
   */
  binds.cipcode = !params.cipcode ? "" : params.cipcode;
  binds.period = (!params.period ? '' : params.period)
  binds.year = (!params.year ? '' : params.year)

  let result;

  try {
    result = await database.siteWithDefExecute(
      users,
      routes,
      detailQuery,
      binds
    );
  } catch (error) {
    callback(error, "");
  }

  callback("", result);
};

module.exports = {
  fetchDataHeader,
  fetchDataDetail,
};
