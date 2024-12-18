const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

const baseQ2uery = ` SELECT    to_char(to_date('01'||to_char(month)||:p_year,'ddmmyyyy'),'Month') month_name,  
SUM (DECODE (indicatorname, 'TBS Terima', gcm+smg+sje+sbe+slm, 0)) tbs_terima_ustp,
SUM (DECODE (indicatorname, 'TBS Terima', gcm, 0)) tbs_terima_gcm,
SUM (DECODE (indicatorname, 'TBS Terima', smg, 0)) tbs_terima_smg,
SUM (DECODE (indicatorname, 'TBS Terima', sje, 0)) tbs_terima_sje,
SUM (DECODE (indicatorname, 'TBS Terima', sbe, 0)) tbs_terima_sbe,
SUM (DECODE (indicatorname, 'TBS Terima', slm, 0)) tbs_terima_slm,
SUM (DECODE (indicatorname, 'TBS Olah', gcm+smg+sje+sbe+slm, 0)) tbs_olah_ustp,
SUM (DECODE (indicatorname, 'TBS Olah', gcm, 0)) tbs_olah_gcm,
SUM (DECODE (indicatorname, 'TBS Olah', smg, 0)) tbs_olah_smg,
SUM (DECODE (indicatorname, 'TBS Olah', sje, 0)) tbs_olah_sje,
SUM (DECODE (indicatorname, 'TBS Olah', sbe, 0)) tbs_olah_sbe,
SUM (DECODE (indicatorname, 'TBS Olah', slm, 0)) tbs_olah_slm,
SUM (DECODE (indicatorname, 'TBS Restan', gcm+smg+sje+sbe+slm, 0)) tbs_restan_ustp,
SUM (DECODE (indicatorname, 'TBS Restan', gcm, 0)) tbs_restan_gcm,
SUM (DECODE (indicatorname, 'TBS Restan', smg, 0)) tbs_restan_smg,
SUM (DECODE (indicatorname, 'TBS Restan', sje, 0)) tbs_restan_sje,
SUM (DECODE (indicatorname, 'TBS Restan', sbe, 0)) tbs_restan_sbe,
SUM (DECODE (indicatorname, 'TBS Restan', slm, 0)) tbs_restan_slm,
round(decode(SUM (DECODE (indicatorname, 'TBS Olah', gcm+smg+sje+sbe+slm, 0)) ,0,0,
SUM (DECODE (indicatorname, 'CPO Produksi', gcm+smg+sje+sbe+slm, 0))
/SUM (DECODE (indicatorname, 'TBS Olah', gcm+smg+sje+sbe+slm, 0)))*100,2) OER_ustp,
SUM (DECODE (indicatorname, 'OER', gcm, 0)) OER_gcm,
SUM (DECODE (indicatorname, 'OER', smg, 0)) OER_smg,
SUM (DECODE (indicatorname, 'OER', sje, 0)) OER_sje,
SUM (DECODE (indicatorname, 'OER', sbe, 0)) OER_sbe,
SUM (DECODE (indicatorname, 'OER', slm, 0)) OER_slm,
round(decode(SUM (DECODE (indicatorname, 'TBS Olah', gcm+smg+sje+sbe+slm, 0)) ,0,0,
SUM (DECODE (indicatorname, 'Kernel Produksi', gcm+smg+sje+sbe+slm, 0))
/SUM (DECODE (indicatorname, 'TBS Olah', gcm+smg+sje+sbe+slm, 0)))*100,2) KER_ustp,
SUM (DECODE (indicatorname, 'KER', gcm, 0)) KER_gcm,
SUM (DECODE (indicatorname, 'KER', smg, 0)) KER_smg,
SUM (DECODE (indicatorname, 'KER', sje, 0)) KER_sje,
SUM (DECODE (indicatorname, 'KER', sbe, 0)) KER_sbe,
SUM (DECODE (indicatorname, 'KER', slm, 0)) KER_slm,
SUM (DECODE (indicatorname, 'CPO Produksi', gcm+smg+sje+sbe+slm, 0)) cpo_ustp,
SUM (DECODE (indicatorname, 'CPO Produksi', gcm, 0)) cpo_gcm,
SUM (DECODE (indicatorname, 'CPO Produksi', smg, 0)) cpo_smg,
SUM (DECODE (indicatorname, 'CPO Produksi', sje, 0)) cpo_sje,
SUM (DECODE (indicatorname, 'CPO Produksi', sbe, 0)) cpo_sbe,
SUM (DECODE (indicatorname, 'CPO Produksi', slm, 0)) cpo_slm,
SUM (DECODE (indicatorname, 'Kernel Produksi', gcm+smg+sje+sbe+slm, 0)) pk_ustp,
SUM (DECODE (indicatorname, 'Kernel Produksi', gcm, 0)) pk_gcm,
SUM (DECODE (indicatorname, 'Kernel Produksi', smg, 0)) pk_smg,
SUM (DECODE (indicatorname, 'Kernel Produksi', sje, 0)) pk_sje,
SUM (DECODE (indicatorname, 'Kernel Produksi', sbe, 0)) pk_sbe,
SUM (DECODE (indicatorname, 'Kernel Produksi', slm, 0)) pk_slm,          
round(decode(SUM (DECODE (indicatorname, 'Mill Hour', gcm+smg+sje+sbe+slm, 0)) ,0,0,
SUM (DECODE (indicatorname, 'TBS Olah', gcm+smg+sje+sbe+slm, 0))
/SUM (DECODE (indicatorname, 'Mill Hour', gcm+smg+sje+sbe+slm, 0))),2) Throughput_ustp,
SUM (DECODE (indicatorname, 'Mill Throughput', gcm, 0)) Throughput_gcm,
SUM (DECODE (indicatorname, 'Mill Throughput', smg, 0)) Throughput_smg,
SUM (DECODE (indicatorname, 'Mill Throughput', sje, 0)) Throughput_sje,
SUM (DECODE (indicatorname, 'Mill Throughput', sbe, 0)) Throughput_sbe,
SUM (DECODE (indicatorname, 'Mill Throughput', slm, 0)) Throughput_slm,
SUM (DECODE (indicatorname, 'Mill Hour', ustp, 0)) millhour_ustp,
SUM (DECODE (indicatorname, 'Mill Hour', gcm, 0)) millhour_gcm,
SUM (DECODE (indicatorname, 'Mill Hour', smg, 0)) millhour_smg,
SUM (DECODE (indicatorname, 'Mill Hour', sje, 0)) millhour_sje,
SUM (DECODE (indicatorname, 'Mill Hour', sbe, 0)) millhour_sbe,
SUM (DECODE (indicatorname, 'Mill Hour', slm, 0)) millhour_slm,
SUM (DECODE (indicatorname, 'Oil Quality - FFA', ustp, 0)) ffa_ustp,
SUM (DECODE (indicatorname, 'Oil Quality - FFA', gcm, 0)) ffa_gcm,
SUM (DECODE (indicatorname, 'Oil Quality - FFA', smg, 0)) ffa_smg,
SUM (DECODE (indicatorname, 'Oil Quality - FFA', sje, 0)) ffa_sje,
SUM (DECODE (indicatorname, 'Oil Quality - FFA', sbe, 0)) ffa_sbe,
SUM (DECODE (indicatorname, 'Oil Quality - FFA', slm, 0)) ffa_slm
FROM   (
select no, indicatorname, year, month, 
 decode(site,'USTP',ROUND (tvalue, 2),0) ustp,
          decode(site,'GCM',ROUND (tvalue, 2),0) gcm,
          decode(site,'SMG',ROUND (tvalue, 2),0) smg,
          decode(site,'SJE',ROUND (tvalue, 2),0) sje,
          decode(site,'SBE',ROUND (tvalue, 2),0) sbe,
          decode(site,'SLM',ROUND (tvalue, 2),0) slm
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
    WHERE   year BETWEEN :p_year  AND :p_year
            AND indicatorname IN
                     ('TBS Terima',
                      'TBS Olah',
                      'TBS Restan',
                      'CPO Produksi',
                      'CPO Stock',
                      'Kernel Stock',
                      'Kernel Produksi')
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
    WHERE   year BETWEEN :p_year  AND :p_year
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
    WHERE   year BETWEEN :p_year  AND :p_year
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
    WHERE   year BETWEEN :p_year  AND :p_year
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
    WHERE   year BETWEEN :p_year  AND :p_year
            AND indicatorname IN ('TBS Olah', 'Mill Hour')
 GROUP BY   site, year, month
 ) --group by site, no, indicatorname, year, month
 )
GROUP BY   year, month
ORDER BY   year, month `;

const baseQuery=`
SELECT    to_char(to_date('01'||to_char(month)||:p_year,'ddmmyyyy'),'Month') "month_name",  
SUM (DECODE (indicatorname, 'TBS Terima', gcm+smg+sje+sbe+slm, 0)) "tbs_terima_ustp",
SUM (DECODE (indicatorname, 'TBS Terima', gcm, 0)) "tbs_terima_gcm",
SUM (DECODE (indicatorname, 'TBS Terima', smg, 0)) "tbs_terima_smg",
SUM (DECODE (indicatorname, 'TBS Terima', sje, 0)) "tbs_terima_sje",
SUM (DECODE (indicatorname, 'TBS Terima', sbe, 0)) "tbs_terima_sbe",
SUM (DECODE (indicatorname, 'TBS Terima', slm, 0)) "tbs_terima_slm",
SUM (DECODE (indicatorname, 'TBS Olah', gcm+smg+sje+sbe+slm, 0)) "tbs_olah_ustp",
SUM (DECODE (indicatorname, 'TBS Olah', gcm, 0)) "tbs_olah_gcm",
SUM (DECODE (indicatorname, 'TBS Olah', smg, 0)) "tbs_olah_smg",
SUM (DECODE (indicatorname, 'TBS Olah', sje, 0)) "tbs_olah_sje",
SUM (DECODE (indicatorname, 'TBS Olah', sbe, 0)) "tbs_olah_sbe",
SUM (DECODE (indicatorname, 'TBS Olah', slm, 0)) "tbs_olah_slm",
SUM (DECODE (indicatorname, 'TBS Restan', gcm+smg+sje+sbe+slm, 0)) "tbs_restan_ustp",
SUM (DECODE (indicatorname, 'TBS Restan', gcm, 0)) "tbs_restan_gcm",
SUM (DECODE (indicatorname, 'TBS Restan', smg, 0)) "tbs_restan_smg",
SUM (DECODE (indicatorname, 'TBS Restan', sje, 0)) "tbs_restan_sje",
SUM (DECODE (indicatorname, 'TBS Restan', sbe, 0)) "tbs_restan_sbe",
SUM (DECODE (indicatorname, 'TBS Restan', slm, 0)) "tbs_restan_slm",
round(decode(SUM (DECODE (indicatorname, 'TBS Olah', gcm+smg+sje+sbe+slm, 0)) ,0,0,
SUM (DECODE (indicatorname, 'CPO Produksi', gcm+smg+sje+sbe+slm, 0))
/SUM (DECODE (indicatorname, 'TBS Olah', gcm+smg+sje+sbe+slm, 0)))*100,2) "oer_ustp",
SUM (DECODE (indicatorname, 'OER', gcm, 0)) "oer_gcm",
SUM (DECODE (indicatorname, 'OER', smg, 0)) "oer_smg",
SUM (DECODE (indicatorname, 'OER', sje, 0)) "oer_sje",
SUM (DECODE (indicatorname, 'OER', sbe, 0)) "oer_sbe",
SUM (DECODE (indicatorname, 'OER', slm, 0)) "oer_slm",
round(decode(SUM (DECODE (indicatorname, 'TBS Olah', gcm+smg+sje+sbe+slm, 0)) ,0,0,
SUM (DECODE (indicatorname, 'Kernel Produksi', gcm+smg+sje+sbe+slm, 0))
/SUM (DECODE (indicatorname, 'TBS Olah', gcm+smg+sje+sbe+slm, 0)))*100,2) "ker_ustp",
SUM (DECODE (indicatorname, 'KER', gcm, 0)) "ker_gcm",
SUM (DECODE (indicatorname, 'KER', smg, 0)) "ker_smg",
SUM (DECODE (indicatorname, 'KER', sje, 0)) "ker_sje",
SUM (DECODE (indicatorname, 'KER', sbe, 0)) "ker_sbe",
SUM (DECODE (indicatorname, 'KER', slm, 0)) "ker_slm",
SUM (DECODE (indicatorname, 'CPO Produksi', gcm+smg+sje+sbe+slm, 0)) "cpo_ustp",
SUM (DECODE (indicatorname, 'CPO Produksi', gcm, 0)) "cpo_gcm",
SUM (DECODE (indicatorname, 'CPO Produksi', smg, 0)) "cpo_smg",
SUM (DECODE (indicatorname, 'CPO Produksi', sje, 0)) "cpo_sje",
SUM (DECODE (indicatorname, 'CPO Produksi', sbe, 0)) "cpo_sbe",
SUM (DECODE (indicatorname, 'CPO Produksi', slm, 0)) "cpo_slm",
SUM (DECODE (indicatorname, 'Kernel Produksi', gcm+smg+sje+sbe+slm, 0)) "pk_ustp",
SUM (DECODE (indicatorname, 'Kernel Produksi', gcm, 0)) "pk_gcm",
SUM (DECODE (indicatorname, 'Kernel Produksi', smg, 0)) "pk_smg",
SUM (DECODE (indicatorname, 'Kernel Produksi', sje, 0)) "pk_sje",
SUM (DECODE (indicatorname, 'Kernel Produksi', sbe, 0)) "pk_sbe",
SUM (DECODE (indicatorname, 'Kernel Produksi', slm, 0)) "pk_slm",          
round(decode(SUM (DECODE (indicatorname, 'Mill Hour', gcm+smg+sje+sbe+slm, 0)) ,0,0,
SUM (DECODE (indicatorname, 'TBS Olah', gcm+smg+sje+sbe+slm, 0))
/SUM (DECODE (indicatorname, 'Mill Hour', gcm+smg+sje+sbe+slm, 0))),2) "throughput_ustp",
SUM (DECODE (indicatorname, 'Mill Throughput', gcm, 0)) "throughput_gcm",
SUM (DECODE (indicatorname, 'Mill Throughput', smg, 0)) "throughput_smg",
SUM (DECODE (indicatorname, 'Mill Throughput', sje, 0)) "throughput_sje",
SUM (DECODE (indicatorname, 'Mill Throughput', sbe, 0)) "throughput_sbe",
SUM (DECODE (indicatorname, 'Mill Throughput', slm, 0)) "throughput_slm",
SUM (DECODE (indicatorname, 'Mill Hour', ustp, 0)) "millhour_ustp",
SUM (DECODE (indicatorname, 'Mill Hour', gcm, 0)) "millhour_gcm",
SUM (DECODE (indicatorname, 'Mill Hour', smg, 0)) "millhour_smg",
SUM (DECODE (indicatorname, 'Mill Hour', sje, 0)) "millhour_sje",
SUM (DECODE (indicatorname, 'Mill Hour', sbe, 0)) "millhour_sbe",
SUM (DECODE (indicatorname, 'Mill Hour', slm, 0)) "millhour_slm",
SUM (DECODE (indicatorname, 'Oil Quality - FFA', ustp, 0)) "ffa_ustp",
SUM (DECODE (indicatorname, 'Oil Quality - FFA', gcm, 0)) "ffa_gcm",
SUM (DECODE (indicatorname, 'Oil Quality - FFA', smg, 0)) "ffa_smg",
SUM (DECODE (indicatorname, 'Oil Quality - FFA', sje, 0)) "ffa_sje",
SUM (DECODE (indicatorname, 'Oil Quality - FFA', sbe, 0)) "ffa_sbe",
SUM (DECODE (indicatorname, 'Oil Quality - FFA', slm, 0)) "ffa_slm"
FROM   (
select no, indicatorname, year, month, 
 decode(site,'USTP',ROUND (tvalue, 2),0) ustp,
          decode(site,'GCM',ROUND (tvalue, 2),0) gcm,
          decode(site,'SMG',ROUND (tvalue, 2),0) smg,
          decode(site,'SJE',ROUND (tvalue, 2),0) sje,
          decode(site,'SBE',ROUND (tvalue, 2),0) sbe,
          decode(site,'SLM',ROUND (tvalue, 2),0) slm
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
    WHERE   year BETWEEN :p_year  AND :p_year
            AND indicatorname IN
                     ('TBS Terima',
                      'TBS Olah',
                      'TBS Restan',
                      'CPO Produksi',
                      'CPO Stock',
                      'Kernel Stock',
                      'Kernel Produksi')
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
    WHERE   year BETWEEN :p_year  AND :p_year
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
    WHERE   year BETWEEN :p_year  AND :p_year
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
    WHERE   year BETWEEN :p_year  AND :p_year
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
    WHERE   year BETWEEN :p_year  AND :p_year
            AND indicatorname IN ('TBS Olah', 'Mill Hour')
 GROUP BY   site, year, month
 ) --group by site, no, indicatorname, year, month
 )
GROUP BY   year, month
ORDER BY   year, month
`


const fetchData = async function (users, routes, params, callback) {

  binds = {};
  //binds.p_date = "11-04-2022"
  binds.p_year = (!params.p_year ? '' : params.p_year)
 
  let result

  try {
      result = await database.siteWithDefExecute(users, routes, baseQuery, binds)


  } catch (error) {
      callback(error, '')
  }



  callback('', result)
}



module.exports = {
  fetchData
};
