const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

/**
 * ! change query table header
 */
const baseQuery = `select  rowid "rowid", ALLOWDEDCODE "allowdedcode", DESCRIPTION "description" 
FROM allowded where  (allowdedcode LIKE '%' || :search ||'%' OR description LIKE '%' || :search ||'%')
order by allowdedcode DESC
`;

/**
 * ! change query table detail
 */
const detailQuery = `select rowid "rowid",ALLOWDEDCODE "allowdedcode", ALLOWANCE "allowance",
DESCRIPTION , FORMULA "formula", JOBCODE "jobcode", INCOMETAX "incometax", DC_IC "dc_ic", 
PAYROLLLISTCOLUMN "payrolllistcolumn", EMPTYPE "emtype", VIEW_SLIP "view_slip",
x.inputby, to_char(x.inputdate,'dd-mm-yyyy hh24:mi') inputdate, x.updateby, 
to_char(x.updatedate,'dd-mm-yyyy hh24:mi') updatedate
from allowded x where allowdedcode=:allowdedcode order by allowdedcode`;

const fetchDataHeader = async function (users, params, routes, callback) {
  binds = {};

  binds.limitsize = !params.size ? 0 : params.size;
  binds.page = !params.page ? 1 : params.page;
  binds.search = !params.search ? "" : params.search;
  // console.log(binds);
  let result;

  try {
    result = await database.siteLimitExecute(users, routes, baseQuery, binds);

    // console.log(result)
  } catch (error) {
    callback(error, "");
  }

  callback("", result);
};
const fetchDataDetail = async function (users, routes, params, callback) {
  binds = {};

  /**
   * ! change the parameters according to the table
   */
  binds.allowdedcode = !params.allowdedcode ? "" : params.allowdedcode;
  console.log(binds);
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
