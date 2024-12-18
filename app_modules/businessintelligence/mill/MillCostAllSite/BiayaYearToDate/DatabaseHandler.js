
const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const baseQuery = `SELECT   DECODE (detkat,
    'OLAH', '1. Biaya Pengolahan',
    'MAIN', '2. Biaya Perawatan',
    '3. Biaya Umum PKS')
"tipe",
SUM (DECODE (site || kat, 'USTPACT', amount, 0)) "ustp_act",
SUM (DECODE (site || kat, 'USTPBGT', amount, 0)) "ustp_bgt",
DECODE (
SUM (DECODE (site || kat, 'USTPBGT', amount, 0)),
0,
0,
 SUM (DECODE (site || kat, 'USTPACT', amount, 0))
/ SUM (DECODE (site || kat, 'USTPBGT', amount, 0))
* 100
)
"ustp_ach",
SUM (DECODE (site || kat, 'GCMACT', amount, 0)) "gcm_act",
SUM (DECODE (site || kat, 'GCMBGT', amount, 0)) "gcm_bgt",
DECODE (
SUM (DECODE (site || kat, 'GCMBGT', amount, 0)),
0,
0,
 SUM (DECODE (site || kat, 'GCMACT', amount, 0))
/ SUM (DECODE (site || kat, 'GCMBGT', amount, 0))
* 100
)
"gcm_ach",
SUM (DECODE (site || kat, 'SMGACT', amount, 0)) "smg_act",
SUM (DECODE (site || kat, 'SMGBGT', amount, 0)) "smg_bgt",
DECODE (
SUM (DECODE (site || kat, 'SMGBGT', amount, 0)),
0,
0,
 SUM (DECODE (site || kat, 'SMGACT', amount, 0))
/ SUM (DECODE (site || kat, 'SMGBGT', amount, 0))
* 100
)
"smg_ach",
SUM (DECODE (site || kat, 'SJEACT', amount, 0)) "sje_act",
SUM (DECODE (site || kat, 'SJEBGT', amount, 0)) "sje_bgt",
DECODE (
SUM (DECODE (site || kat, 'SJEBGT', amount, 0)),
0,
0,
 SUM (DECODE (site || kat, 'SJEACT', amount, 0))
/ SUM (DECODE (site || kat, 'SJEBGT', amount, 0))
* 100
)
"sje_ach",
SUM (DECODE (site || kat, 'SBEACT', amount, 0)) "sbe_act",
SUM (DECODE (site || kat, 'SBEBGT', amount, 0)) "sbe_bgt",
DECODE (
SUM (DECODE (site || kat, 'SBEBGT', amount, 0)),
0,
0,
 SUM (DECODE (site || kat, 'SBEACT', amount, 0))
/ SUM (DECODE (site || kat, 'SBEBGT', amount, 0))
* 100
)
"sbe_ach",
SUM (DECODE (site || kat, 'SLMACT', amount, 0)) "slm_act",
SUM (DECODE (site || kat, 'SLMBGT', amount, 0)) "slm_bgt",
DECODE (
SUM (DECODE (site || kat, 'SLMBGT', amount, 0)),
0,
0,
 SUM (DECODE (site || kat, 'SLMACT', amount, 0))
/ SUM (DECODE (site || kat, 'SLMBGT', amount, 0))
* 100
)
"slm_ach"
FROM   (SELECT   SITE,
      KAT,
      DETKAT,
      YEAR,
      PERIOD,
      AMOUNT / 1000 amount
FROM   millcost_consol_hist
WHERE   year = :p_year AND period <= :p_period)
GROUP BY   DECODE (detkat,
    'OLAH', '1. Biaya Pengolahan',
    'MAIN', '2. Biaya Perawatan',
    '3. Biaya Umum PKS')
ORDER BY   1`;

const fetchData = async function (users, routes, params, callback) {
  binds = {};
  //binds.p_year = "11-04-2022"
  binds.p_year = !params.p_year ? "" : params.p_year;
  binds.p_period = !params.p_period ? "" : params.p_period;
  

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
