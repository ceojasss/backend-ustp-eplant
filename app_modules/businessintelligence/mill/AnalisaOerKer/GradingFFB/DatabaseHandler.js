
const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const baseQuery = `SELECT   site, SUM (ritase) timbang, SUM (grading) sortasi
FROM   (  SELECT   site, COUNT ( * ) ritase, 0 grading
            FROM   wbticket_consol
           WHERE   jenismuatan = 'FFB' AND tglmasuk = to_date(:p_date,'dd-mm-yyyy')
        GROUP BY   site
        UNION ALL
          SELECT   site, 0, COUNT ( * )
            FROM   rpt_sortasi_hist_consol
           WHERE   tdate = to_date(:p_date,'dd-mm-yyyy') AND urut = 1
        GROUP BY   site
        UNION ALL
        SELECT   'USTP' site, COUNT ( * ) ritase, 0 grading
          FROM   wbticket_consol
         WHERE   jenismuatan = 'FFB' AND tglmasuk = to_date(:p_date,'dd-mm-yyyy')
        UNION ALL
        SELECT   'USTP' site, 0, COUNT ( * )
          FROM   rpt_sortasi_hist_consol
         WHERE   tdate = to_date(:p_date,'dd-mm-yyyy') AND urut = 1)
WHERE   site = :p_site
GROUP BY   site`;

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
