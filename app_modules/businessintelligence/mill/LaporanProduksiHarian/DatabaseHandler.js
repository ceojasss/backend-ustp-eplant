
const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

const baseQuer1y = `
SELECT   RANK () OVER (PARTITION BY NULL ORDER BY no) no,
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
         SUM (DECODE (site, 'USTP', hi, 0)) ustp_hi,
         SUM (DECODE (site, 'USTP', bi, 0)) ustp_bi,
         SUM (DECODE (site, 'USTP', ytd, 0)) ustp_ytd,
         SUM (DECODE (site, 'GCM', hi, 0)) gcm_hi,
         SUM (DECODE (site, 'GCM', bi, 0)) gcm_bi,
         SUM (DECODE (site, 'GCM', ytd, 0)) gcm_ytd,
         SUM (DECODE (site, 'SMG', hi, 0)) smg_hi,
         SUM (DECODE (site, 'SMG', bi, 0)) smg_bi,
         SUM (DECODE (site, 'SMG', ytd, 0)) smg_ytd,
         SUM (DECODE (site, 'SJE', hi, 0)) sje_hi,
         SUM (DECODE (site, 'SJE', bi, 0)) sje_bi,
         SUM (DECODE (site, 'SJE', ytd, 0)) sje_ytd,
         SUM (DECODE (site, 'SBE', hi, 0)) sbe_hi,
         SUM (DECODE (site, 'SBE', bi, 0)) sbe_bi,
         SUM (DECODE (site, 'SBE', ytd, 0)) sbe_ytd,
         SUM (DECODE (site, 'SLM', hi, 0)) slm_hi,
         SUM (DECODE (site, 'SLM', bi, 0)) slm_bi,
         SUM (DECODE (site, 'SLM', ytd, 0)) slm_ytd
  FROM   (SELECT   site,
                   no,
                   indicatorname,
                   ROUND (hi, 2) hi,
                   ROUND (bi, 2) bi,
                   ROUND (ytd, 2) ytd
            FROM   (                                --data hari ini non ustp
                    SELECT    site,
                              no,
                              indicatorname,
                              tvalue hi,
                              0 bi,
                              0 ytd
                       FROM   rpt_logsheet_detail_consol
                      WHERE   tdate = to_date(:p_date,'dd-mm-yyyy')
                              AND indicatorname IN
                                       ('TBS Terima',
                                        'TBS Olah',
                                        'TBS Restan',
                                        'OER',
                                        'KER',
                                        'CPO Produksi',
                                        'Kernel Produksi',
                                        'Mill Throughput',
                                        'Total Oil Losses to TBS',
                                        'Total Kernel Losses to TBS',
                                        'Oil Quality - FFA',
                                        'Mill Hour',
                                        'Non Milling Hours - Preventive Maintenance',
                                        'Non Milling Hours - Tunggu Buah',
                                        'Non Milling Hours - Stand By',
                                        'Stagnant - Total',
                                        'Hari Kerja',
                                        'CPO Stock',
                                        'Kernel Stock',
                                        'CPO Despatch',
                                        'Kernel Despatch')
                    UNION ALL
                      --data bulan ini non ustp--
                      SELECT   site,
                               no,
                               indicatorname,
                               0 hi,
                               SUM (tvalue) bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Terima',
                                         'TBS Olah',
                                         '',
                                         'CPO Produksi',
                                         'Kernel Produksi',
                                         'Mill Hour',
                                         'Non Milling Hours - Preventive Maintenance',
                                         'Non Milling Hours - Tunggu Buah',
                                         'Non Milling Hours - Stand By',
                                         'Stagnant - Total',
                                         'Hari Kerja',
                                         'CPO Despatch',
                                         'Kernel Despatch')
                    GROUP BY   site, no, indicatorname
                    UNION ALL
                      SELECT   site,
                               no,
                               indicatorname,
                               0 hi,
                               AVG (tvalue) bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('Total Oil Losses to TBS',
                                         'Total Kernel Losses to TBS',
                                         'Oil Quality - FFA')
                    GROUP BY   site, no, indicatorname
                    UNION ALL
                      SELECT   site,
                               4 no,
                               'OER',
                               0 hi,
                               SUM(DECODE (indicatorname,
                                           'CPO Produksi',
                                           tvalue))
                               / SUM (
                                    DECODE (indicatorname, 'TBS Olah', tvalue)
                                 )
                               * 100
                                  bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Olah', 'CPO Produksi')
                    GROUP BY   site
                    UNION ALL
                      SELECT   site,
                               5 no,
                               'KER',
                               0 hi,
                               SUM(DECODE (indicatorname,
                                           'Kernel Produksi',
                                           tvalue))
                               / SUM (
                                    DECODE (indicatorname, 'TBS Olah', tvalue)
                                 )
                               * 100
                                  bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Olah', 'Kernel Produksi')
                    GROUP BY   site
                    UNION ALL
                      SELECT   site,
                               10 no,
                               'Mill Throughput',
                               0 hi,
                               SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                               / SUM (
                                    DECODE (indicatorname, 'Mill Hour', tvalue)
                                 )
                                  bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN ('TBS Olah', 'Mill Hour')
                    GROUP BY   site
                    UNION ALL
                      --data tahun ini non ustp--
                      SELECT   site,
                               no,
                               indicatorname,
                               0 hi,
                               0 bi,
                               SUM (tvalue) ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Terima',
                                         'TBS Olah',
                                         '',
                                         'CPO Produksi',
                                         'Kernel Produksi',
                                         'Mill Hour',
                                         'Non Milling Hours - Preventive Maintenance',
                                         'Non Milling Hours - Tunggu Buah',
                                         'Non Milling Hours - Stand By',
                                         'Stagnant - Total',
                                         'Hari Kerja',
                                         'CPO Despatch',
                                         'Kernel Despatch')
                    GROUP BY   site, no, indicatorname
                    UNION ALL
                      SELECT   site,
                               no,
                               indicatorname,
                               0 hi,
                               0 bi,
                               AVG (tvalue) ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('Total Oil Losses to TBS',
                                         'Total Kernel Losses to TBS',
                                         'Oil Quality - FFA')
                    GROUP BY   site, no, indicatorname
                    UNION ALL
                      SELECT   site,
                               4 no,
                               'OER',
                               0 hi,
                               0 bi,
                               SUM(DECODE (indicatorname,
                                           'CPO Produksi',
                                           tvalue))
                               / SUM (
                                    DECODE (indicatorname, 'TBS Olah', tvalue)
                                 )
                               * 100
                                  ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Olah', 'CPO Produksi')
                    GROUP BY   site
                    UNION ALL
                      SELECT   site,
                               5 no,
                               'KER',
                               0 hi,
                               0 bi,
                               SUM(DECODE (indicatorname,
                                           'Kernel Produksi',
                                           tvalue))
                               / SUM (
                                    DECODE (indicatorname, 'TBS Olah', tvalue)
                                 )
                               * 100
                                  ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Olah', 'Kernel Produksi')
                    GROUP BY   site
                    UNION ALL
                      SELECT   site,
                               10 no,
                               'Mill Throughput',
                               0 hi,
                               0 bi,
                               SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                               / SUM (
                                    DECODE (indicatorname, 'Mill Hour', tvalue)
                                 )
                                  ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN ('TBS Olah', 'Mill Hour')
                    GROUP BY   site
                    -----------------------data consol ustp----------------------------------------------
                    UNION ALL
                      --data hari ini ustp
                      SELECT   'USTP' site,
                               no,
                               indicatorname,
                               SUM (tvalue) hi,
                               0 bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate = to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Terima',
                                         'TBS Olah',
                                         'TBS Restan',
                                         '',
                                         '',
                                         'CPO Produksi',
                                         'Kernel Produksi',
                                         '',
                                         '',
                                         '',
                                         '',
                                         '',
                                         'Non Milling Hours - Preventive Maintenance',
                                         'Non Milling Hours - Tunggu Buah',
                                         'Non Milling Hours - Stand By',
                                         'Stagnant - Total',
                                         '',
                                         'CPO Stock',
                                         'Kernel Stock',
                                         'CPO Despatch',
                                         'Kernel Despatch')
                    GROUP BY   no, indicatorname
                    UNION ALL
                      SELECT   'USTP' site,
                               no,
                               indicatorname,
                               AVG (tvalue) hi,
                               0 bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate = to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('',
                                         '',
                                         '',
                                         '',
                                         '',
                                         '',
                                         '',
                                         '',
                                         'Total Oil Losses to TBS',
                                         'Total Kernel Losses to TBS',
                                         'Oil Quality - FFA',
                                         'Mill Hour',
                                         'Hari Kerja')
                    GROUP BY   no, indicatorname
                    UNION ALL
                    SELECT   'USTP' site,
                             4 no,
                             'OER',
                             SUM(DECODE (indicatorname,
                                         'CPO Produksi',
                                         tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'TBS Olah', tvalue)
                               )
                             * 100
                                hi,
                             0 bi,
                             0 ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate = to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN
                                      ('TBS Olah', 'CPO Produksi')
                    UNION ALL
                    SELECT   'USTP' site,
                             5 no,
                             'KER',
                             SUM(DECODE (indicatorname,
                                         'Kernel Produksi',
                                         tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'TBS Olah', tvalue)
                               )
                             * 100
                                hi,
                             0 bi,
                             0 ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate = to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN
                                      ('TBS Olah', 'Kernel Produksi')
                    UNION ALL
                    SELECT   'USTP' site,
                             10 no,
                             'Mill Throughput',
                             SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'Mill Hour', tvalue)
                               )
                                hi,
                             0 bi,
                             0 ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate = to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN ('TBS Olah', 'Mill Hour')
                    UNION ALL
                      --data bulan ini ustp--
                      SELECT   'USTP' site,
                               no,
                               indicatorname,
                               0 hi,
                               SUM (tvalue) bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Terima',
                                         'TBS Olah',
                                         '',
                                         'CPO Produksi',
                                         'Kernel Produksi',
                                         'Mill Hour',
                                         'Non Milling Hours - Preventive Maintenance',
                                         'Non Milling Hours - Tunggu Buah',
                                         'Non Milling Hours - Stand By',
                                         'Stagnant - Total',
                                         '',
                                         'CPO Despatch',
                                         'Kernel Despatch')
                    GROUP BY   no, indicatorname
                    UNION ALL
                      SELECT   'USTP' site,
                               no,
                               indicatorname,
                               0 hi,
                               AVG (tvalue) bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('Total Oil Losses to TBS',
                                         'Total Kernel Losses to TBS',
                                         'Oil Quality - FFA')
                    GROUP BY   no, indicatorname
                    UNION ALL
                    SELECT   'USTP' site,
                             4 no,
                             'OER',
                             0 hi,
                             SUM(DECODE (indicatorname,
                                         'CPO Produksi',
                                         tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'TBS Olah', tvalue)
                               )
                             * 100
                                bi,
                             0 ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN
                                      ('TBS Olah', 'CPO Produksi')
                    UNION ALL
                    SELECT   'USTP' site,
                             5 no,
                             'KER',
                             0 hi,
                             SUM(DECODE (indicatorname,
                                         'Kernel Produksi',
                                         tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'TBS Olah', tvalue)
                               )
                             * 100
                                bi,
                             0 ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN
                                      ('TBS Olah', 'Kernel Produksi')
                    UNION ALL
                    SELECT   'USTP' site,
                             10 no,
                             'Mill Throughput',
                             0 hi,
                             SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'Mill Hour', tvalue)
                               )
                                bi,
                             0 ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN ('TBS Olah', 'Mill Hour')
                    UNION ALL
                      --data tahun ini ustp--
                      SELECT   'USTP' site,
                               no,
                               indicatorname,
                               0 hi,
                               0 bi,
                               SUM (tvalue) ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Terima',
                                         'TBS Olah',
                                         '',
                                         'CPO Produksi',
                                         'Kernel Produksi',
                                         'Mill Hour',
                                         'Non Milling Hours - Preventive Maintenance',
                                         'Non Milling Hours - Tunggu Buah',
                                         'Non Milling Hours - Stand By',
                                         'Stagnant - Total',
                                         'Hari Kerja',
                                         'CPO Despatch',
                                         'Kernel Despatch')
                    GROUP BY   no, indicatorname
                    UNION ALL
                      SELECT   'USTP' site,
                               no,
                               indicatorname,
                               0 hi,
                               0 bi,
                               AVG (tvalue) ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('Total Oil Losses to TBS',
                                         'Total Kernel Losses to TBS',
                                         'Oil Quality - FFA')
                    GROUP BY   no, indicatorname
                    UNION ALL
                    SELECT   'USTP' site,
                             4 no,
                             'OER',
                             0 hi,
                             0 bi,
                             SUM(DECODE (indicatorname,
                                         'CPO Produksi',
                                         tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'TBS Olah', tvalue)
                               )
                             * 100
                                ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN
                                      ('TBS Olah', 'CPO Produksi')
                    UNION ALL
                    SELECT   'USTP' site,
                             5 no,
                             'KER',
                             0 hi,
                             0 bi,
                             SUM(DECODE (indicatorname,
                                         'Kernel Produksi',
                                         tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'TBS Olah', tvalue)
                               )
                             * 100
                                ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN
                                      ('TBS Olah', 'Kernel Produksi')
                    UNION ALL
                    SELECT   'USTP' site,
                             10 no,
                             'Mill Throughput',
                             0 hi,
                             0 bi,
                             SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'Mill Hour', tvalue)
                               )
                                ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN ('TBS Olah', 'Mill Hour')))
GROUP BY   no, indicatorname`;

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
         SUM (DECODE (site, 'USTP', hi, 0)) "ustp_hi",
         SUM (DECODE (site, 'USTP', bi, 0)) "ustp_bi",
         SUM (DECODE (site, 'USTP', ytd, 0)) "ustp_ytd",
         SUM (DECODE (site, 'GCM', hi, 0)) "gcm_hi",
         SUM (DECODE (site, 'GCM', bi, 0)) "gcm_bi",
         SUM (DECODE (site, 'GCM', ytd, 0)) "gcm_ytd",
         SUM (DECODE (site, 'SMG', hi, 0)) "smg_hi",
         SUM (DECODE (site, 'SMG', bi, 0)) "smg_bi",
         SUM (DECODE (site, 'SMG', ytd, 0)) "smg_ytd",
         SUM (DECODE (site, 'SJE', hi, 0)) "sje_hi",
         SUM (DECODE (site, 'SJE', bi, 0)) "sje_bi",
         SUM (DECODE (site, 'SJE', ytd, 0)) "sje_ytd",
         SUM (DECODE (site, 'SBE', hi, 0)) "sbe_hi",
         SUM (DECODE (site, 'SBE', bi, 0)) "sbe_bi",
         SUM (DECODE (site, 'SBE', ytd, 0)) "sbe_ytd",
         SUM (DECODE (site, 'SLM', hi, 0)) "slm_hi",
         SUM (DECODE (site, 'SLM', bi, 0)) "slm_bi",
         SUM (DECODE (site, 'SLM', ytd, 0)) "slm_ytd"
  FROM   (SELECT   site,
                   no,
                   indicatorname,
                   ROUND (hi, 2) hi,
                   ROUND (bi, 2) bi,
                   ROUND (ytd, 2) ytd
            FROM   (                                --data hari ini non ustp
                    SELECT    site,
                              no,
                              indicatorname,
                              tvalue hi,
                              0 bi,
                              0 ytd
                       FROM   rpt_logsheet_detail_consol
                      WHERE   tdate = to_date(:p_date,'dd-mm-yyyy')
                              AND indicatorname IN
                                       ('TBS Terima',
                                        'TBS Olah',
                                        'TBS Restan',
                                        'OER',
                                        'KER',
                                        'CPO Produksi',
                                        'Kernel Produksi',
                                        'Mill Throughput',
                                        'Total Oil Losses to TBS',
                                        'Total Kernel Losses to TBS',
                                        'Oil Quality - FFA',
                                        'Mill Hour',
                                        'Non Milling Hours - Preventive Maintenance',
                                        'Non Milling Hours - Tunggu Buah',
                                        'Non Milling Hours - Stand By',
                                        'Stagnant - Total',
                                        'Hari Kerja',
                                        'CPO Stock',
                                        'Kernel Stock',
                                        'CPO Despatch',
                                        'Kernel Despatch')
                    UNION ALL
                      --data bulan ini non ustp--
                      SELECT   site,
                               no,
                               indicatorname,
                               0 hi,
                               SUM (tvalue) bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Terima',
                                         'TBS Olah',
                                         '',
                                         'CPO Produksi',
                                         'Kernel Produksi',
                                         'Mill Hour',
                                         'Non Milling Hours - Preventive Maintenance',
                                         'Non Milling Hours - Tunggu Buah',
                                         'Non Milling Hours - Stand By',
                                         'Stagnant - Total',
                                         'Hari Kerja',
                                         'CPO Despatch',
                                         'Kernel Despatch')
                    GROUP BY   site, no, indicatorname
                    UNION ALL
                      SELECT   site,
                               no,
                               indicatorname,
                               0 hi,
                               AVG (tvalue) bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('Total Oil Losses to TBS',
                                         'Total Kernel Losses to TBS',
                                         'Oil Quality - FFA')
                    GROUP BY   site, no, indicatorname
                    UNION ALL
                      SELECT   site,
                               4 no,
                               'OER',
                               0 hi,
                               SUM(DECODE (indicatorname,
                                           'CPO Produksi',
                                           tvalue))
                               / SUM (
                                    DECODE (indicatorname, 'TBS Olah', tvalue)
                                 )
                               * 100
                                  bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Olah', 'CPO Produksi')
                    GROUP BY   site
                    UNION ALL
                      SELECT   site,
                               5 no,
                               'KER',
                               0 hi,
                               SUM(DECODE (indicatorname,
                                           'Kernel Produksi',
                                           tvalue))
                               / SUM (
                                    DECODE (indicatorname, 'TBS Olah', tvalue)
                                 )
                               * 100
                                  bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Olah', 'Kernel Produksi')
                    GROUP BY   site
                    UNION ALL
                      SELECT   site,
                               10 no,
                               'Mill Throughput',
                               0 hi,
                               SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                               / SUM (
                                    DECODE (indicatorname, 'Mill Hour', tvalue)
                                 )
                                  bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN ('TBS Olah', 'Mill Hour')
                    GROUP BY   site
                    UNION ALL
                      --data tahun ini non ustp--
                      SELECT   site,
                               no,
                               indicatorname,
                               0 hi,
                               0 bi,
                               SUM (tvalue) ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Terima',
                                         'TBS Olah',
                                         '',
                                         'CPO Produksi',
                                         'Kernel Produksi',
                                         'Mill Hour',
                                         'Non Milling Hours - Preventive Maintenance',
                                         'Non Milling Hours - Tunggu Buah',
                                         'Non Milling Hours - Stand By',
                                         'Stagnant - Total',
                                         'Hari Kerja',
                                         'CPO Despatch',
                                         'Kernel Despatch')
                    GROUP BY   site, no, indicatorname
                    UNION ALL
                      SELECT   site,
                               no,
                               indicatorname,
                               0 hi,
                               0 bi,
                               AVG (tvalue) ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('Total Oil Losses to TBS',
                                         'Total Kernel Losses to TBS',
                                         'Oil Quality - FFA')
                    GROUP BY   site, no, indicatorname
                    UNION ALL
                      SELECT   site,
                               4 no,
                               'OER',
                               0 hi,
                               0 bi,
                               SUM(DECODE (indicatorname,
                                           'CPO Produksi',
                                           tvalue))
                               / SUM (
                                    DECODE (indicatorname, 'TBS Olah', tvalue)
                                 )
                               * 100
                                  ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Olah', 'CPO Produksi')
                    GROUP BY   site
                    UNION ALL
                      SELECT   site,
                               5 no,
                               'KER',
                               0 hi,
                               0 bi,
                               SUM(DECODE (indicatorname,
                                           'Kernel Produksi',
                                           tvalue))
                               / SUM (
                                    DECODE (indicatorname, 'TBS Olah', tvalue)
                                 )
                               * 100
                                  ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Olah', 'Kernel Produksi')
                    GROUP BY   site
                    UNION ALL
                      SELECT   site,
                               10 no,
                               'Mill Throughput',
                               0 hi,
                               0 bi,
                               SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                               / SUM (
                                    DECODE (indicatorname, 'Mill Hour', tvalue)
                                 )
                                  ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN ('TBS Olah', 'Mill Hour')
                    GROUP BY   site
                    -----------------------data consol ustp----------------------------------------------
                    UNION ALL
                      --data hari ini ustp
                      SELECT   'USTP' site,
                               no,
                               indicatorname,
                               SUM (tvalue) hi,
                               0 bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate = to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Terima',
                                         'TBS Olah',
                                         'TBS Restan',
                                         '',
                                         '',
                                         'CPO Produksi',
                                         'Kernel Produksi',
                                         '',
                                         '',
                                         '',
                                         '',
                                         '',
                                         'Non Milling Hours - Preventive Maintenance',
                                         'Non Milling Hours - Tunggu Buah',
                                         'Non Milling Hours - Stand By',
                                         'Stagnant - Total',
                                         '',
                                         'CPO Stock',
                                         'Kernel Stock',
                                         'CPO Despatch',
                                         'Kernel Despatch')
                    GROUP BY   no, indicatorname
                    UNION ALL
                      SELECT   'USTP' site,
                               no,
                               indicatorname,
                               AVG (tvalue) hi,
                               0 bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate = to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('',
                                         '',
                                         '',
                                         '',
                                         '',
                                         '',
                                         '',
                                         '',
                                         'Total Oil Losses to TBS',
                                         'Total Kernel Losses to TBS',
                                         'Oil Quality - FFA',
                                         'Mill Hour',
                                         'Hari Kerja')
                    GROUP BY   no, indicatorname
                    UNION ALL
                    SELECT   'USTP' site,
                             4 no,
                             'OER',
                             SUM(DECODE (indicatorname,
                                         'CPO Produksi',
                                         tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'TBS Olah', tvalue)
                               )
                             * 100
                                hi,
                             0 bi,
                             0 ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate = to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN
                                      ('TBS Olah', 'CPO Produksi')
                    UNION ALL
                    SELECT   'USTP' site,
                             5 no,
                             'KER',
                             SUM(DECODE (indicatorname,
                                         'Kernel Produksi',
                                         tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'TBS Olah', tvalue)
                               )
                             * 100
                                hi,
                             0 bi,
                             0 ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate = to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN
                                      ('TBS Olah', 'Kernel Produksi')
                    UNION ALL
                    SELECT   'USTP' site,
                             10 no,
                             'Mill Throughput',
                             SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'Mill Hour', tvalue)
                               )
                                hi,
                             0 bi,
                             0 ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate = to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN ('TBS Olah', 'Mill Hour')
                    UNION ALL
                      --data bulan ini ustp--
                      SELECT   'USTP' site,
                               no,
                               indicatorname,
                               0 hi,
                               SUM (tvalue) bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Terima',
                                         'TBS Olah',
                                         '',
                                         'CPO Produksi',
                                         'Kernel Produksi',
                                         'Mill Hour',
                                         'Non Milling Hours - Preventive Maintenance',
                                         'Non Milling Hours - Tunggu Buah',
                                         'Non Milling Hours - Stand By',
                                         'Stagnant - Total',
                                         '',
                                         'CPO Despatch',
                                         'Kernel Despatch')
                    GROUP BY   no, indicatorname
                    UNION ALL
                      SELECT   'USTP' site,
                               no,
                               indicatorname,
                               0 hi,
                               AVG (tvalue) bi,
                               0 ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('Total Oil Losses to TBS',
                                         'Total Kernel Losses to TBS',
                                         'Oil Quality - FFA')
                    GROUP BY   no, indicatorname
                    UNION ALL
                    SELECT   'USTP' site,
                             4 no,
                             'OER',
                             0 hi,
                             SUM(DECODE (indicatorname,
                                         'CPO Produksi',
                                         tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'TBS Olah', tvalue)
                               )
                             * 100
                                bi,
                             0 ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN
                                      ('TBS Olah', 'CPO Produksi')
                    UNION ALL
                    SELECT   'USTP' site,
                             5 no,
                             'KER',
                             0 hi,
                             SUM(DECODE (indicatorname,
                                         'Kernel Produksi',
                                         tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'TBS Olah', tvalue)
                               )
                             * 100
                                bi,
                             0 ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN
                                      ('TBS Olah', 'Kernel Produksi')
                    UNION ALL
                    SELECT   'USTP' site,
                             10 no,
                             'Mill Throughput',
                             0 hi,
                             SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'Mill Hour', tvalue)
                               )
                                bi,
                             0 ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN ('TBS Olah', 'Mill Hour')
                    UNION ALL
                      --data tahun ini ustp--
                      SELECT   'USTP' site,
                               no,
                               indicatorname,
                               0 hi,
                               0 bi,
                               SUM (tvalue) ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('TBS Terima',
                                         'TBS Olah',
                                         '',
                                         'CPO Produksi',
                                         'Kernel Produksi',
                                         'Mill Hour',
                                         'Non Milling Hours - Preventive Maintenance',
                                         'Non Milling Hours - Tunggu Buah',
                                         'Non Milling Hours - Stand By',
                                         'Stagnant - Total',
                                         'Hari Kerja',
                                         'CPO Despatch',
                                         'Kernel Despatch')
                    GROUP BY   no, indicatorname
                    UNION ALL
                      SELECT   'USTP' site,
                               no,
                               indicatorname,
                               0 hi,
                               0 bi,
                               AVG (tvalue) ytd
                        FROM   rpt_logsheet_detail_consol
                       WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                               AND indicatorname IN
                                        ('Total Oil Losses to TBS',
                                         'Total Kernel Losses to TBS',
                                         'Oil Quality - FFA')
                    GROUP BY   no, indicatorname
                    UNION ALL
                    SELECT   'USTP' site,
                             4 no,
                             'OER',
                             0 hi,
                             0 bi,
                             SUM(DECODE (indicatorname,
                                         'CPO Produksi',
                                         tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'TBS Olah', tvalue)
                               )
                             * 100
                                ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN
                                      ('TBS Olah', 'CPO Produksi')
                    UNION ALL
                    SELECT   'USTP' site,
                             5 no,
                             'KER',
                             0 hi,
                             0 bi,
                             SUM(DECODE (indicatorname,
                                         'Kernel Produksi',
                                         tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'TBS Olah', tvalue)
                               )
                             * 100
                                ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN
                                      ('TBS Olah', 'Kernel Produksi')
                    UNION ALL
                    SELECT   'USTP' site,
                             10 no,
                             'Mill Throughput',
                             0 hi,
                             0 bi,
                             SUM (DECODE (indicatorname, 'TBS Olah', tvalue))
                             / SUM (
                                  DECODE (indicatorname, 'Mill Hour', tvalue)
                               )
                                ytd
                      FROM   rpt_logsheet_detail_consol
                     WHERE   tdate BETWEEN TRUNC (to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
                             AND indicatorname IN ('TBS Olah', 'Mill Hour')))
GROUP BY   no, indicatorname`;

const fetchData = async function (users, routes, params, callback) {
  binds = {};
  binds.p_date = !params.p_date ? "" : params.p_date;

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
