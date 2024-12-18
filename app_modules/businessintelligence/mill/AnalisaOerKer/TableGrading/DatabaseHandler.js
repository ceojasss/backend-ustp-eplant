
const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const base1Query = `SELECT   to_date(tdate,'dd-mm-yyyy')"tdate",
kategori indicatorname,
site,
qty,
pct
FROM   view_rpt_sortasi_hist_consol
WHERE   tdate = to_date(:p_date,'dd-mm-yyyy') AND site = :p_site
ORDER BY  indicatorname DESC `;
const baseQuery = `SELECT   to_char(tdate,'dd-mm-yyyy')"tdate",
kategori "indicatorname",
site"site",
qty"qty",
pct"pct"
FROM   view_rpt_sortasi_hist_consol
WHERE   tdate = to_date(:p_date,'dd-mm-yyyy') AND site = :p_site
ORDER BY  kategori DESC`;

const fetchData = async function (users, routes, params, callback) {
  binds = {};
  //binds.p_date = "11-04-2022"
  binds.p_date = !params.p_date ? "" : params.p_date;
  binds.p_site = !params.p_site ? "" : params.p_site;

  let result;

  try {
    result = await database.siteWithDefExecute(users, routes, baseQuery, binds);
  } catch (error) {
    callback(error, "");
  }

  callback("", result);
};

module.exports = {
  fetchData,
};