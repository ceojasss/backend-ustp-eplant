
const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const baseQuery = ` SELECT   tdate,
indicatorname,
site,
SUM (ROUND (tvalue, 2)) val,
0 pct
FROM   (                                          --data hari ini non ustp
 SELECT    site,
           no,
           tdate,
           indicatorname,
           tvalue
    FROM   rpt_logsheet_detail_consol
   WHERE   tdate = to_date(:p_date,'dd-mm-yyyy')
           AND indicatorname IN ('OER', 'KER', 'Oil Quality - FFA'))
WHERE   site = :p_site
GROUP BY   tdate, site, indicatorname`;

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
