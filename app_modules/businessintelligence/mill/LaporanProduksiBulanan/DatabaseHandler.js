
const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

const base1Query = `SELECT   RANK () OVER (PARTITION BY NULL ORDER BY no) no,
indicatorname,
DECODE (indicatorname,
        'TBS Terima', 'Ton',
        'TBS Olah', 'Ton',
        'TBS Restan', 'Ton',
        'OER', '%',
        'KER', '%',
        'CPO Produksi', 'Ton',
        'Kernel Produksi', 'Ton',
        'Mill Throughput', 'Ton',
        'Total Oil Losses to TBS', '%',
        'Total Kernel Losses to TBS', '%',
        'Oil Quality - FFA', '',
        'Hour', 'Non Milling Hours - Preventive Maintenance',
        'Hour', 'Non Milling Hours - Tunggu Buah',
        'Hour', 'Non Milling Hours - Stand By',
        'Hour', 'Stagnant - Total',
        'Hour', 'Hari Kerja',
        'Day', 'CPO Stock',
        'Ton', 'Kernel Stock',
        'Ton', 'CPO Despatch',
        'Ton', 'Kernel Despatch',
        'Ton')
   uom,
year,
SUM (DECODE (month, '13', tvalue)) annual,
SUM (DECODE (month, '01', tvalue)) januari,
SUM (DECODE (month, '02', tvalue)) februari,
SUM (DECODE (month, '03', tvalue)) maret,
SUM (DECODE (month, '04', tvalue)) april,
SUM (DECODE (month, '05', tvalue)) mei,
SUM (DECODE (month, '06', tvalue)) juni,
SUM (DECODE (month, '07', tvalue)) juli,
SUM (DECODE (month, '08', tvalue)) agustus,
SUM (DECODE (month, '09', tvalue)) september,
SUM (DECODE (month, '10', tvalue)) oktober,
SUM (DECODE (month, '11', tvalue)) november,
SUM (DECODE (month, '12', tvalue)) desember
FROM   (
select site, no, indicatorname, year, month, round(sum(tvalue),2) tvalue
from
(SELECT   site,
            no,
            indicatorname,
            year,
            month,
            CASE
               WHEN indicatorname IN
                          ('TBS Restan', 'CPO Stock', 'Kernel Stock')
               THEN
                  SUM(CASE
                         WHEN tdate =
                                 LAST_DAY(TO_DATE (
                                             '01' || month || year,
                                             'ddmmyyyy'
                                          ))
                         THEN
                            tvalue
                         ELSE
                            0
                      END)
               ELSE
                  ROUND (SUM (tvalue), 2)
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN
                     ('TBS Olah',
                      'TBS Restan',
                      'CPO Produksi',
                      'CPO Stock',
                      'Kernel Stock')
 GROUP BY   site,
            no,
            indicatorname,
            year,
            month
 UNION ALL
   SELECT   site,
            no,
            indicatorname,
            year,
            month,
            AVG (tvalue) tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN
                     ('Total Oil Losses to TBS',
                      'Total Kernel Losses to TBS')
 GROUP BY   site,
            no,
            indicatorname,
            year,
            month
 UNION ALL
   SELECT   site,
            4 no,
            'OER',
            year,
            month,
            CASE
               WHEN SUM (DECODE (indicatorname, 'TBS Olah', tvalue)) =
                       0
               THEN
                  0
               ELSE
                  SUM (DECODE (indicatorname, 'CPO Produksi', tvalue))
                  / SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                  * 100
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN ('TBS Olah', 'CPO Produksi')
 GROUP BY   site, year, month
 UNION ALL
   SELECT   site,
            5 no,
            'KER',
            year,
            month,
            CASE
               WHEN SUM (DECODE (indicatorname, 'TBS Olah', tvalue)) =
                       0
               THEN
                  0
               ELSE
                  SUM (
                     DECODE (indicatorname, 'Kernel Produksi', tvalue)
                  )
                  / SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                  * 100
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN ('TBS Olah', 'Kernel Produksi')
 GROUP BY   site, year, month
 UNION ALL
   SELECT   site,
            10 no,
            'Mill Throughput',
            year,
            month,
            CASE
               WHEN SUM (DECODE (indicatorname, 'Mill Hour', tvalue)) =
                       0
               THEN
                  0
               ELSE
                  SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                  / SUM (DECODE (indicatorname, 'Mill Hour', tvalue))
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN ('TBS Olah', 'Mill Hour')
 GROUP BY   site, year, month
 ---------------------------------------------------annual-------------------------------
 union all
 select site,
            no,
            indicatorname,
            year,
            '13' month,
            CASE
               WHEN indicatorname IN
                          ('TBS Restan', 'CPO Stock', 'Kernel Stock')
               THEN
                  SUM(CASE
                         WHEN tdate =
                                 LAST_DAY(TO_DATE (
                                             '01' || month || year,
                                             'ddmmyyyy'
                                          ))
                         THEN
                            tvalue
                         ELSE
                            0
                      END)
               ELSE
                  ROUND (SUM (tvalue), 2)
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN
                     ('TBS Olah',
                      '',
                      'CPO Produksi',
                      '',
                      '')
 GROUP BY   site,
            no,
            indicatorname,
            year
 UNION ALL
   SELECT   site,
            no,
            indicatorname,
            year,
            '13' month,
            AVG (tvalue) tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN
                     ('Total Oil Losses to TBS',
                      'Total Kernel Losses to TBS')
 GROUP BY   site,
            no,
            indicatorname,
            year
 UNION ALL
   SELECT   site,
            4 no,
            'OER',
            year,
            '13' month,
            CASE
               WHEN SUM (DECODE (indicatorname, 'TBS Olah', tvalue)) =
                       0
               THEN
                  0
               ELSE
                  SUM (DECODE (indicatorname, 'CPO Produksi', tvalue))
                  / SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                  * 100
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN ('TBS Olah', 'CPO Produksi')
 GROUP BY   site, year
 UNION ALL
   SELECT   site,
            5 no,
            'KER',
            year,
            '13' month,
            CASE
               WHEN SUM (DECODE (indicatorname, 'TBS Olah', tvalue)) =
                       0
               THEN
                  0
               ELSE
                  SUM (
                     DECODE (indicatorname, 'Kernel Produksi', tvalue)
                  )
                  / SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                  * 100
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN ('TBS Olah', 'Kernel Produksi')
 GROUP BY   site, year
 UNION ALL
   SELECT   site,
            10 no,
            'Mill Throughput',
            year,
            '13' month,
            CASE
               WHEN SUM (DECODE (indicatorname, 'Mill Hour', tvalue)) =
                       0
               THEN
                  0
               ELSE
                  SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                  / SUM (DECODE (indicatorname, 'Mill Hour', tvalue))
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN ('TBS Olah', 'Mill Hour')
 GROUP BY   site, year
 ) group by site, no, indicatorname, year, month
 )
WHERE   site = :p_site
GROUP BY   no, indicatorname, year
ORDER BY   no, year DESC`;

const baseQuery=`
SELECT   RANK () OVER (PARTITION BY NULL ORDER BY no) "no",
indicatorname"indicatorname",
DECODE (indicatorname,
        'TBS Terima', 'Ton',
        'TBS Olah', 'Ton',
        'TBS Restan', 'Ton',
        'OER', '%',
        'KER', '%',
        'CPO Produksi', 'Ton',
        'Kernel Produksi', 'Ton',
        'Mill Throughput', 'Ton',
        'Total Oil Losses to TBS', '%',
        'Total Kernel Losses to TBS', '%',
        'Oil Quality - FFA', '',
        'Hour', 'Non Milling Hours - Preventive Maintenance',
        'Hour', 'Non Milling Hours - Tunggu Buah',
        'Hour', 'Non Milling Hours - Stand By',
        'Hour', 'Stagnant - Total',
        'Hour', 'Hari Kerja',
        'Day', 'CPO Stock',
        'Ton', 'Kernel Stock',
        'Ton', 'CPO Despatch',
        'Ton', 'Kernel Despatch',
        'Ton')
   "uom",
year"year",
SUM (DECODE (month, '13', tvalue)) "annual",
SUM (DECODE (month, '01', tvalue)) "januari",
SUM (DECODE (month, '02', tvalue)) "februari",
SUM (DECODE (month, '03', tvalue)) "maret",
SUM (DECODE (month, '04', tvalue)) "april",
SUM (DECODE (month, '05', tvalue)) "mei",
SUM (DECODE (month, '06', tvalue)) "juni",
SUM (DECODE (month, '07', tvalue)) "juli",
SUM (DECODE (month, '08', tvalue)) "agustus",
SUM (DECODE (month, '09', tvalue)) "september",
SUM (DECODE (month, '10', tvalue)) "oktober",
SUM (DECODE (month, '11', tvalue)) "november",
SUM (DECODE (month, '12', tvalue)) "desember"
FROM   (
select site, no, indicatorname, year, month, round(sum(tvalue),2) tvalue
from
(SELECT   site,
            no,
            indicatorname,
            year,
            month,
            CASE
               WHEN indicatorname IN
                          ('TBS Restan', 'CPO Stock', 'Kernel Stock')
               THEN
                  SUM(CASE
                         WHEN tdate =
                                 LAST_DAY(TO_DATE (
                                             '01' || month || year,
                                             'ddmmyyyy'
                                          ))
                         THEN
                            tvalue
                         ELSE
                            0
                      END)
               ELSE
                  ROUND (SUM (tvalue), 2)
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN
                     ('TBS Olah',
                      'TBS Restan',
                      'CPO Produksi',
                      'CPO Stock',
                      'Kernel Stock')
 GROUP BY   site,
            no,
            indicatorname,
            year,
            month
 UNION ALL
   SELECT   site,
            no,
            indicatorname,
            year,
            month,
            AVG (tvalue) tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN
                     ('Total Oil Losses to TBS',
                      'Total Kernel Losses to TBS')
 GROUP BY   site,
            no,
            indicatorname,
            year,
            month
 UNION ALL
   SELECT   site,
            4 no,
            'OER',
            year,
            month,
            CASE
               WHEN SUM (DECODE (indicatorname, 'TBS Olah', tvalue)) =
                       0
               THEN
                  0
               ELSE
                  SUM (DECODE (indicatorname, 'CPO Produksi', tvalue))
                  / SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                  * 100
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN ('TBS Olah', 'CPO Produksi')
 GROUP BY   site, year, month
 UNION ALL
   SELECT   site,
            5 no,
            'KER',
            year,
            month,
            CASE
               WHEN SUM (DECODE (indicatorname, 'TBS Olah', tvalue)) =
                       0
               THEN
                  0
               ELSE
                  SUM (
                     DECODE (indicatorname, 'Kernel Produksi', tvalue)
                  )
                  / SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                  * 100
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN ('TBS Olah', 'Kernel Produksi')
 GROUP BY   site, year, month
 UNION ALL
   SELECT   site,
            10 no,
            'Mill Throughput',
            year,
            month,
            CASE
               WHEN SUM (DECODE (indicatorname, 'Mill Hour', tvalue)) =
                       0
               THEN
                  0
               ELSE
                  SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                  / SUM (DECODE (indicatorname, 'Mill Hour', tvalue))
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN ('TBS Olah', 'Mill Hour')
 GROUP BY   site, year, month
 ---------------------------------------------------annual-------------------------------
 union all
 select site,
            no,
            indicatorname,
            year,
            '13' month,
            CASE
               WHEN indicatorname IN
                          ('TBS Restan', 'CPO Stock', 'Kernel Stock')
               THEN
                  SUM(CASE
                         WHEN tdate =
                                 LAST_DAY(TO_DATE (
                                             '01' || month || year,
                                             'ddmmyyyy'
                                          ))
                         THEN
                            tvalue
                         ELSE
                            0
                      END)
               ELSE
                  ROUND (SUM (tvalue), 2)
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN
                     ('TBS Olah',
                      '',
                      'CPO Produksi',
                      '',
                      '')
 GROUP BY   site,
            no,
            indicatorname,
            year
 UNION ALL
   SELECT   site,
            no,
            indicatorname,
            year,
            '13' month,
            AVG (tvalue) tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN
                     ('Total Oil Losses to TBS',
                      'Total Kernel Losses to TBS')
 GROUP BY   site,
            no,
            indicatorname,
            year
 UNION ALL
   SELECT   site,
            4 no,
            'OER',
            year,
            '13' month,
            CASE
               WHEN SUM (DECODE (indicatorname, 'TBS Olah', tvalue)) =
                       0
               THEN
                  0
               ELSE
                  SUM (DECODE (indicatorname, 'CPO Produksi', tvalue))
                  / SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                  * 100
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN ('TBS Olah', 'CPO Produksi')
 GROUP BY   site, year
 UNION ALL
   SELECT   site,
            5 no,
            'KER',
            year,
            '13' month,
            CASE
               WHEN SUM (DECODE (indicatorname, 'TBS Olah', tvalue)) =
                       0
               THEN
                  0
               ELSE
                  SUM (
                     DECODE (indicatorname, 'Kernel Produksi', tvalue)
                  )
                  / SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                  * 100
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN ('TBS Olah', 'Kernel Produksi')
 GROUP BY   site, year
 UNION ALL
   SELECT   site,
            10 no,
            'Mill Throughput',
            year,
            '13' month,
            CASE
               WHEN SUM (DECODE (indicatorname, 'Mill Hour', tvalue)) =
                       0
               THEN
                  0
               ELSE
                  SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                  / SUM (DECODE (indicatorname, 'Mill Hour', tvalue))
            END
               tvalue
     FROM   rpt_logsheet_detail_consol
    WHERE   year BETWEEN :p_year - 1 AND :p_year
            AND indicatorname IN ('TBS Olah', 'Mill Hour')
 GROUP BY   site, year
 ) group by site, no, indicatorname, year, month
 )
WHERE   site = :p_site
GROUP BY   no, indicatorname, year
ORDER BY   no, year DESC
`;

const fetchData = async function (users, routes, params, callback) {
  binds = {};
  //binds.p_date = "11-04-2022"
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
