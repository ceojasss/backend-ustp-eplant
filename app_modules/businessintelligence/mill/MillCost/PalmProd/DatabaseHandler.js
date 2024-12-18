
const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const baseQuery = ` SELECT   DECODE (kat, 'ACT', 'Actual', 'Budget') "tipe",
SUM (DECODE (period, 1, amount)) "b_1",
SUM (DECODE (period, 2, amount)) "b_2",
SUM (DECODE (period, 3, amount)) "b_3",
SUM (DECODE (period, 4, amount)) "b_4",
SUM (DECODE (period, 5, amount)) "b_5",
SUM (DECODE (period, 6, amount)) "b_6",
SUM (DECODE (period, 7, amount)) "b_7",
SUM (DECODE (period, 8, amount)) "b_8",
SUM (DECODE (period, 9, amount)) "b_9",
SUM (DECODE (period, 10, amount)) "b_10",
SUM (DECODE (period, 11, amount)) "b_11",
SUM (DECODE (period, 12, amount)) "b_12",
SUM (amount) "b_tot"
FROM   (  SELECT   'ACT' kat,
            year,
            TO_NUMBER (month) period,
            SUM (tvalue) amount
     FROM   rpt_logsheet_detail_consol
    WHERE       indicatorname in ( 'CPO Produksi','Kernel Produksi')
            AND year = :p_year
            AND site = DECODE (:p_site, 'USTP', site, :p_site)
 GROUP BY   year, TO_NUMBER (month)
 UNION ALL
   SELECT   'BGT' tipe,
            year,
            TO_NUMBER (month),
            SUM (VALUE) kg
     FROM   view_budgetprod_mill
    WHERE       code in ( 21,22)
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
FROM   (  SELECT   'ACT' kat,
          year,
          TO_NUMBER (month) period,
          SUM (tvalue) amount
   FROM   rpt_logsheet_detail_consol
  WHERE       indicatorname in ( 'CPO Produksi','Kernel Produksi')
          AND year = :p_year
          AND site = DECODE (:p_site, 'USTP', site, :p_site)
GROUP BY   year, TO_NUMBER (month)
UNION ALL
 SELECT   'BGT' tipe,
          year,
          TO_NUMBER (month),
          SUM (VALUE) kg
   FROM   view_budgetprod_mill
  WHERE       code IN (21,22)
          AND site = DECODE (:p_site, 'USTP', site, :p_site)
          AND year = :p_year
GROUP BY   year, TO_NUMBER (month))`;

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
