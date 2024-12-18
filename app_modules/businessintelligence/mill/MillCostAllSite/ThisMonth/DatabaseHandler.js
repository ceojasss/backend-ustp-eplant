
const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const baseQuery = `SELECT   DECODE (site,
    'GCM', '1',
    'SMG', '2',
    'SJE', '3',
    'SBE', '4',
    'SLM', '5',
    '6')
"num",
site"site",
SUM (DECODE (kat, 'ACT', coste, 0)) "cost_act",
SUM (DECODE (kat, 'BGT', coste, 0)) "cost_bgt",
DECODE (
SUM (DECODE (kat, 'BGT', coste, 0)),
0,
0,
 SUM (DECODE (kat, 'ACT', coste, 0))
/ SUM (DECODE (kat, 'BGT', coste, 0))
* 100
)
"cost_ach",
SUM (DECODE (kat, 'ACT', tbsolah, 0)) "tbsolah_act",
SUM (DECODE (kat, 'BGT', tbsolah, 0)) "tbsolah_bgt",
DECODE (
SUM (DECODE (kat, 'BGT', tbsolah, 0)),
0,
0,
 SUM (DECODE (kat, 'ACT', tbsolah, 0))
/ SUM (DECODE (kat, 'BGT', tbsolah, 0))
* 100
)
"tbsolah_ach",
DECODE (
SUM (DECODE (kat, 'ACT', tbsolah, 0)),
0,
0,
SUM (DECODE (kat, 'ACT', coste, 0))
/ SUM (DECODE (kat, 'ACT', tbsolah, 0))
)
"costtbs_act",
DECODE (
SUM (DECODE (kat, 'BGT', tbsolah, 0)),
0,
0,
SUM (DECODE (kat, 'BGT', coste, 0))
/ SUM (DECODE (kat, 'BGT', tbsolah, 0))
)
"costtbs_bgt",
DECODE (
DECODE (
  SUM (DECODE (kat, 'BGT', tbsolah, 0)),
  0,
  0,
  SUM (DECODE (kat, 'BGT', coste, 0))
  / SUM (DECODE (kat, 'BGT', tbsolah, 0))
),
0,
0,
(DECODE (
   SUM (DECODE (kat, 'ACT', tbsolah, 0)),
   0,
   0,
   SUM (DECODE (kat, 'ACT', coste, 0))
   / SUM (DECODE (kat, 'ACT', tbsolah, 0))
))
/ (DECODE (
     SUM (DECODE (kat, 'BGT', tbsolah, 0)),
     0,
     0,
     SUM (DECODE (kat, 'BGT', coste, 0))
     / SUM (DECODE (kat, 'BGT', tbsolah, 0))
  ))
* 100
)
"costtbs_ach",
--
SUM (DECODE (kat, 'ACT', palm, 0)) "palm_act",
SUM (DECODE (kat, 'BGT', palm, 0)) "palm_bgt",
DECODE (
SUM (DECODE (kat, 'BGT', palm, 0)),
0,
0,
 SUM (DECODE (kat, 'ACT', palm, 0))
/ SUM (DECODE (kat, 'BGT', palm, 0))
* 100
)
"palm_ach",
DECODE (
SUM (DECODE (kat, 'ACT', palm, 0)),
0,
0,
SUM (DECODE (kat, 'ACT', coste, 0))
/ SUM (DECODE (kat, 'ACT', palm, 0))
)
"costpalm_act",
DECODE (
SUM (DECODE (kat, 'BGT', palm, 0)),
0,
0,
SUM (DECODE (kat, 'BGT', coste, 0))
/ SUM (DECODE (kat, 'BGT', palm, 0))
)
"costpalm_bgt",
DECODE (
DECODE (
  SUM (DECODE (kat, 'BGT', palm, 0)),
  0,
  0,
  SUM (DECODE (kat, 'BGT', coste, 0))
  / SUM (DECODE (kat, 'BGT', palm, 0))
),
0,
0,
(DECODE (
   SUM (DECODE (kat, 'ACT', palm, 0)),
   0,
   0,
   SUM (DECODE (kat, 'ACT', coste, 0))
   / SUM (DECODE (kat, 'ACT', palm, 0))
))
/ (DECODE (
     SUM (DECODE (kat, 'BGT', palm, 0)),
     0,
     0,
     SUM (DECODE (kat, 'BGT', coste, 0))
     / SUM (DECODE (kat, 'BGT', palm, 0))
  ))
* 100
)
"costpalm_ach"
FROM   (                                                            --cost
SELECT    SITE,
       KAT,
       AMOUNT / 1000 coste,
       0 tbsolah,
       0 palm
FROM   millcost_consol_hist
WHERE   year = :p_year AND period = :p_month AND detkat <> 'UMUM'
UNION ALL
--tbs olah
SELECT   SITE,
      'ACT' KAT,
      0 coste,
      tvalue tbsolah,
      0 palm
FROM   rpt_logsheet_detail_consol
WHERE       indicatorname = 'TBS Olah'
      AND year = :p_year
      AND TO_NUMBER (month) = :p_month
UNION ALL
SELECT   'USTP' SITE,
      'ACT' KAT,
      0 coste,
      tvalue tbsolah,
      0 palm
FROM   rpt_logsheet_detail_consol
WHERE       indicatorname = 'TBS Olah'
      AND year = :p_year
      AND TO_NUMBER (month) = :p_month
UNION ALL
SELECT   SITE,
      'BGT' tipe,
      0,
      (VALUE) kg,
      0 palm
FROM   view_budgetprod_mill
WHERE   code = 17 AND year = :p_year AND month = :p_month
UNION ALL
SELECT   'USTP' SITE,
      'BGT' tipe,
      0,
      (VALUE) kg,
      0 palm
FROM   view_budgetprod_mill
WHERE   code = 17 AND year = :p_year AND month = :p_month
UNION ALL
--palmproduct
SELECT   SITE,
      'ACT' KAT,
      0 coste,
      0 tbsolah,
      tvalue palm
FROM   rpt_logsheet_detail_consol
WHERE       indicatorname IN ('CPO Produksi', 'Kernel Produksi')
      AND year = :p_year
      AND TO_NUMBER (month) = :p_month
UNION ALL
SELECT   'USTP' SITE,
      'ACT' KAT,
      0 coste,
      0 tbsolah,
      tvalue palm
FROM   rpt_logsheet_detail_consol
WHERE       indicatorname IN ('CPO Produksi', 'Kernel Produksi')
      AND year = :p_year
      AND TO_NUMBER (month) = :p_month
UNION ALL
SELECT   SITE,
      'BGT' tipe,
      0,
      0,
      (VALUE) kg
FROM   view_budgetprod_mill
WHERE   code IN (21, 22) AND year = :p_year AND month = :p_month
UNION ALL
SELECT   'USTP' SITE,
      'BGT' tipe,
      0,
      0,
      (VALUE) kg
FROM   view_budgetprod_mill
WHERE   code IN (21, 22) AND year = :p_year AND month = :p_month)
GROUP BY   site
ORDER BY   1
`;

const fetchData = async function (users, routes, params, callback) {
  binds = {};
  //binds.p_year = "11-04-2022"
  binds.p_month = !params.p_month ? "" : params.p_month;
  binds.p_year = !params.p_year ? "" : params.p_year;


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
