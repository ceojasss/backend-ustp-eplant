
const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const baseQuery = ` SELECT   empname, SUM (jam) jam
FROM   (SELECT   b.site,
                 b.empcode,
                 e.empname,
                 othrs jam,
                 idposition,
                 p.description jabatan,
                 gp.description group_jabatan
          FROM   gangactivitydetail_consol b,
                 empganghistory_consol g,
                 empmasterepms_consol_2 e,
                 epms_gcm.mas_position p,
                 epms_gcm.group_position gp
         WHERE       e.empcode = g.empcode
                 AND e.empcode = b.empcode
                 AND e.site = g.site
                 AND e.site = b.site
                 AND g.period = :p_month
                 AND g.year = :p_year
                 AND b.site = :p_site
                 AND idposition = p.code
                 AND p.groupcode = NVL (:p_group, p.groupcode)
                 AND code LIKE '4%'
                 AND payrollseq = 3
                 AND p.groupcode = gp.groupcode
                 AND othrs <> 0
                 AND tdate BETWEEN TO_DATE (
                                         '01'
                                      || LPAD (:p_month, 2, 0)
                                      || :p_year,
                                      'ddmmyyyy'
                                   )
                               AND  LAST_DAY(TO_DATE (
                                                   '01'
                                                || LPAD (:p_month, 2, 0)
                                                || :p_year,
                                                'ddmmyyyy'
                                             ))
        UNION ALL
        SELECT   'USTP',
                 b.empcode,
                 e.empname,
                 othrs jam,
                 idposition,
                 p.description,
                 gp.description
          FROM   gangactivitydetail_consol b,
                 empganghistory_consol g,
                 empmasterepms_consol_2 e,
                 epms_gcm.mas_position p,
                 epms_gcm.group_position gp
         WHERE       e.empcode = g.empcode
                 AND e.empcode = b.empcode
                 AND e.site = g.site
                 AND e.site = b.site
                 AND g.period = :p_month
                 AND g.year = :p_year
                 AND 'USTP' = :p_site
                 AND idposition = p.code
                 AND p.groupcode = NVL (:p_group, p.groupcode)
                 AND code LIKE '4%'
                 AND payrollseq = 3
                 AND p.groupcode = gp.groupcode
                 AND othrs <> 0
                 AND tdate BETWEEN TO_DATE (
                                         '01'
                                      || LPAD (:p_month, 2, 0)
                                      || :p_year,
                                      'ddmmyyyy'
                                   )
                               AND  LAST_DAY(TO_DATE (
                                                   '01'
                                                || LPAD (:p_month, 2, 0)
                                                || :p_year,
                                                'ddmmyyyy'
                                             )))
GROUP BY   empname
ORDER BY   2 DESC`;

const fetchData = async function (users, routes, params, callback) {
  binds = {};
  //binds.p_year = "11-04-2022"
  binds.p_month = !params.p_month ? "" : params.p_month;
  binds.p_year = !params.p_year ? "" : params.p_year;
  binds.p_site = !params.p_site ? "" : params.p_site;
  binds.p_group = !params.p_group ? "" : params.p_group;


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
