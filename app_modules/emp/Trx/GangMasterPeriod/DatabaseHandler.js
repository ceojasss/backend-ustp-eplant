const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

/**
 * ! change query table header
 */
const baseQuery = `select  rowid "rowid", departmentcode "departmentcode", divisioncode "divisioncode", gangcode "gangcode", description "description"
from gang x
where (   departmentcode LIKE '%' || :search || '%'
OR divisioncode LIKE '%' || :search || '%'
OR gangcode LIKE '%' || :search || '%'
OR description LIKE '%' || :search || '%') and mandorecode is not null 
order by departmentcode, divisioncode,gangcode, description`;

/**
 * ! change query table detail
 */
const detailQuery = `select x.rowid "rowid",
gangcode "gangcode", x.empcode "empcode", e.empname "empname", empcode_lf "empcode_lf", e_lf.empname "empname_lf"
from empgang x, empmasterepms e, empmasterepms e_lf
where x.empcode = e.empcode and gangcode=:gangcode
and x.empcode_lf = e_lf.empcode(+)`;

const fetchDataHeader = async function (users, params, routes, callback) {
  binds = {};

  binds.limitsize = !params.size ? 0 : params.size;
  binds.page = !params.page ? 1 : params.page;
  binds.search = !params.search ? "" : params.search;
  //binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

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
  binds.gangcode = !params.gangcode ? "" : params.gangcode;
  //binds.period = (!params.period ? '' : params.period)

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
