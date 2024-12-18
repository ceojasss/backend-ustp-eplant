const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

/**
 * ! change query table header
 */
const baseQuery = `select
rowid "rowid"
, pocode "pocode"
, itemcode "itemcode"
, itemdescription "itemdescription"
, invoicecode "invoicecode"
, suppliername "suppliername"
, currencycode "currencycode"
, currencyrate "currencyrate"
, faqty "fatqy"
, acquisitionvalue "acquisitionvalue"
, fixedassetcode "fixedassetcode"
, rncode "rncode"
, to_char(rndate,'dd-mm-yyyy') "rndate"
, to_char(posteddate,'dd-mm-yyyy') "posteddate"
, year "year"
, inputby "inputby"
, to_char(inputdate, 'dd-mm-yyyy hh24:mi')"inputdate"
, updateby "updateby"
, to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
 FROM faclearaddition 
  where 
  (pocode LIKE  UPPER('%' || :search ||'%') OR fixedassetcode LIKE UPPER('%' || :search ||'%'))
  and to_char(posteddate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(posteddate,'mmyyyy')) ORDER BY posteddate DESC`;

/**
 * ! change query table detail
 */
const detailQuery = `select 
rowid "rowid", 
tid "tid",
groupid "groupid",
fixedassetcode "fixedassetcode", 
parentfaassetcode "parentfaassetcode", 
assetkey "assetkey", 
assetname "assetname", 
spesification "spesification", 
brand "brand", 
madein "madein", 
tagnumber "tagnumber", 
serialprodnumber "serialprodnumber", 
faqty "faqty", 
seq "seq",
year "year",
jobcode "jobcode",
pocode "pocode",
vouc_num "vouc_num", 
locationid "locationid",  
to_char(startdepreciatedate, 'dd-mm-yyyy') "startdepreciatedate",
estimatelifeyear "estimatelifeyear",
locationid "locationid",
acquisitionvalue "acquisitionvalue",
additionvalue "additionvalue",
residualvalue "residualvalue",
currencycode "currencycode",
currencyrate "currencyrate",
taxgroup "taxgroup",
period "period",
assettype "assettype",
to_char(installdate, 'dd-mm-yyyy') "installdate",
costcenterid "costcenterid",
to_char(posteddate, 'dd-mm-yyyy') "posteddate", 
inputby "inputby", 
to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby",
to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" 
from faclearadditiondetail where fixedassetcode=:fixedassetcode 
and to_char(posteddate,'mmyyyy') = nvl(to_char(TO_DATE(:period, 'MM/YYYY'),'mmyyyy'),to_char(posteddate,'mmyyyy'))  order by posteddate`;

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

    callback("", result);
  } catch (error) {
    callback(error, "");
  }
};
const fetchDataDetail = async function (users, routes, params, callback) {
  binds = {};

  /**
   * ! change the parameters according to the table
   */
  binds.fixedassetcode = !params.fixedassetcode ? "" : params.fixedassetcode;
  binds.period = (!params.period ? '' : params.period)

  let result;

  try {
    result = await database.siteWithDefExecute(
      users,
      routes,
      detailQuery,
      binds
    );

    callback("", result);

  } catch (error) {
    callback(error, "");
    //console.log(error)
  }

};

module.exports = {
  fetchDataHeader,
  fetchDataDetail,
};
