
const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const baseQuery = `   SELECT   site,
tanggal - tanggalpanen As tanggal_panen,
SUM (totalqty) / SUM (SUM (totalqty)) OVER (PARTITION BY site) * 100
   pct
FROM   notaangkutbuah_consol
WHERE   tanggal = to_date(:p_date,'dd-mm-yyyy') AND site = :p_site
GROUP BY   site, tanggal - tanggalpanen
UNION ALL
SELECT   'USTP' site,
tanggal - tanggalpanen,
SUM (totalqty) / SUM (SUM (totalqty)) OVER (PARTITION BY NULL) * 100
FROM   notaangkutbuah_consol
WHERE   tanggal = :p_date AND 'USTP' = :p_site
GROUP BY   tanggal - tanggalpanen`;

const fetchData = async function (users, routes, params, callback) {
  binds = {};

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
