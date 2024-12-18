const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid",fieldcode "fieldcode", groupid "groupid", assetjobcode "assetjobcode", assettype "assettype", fixedassetcode "fixedassetcode", assetname "assetname", tagnumber "tagnumber", assetkey "assetkey", taxgroup "taxgroup", parentfaassetcode "parentfaassetcode", faqty "faqty", uom "uom", locationid"locationid", costcenterid"costcenterid", TO_CHAR(installdate, 'dd-mm-yyyy') "installdate", TO_CHAR(startdepreciatedate, 'dd-mm-yyyy')"startdepreciatedate", estimatelifeyear "estimatelifeyear", acquisitionvalue "acquisitionvalue", additionvalue "additionvalue", residualvalue "residualvalue", inputby "inputby", TO_CHAR(inputdate, 'dd-mm-yyyy hh24:mi')"inputdate",updateby "updateby",TO_CHAR(updatedate, 'dd-mm-yyyy hh24:mi')"updatedate" from maturitystatement where (fieldcode LIKE UPPER('%' || :search ||'%') OR fixedassetcode LIKE  UPPER('%' || :search ||'%') OR assetjobcode LIKE UPPER('%' || :search ||'%'))
and to_char(installdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(installdate,'mmyyyy')) ORDER BY installdate DESC`;

/**
 * ! change query table detail
 */
const detailQuery = `SELECT distinct TO_CHAR(period, 'dd-mm-yyyy') "period", fiscalyear "fiscalyear", sourcecode "sourcecode", sourcetype"sourcetype", jobcode "jobcode", jobdescription "jobdescription", amount"amount" from V_MATURECOST_DETAIL
where  jobcode = :jobcode and to_char(period,'mmyyyy') = nvl(to_char(TO_DATE(:period, 'MM/YYYY'),'mmyyyy'),to_char(period,'mmyyyy')) order by period`;

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
  binds.jobcode = !params.jobcode ? "" : params.jobcode;
  binds.period = (!params.period ? '' : params.period)

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
