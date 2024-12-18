
const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const baseQuery = ` SELECT   DECODE (kat, 'ACT', 'Actual', 'Budget') "tipe",
DECODE (
   SUM (DECODE (period, 1, amount2)),
   0,
   0,
   SUM (DECODE (period, 1, amount1))
   / SUM (DECODE (period, 1, amount2))
)
   "b_1",
DECODE (
   SUM (DECODE (period, 2, amount2)),
   0,
   0,
   SUM (DECODE (period, 2, amount1))
   / SUM (DECODE (period, 2, amount2))
)
   "b_2",
DECODE (
   SUM (DECODE (period, 3, amount2)),
   0,
   0,
   SUM (DECODE (period, 3, amount1))
   / SUM (DECODE (period, 3, amount2))
)
   "b_3",
DECODE (
   SUM (DECODE (period, 4, amount2)),
   0,
   0,
   SUM (DECODE (period, 4, amount1))
   / SUM (DECODE (period, 4, amount2))
)
   "b_4",
DECODE (
   SUM (DECODE (period, 5, amount2)),
   0,
   0,
   SUM (DECODE (period, 5, amount1))
   / SUM (DECODE (period, 5, amount2))
)
   "b_5",
DECODE (
   SUM (DECODE (period, 6, amount2)),
   0,
   0,
   SUM (DECODE (period, 6, amount1))
   / SUM (DECODE (period, 6, amount2))
)
   "b_6",
DECODE (
   SUM (DECODE (period, 7, amount2)),
   0,
   0,
   SUM (DECODE (period, 7, amount1))
   / SUM (DECODE (period, 7, amount2))
)
   "b_7",
DECODE (
   SUM (DECODE (period, 8, amount2)),
   0,
   0,
   SUM (DECODE (period, 8, amount1))
   / SUM (DECODE (period, 8, amount2))
)
   "b_8",
DECODE (
   SUM (DECODE (period, 9, amount2)),
   0,
   0,
   SUM (DECODE (period, 9, amount1))
   / SUM (DECODE (period, 9, amount2))
)
   "b_9",
DECODE (
   SUM (DECODE (period, 10, amount2)),
   0,
   0,
   SUM (DECODE (period, 10, amount1))
   / SUM (DECODE (period, 10, amount2))
)
   "b_10",
DECODE (
   SUM (DECODE (period, 11, amount2)),
   0,
   0,
   SUM (DECODE (period, 11, amount1))
   / SUM (DECODE (period, 11, amount2))
)
   "b_11",
DECODE (
   SUM (DECODE (period, 12, amount2)),
   0,
   0,
   SUM (DECODE (period, 12, amount1))
   / SUM (DECODE (period, 12, amount2))
)
   "b_12",
DECODE (SUM (amount2), 0, 0, SUM (amount1) / SUM (amount2)) "b_tot"
FROM   (SELECT   SITE,
          KAT,
          DETKAT,
          YEAR,
          PERIOD,
          AMOUNT / 1000 amount1,
          0 amount2
   FROM   millcost_consol_hist
  WHERE   year = :p_year AND site = :p_site AND DETKAT <> 'UMUM'
 UNION ALL
   SELECT   :p_site site ,
            'ACT' ,
            NULL,
            TO_NUMBER (year),
            TO_NUMBER (month) period,
            0,
            SUM (tvalue) amount
     FROM   rpt_logsheet_detail_consol
    WHERE       indicatorname in ( 'CPO Produksi','Kernel Produksi')
            AND year = :p_year
            AND site = DECODE (:p_site, 'USTP', site, :p_site)
 GROUP BY   year, TO_NUMBER (month)
 UNION ALL
   SELECT   :p_site,
            'BGT',
            NULL,
            TO_NUMBER (year),
            TO_NUMBER (month),
            0,
            SUM (VALUE) kg
     FROM   view_budgetprod_mill
    WHERE       code in (21,22)
            AND site = DECODE (:p_site, 'USTP', site, :p_site)
            AND year = :p_year
 GROUP BY   year, TO_NUMBER (month))
GROUP BY   kat
UNION ALL
SELECT   'Achievement (%)' grup,
SUM (DECODE (kat || period, 'ACT1', amount))
/ SUM (DECODE (kat || period, 'BGT1', amount))
* 100
 b_1,
SUM (DECODE (kat || period, 'ACT2', amount))
/ SUM (DECODE (kat || period, 'BGT2', amount))
* 100
 b_2,
SUM (DECODE (kat || period, 'ACT3', amount))
/ SUM (DECODE (kat || period, 'BGT3', amount))
* 100
 b_3,
SUM (DECODE (kat || period, 'ACT4', amount))
/ SUM (DECODE (kat || period, 'BGT4', amount))
* 100
 b_4,
SUM (DECODE (kat || period, 'ACT5', amount))
/ SUM (DECODE (kat || period, 'BGT5', amount))
* 100
 b_5,
SUM (DECODE (kat || period, 'ACT6', amount))
/ SUM (DECODE (kat || period, 'BGT6', amount))
* 100
 b_6,
SUM (DECODE (kat || period, 'ACT7', amount))
/ SUM (DECODE (kat || period, 'BGT7', amount))
* 100
 b_7,
SUM (DECODE (kat || period, 'ACT8', amount))
/ SUM (DECODE (kat || period, 'BGT8', amount))
* 100
 b_8,
SUM (DECODE (kat || period, 'ACT9', amount))
/ SUM (DECODE (kat || period, 'BGT9', amount))
* 100
 b_9,
SUM (DECODE (kat || period, 'ACT10', amount))
/ SUM (DECODE (kat || period, 'BGT10', amount))
* 100
 b_10,
SUM (DECODE (kat || period, 'ACT11', amount))
/ SUM (DECODE (kat || period, 'BGT11', amount))
* 100
 b_11,
SUM (DECODE (kat || period, 'ACT12', amount))
/ SUM (DECODE (kat || period, 'BGT12', amount))
* 100
 b_12,
SUM (DECODE (kat, 'ACT', amount))
/ SUM (DECODE (kat, 'BGT', amount))
* 100
 b_tot
FROM   (  SELECT   site,
          kat,
          period,
          DECODE (SUM (amount2),
                  0, 0,
                  SUM (amount1) / SUM (amount2))
             amount
   FROM   (SELECT   SITE,
                    KAT,
                    DETKAT,
                    YEAR,
                    PERIOD,
                    AMOUNT / 1000 amount1,
                    0 amount2
             FROM   millcost_consol_hist
            WHERE       year = :p_year
                    AND site = :p_site
                    AND DETKAT <> 'UMUM'
           UNION ALL
             SELECT   :p_site,
                      'ACT',
                      NULL,
                      TO_NUMBER (year),
                      TO_NUMBER (month) period,
                      0,
                      SUM (tvalue) amount
               FROM   rpt_logsheet_detail_consol
              WHERE   indicatorname in ( 'CPO Produksi','Kernel Produksi') AND year = :p_year
                      AND site =
                            DECODE (:p_site, 'USTP', site, :p_site)
           GROUP BY   year, TO_NUMBER (month)
           UNION ALL
             SELECT   :p_site,
                      'BGT',
                      NULL,
                      TO_NUMBER (year),
                      TO_NUMBER (month),
                      0,
                      SUM (VALUE) kg
               FROM   view_budgetprod_mill
              WHERE   code in (21,22)
                      AND site =
                            DECODE (:p_site, 'USTP', site, :p_site)
                      AND year = :p_year
           GROUP BY   year, TO_NUMBER (month))
GROUP BY   site, kat, period)`;

const fetchData = async function (users, routes, params, callback) {
  binds = {};
  //binds.p_year = "11-04-2022"
  binds.p_year = !params.p_year ? "" : params.p_year;
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
