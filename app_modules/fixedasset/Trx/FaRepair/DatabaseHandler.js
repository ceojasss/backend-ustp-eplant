const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid", referencenumber "referencenumber", to_char(referencedate, 'dd-mm-yyyy') "referencedate", fixedassetcode "fixedassetcode", 
to_char(effectivedate, 'dd-mm-yyyy') "effectivedate", addmonthdepr "addmonthdepr", description "description", inputby "inputby", 
to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from farepair 
where (referencenumber LIKE  UPPER('%' || :search ||'%') OR fixedassetcode LIKE  UPPER('%' || :search ||'%')) 
and to_char(referencedate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(referencedate,'mmyyyy')) order by referencedate`;

/**
 * ! change query table detail
 */
const detailQuery = ` select rowid "rowid", referencenumber "referencenumber", sourcetype "sourcetype", sourcecode "sourcecode", referenceno "referenceno", 
to_char(tdate, 'dd-mm-yyyy') "tdate", inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", 
to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from farepairdetail where referencenumber=:referencenumber and to_char(tdate,'mmyyyy') 
= nvl(to_char(TO_DATE(:period, 'MM/YYYY'),'mmyyyy'),to_char(tdate,'mmyyyy'))  order by tdate`;

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

  } catch (error) {
    //console.log(error)
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
  binds.referencenumber = !params.referencenumber ? "" : params.referencenumber;
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
    //console.log(error)
  }

  callback("", result);
};

module.exports = {
  fetchDataHeader,
  fetchDataDetail,
};
