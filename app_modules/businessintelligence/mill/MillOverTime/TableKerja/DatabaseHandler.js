
const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const baseQuery =`
SELECT   '5. Overtime' "kategori",
SUM (CASE WHEN hari = 'SUN' THEN jam ELSE 0 END) "sun",
SUM (CASE WHEN hari = 'SAT' THEN jam ELSE 0 END) "sat",
SUM (CASE
        WHEN hari = 'SUN' THEN 0
        WHEN hari = 'SAT' THEN 0
        ELSE jam
     END)
   "mon_fri",
SUM (jam) "total"
FROM   (SELECT   b.site,
          b.empcode,
          e.empname,
          SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) hari,
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
          SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) hari,
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
UNION ALL
SELECT   DECODE (indicatorname,
          'TBS Terima',
          '1. TBS Terima',
          'Hari Kerja',
          '2. Hari Olah',
          'Mill Hour',
          '3. Mill Hour',
          'TBS Olah',
          '4. TBS Olah')
     kategori,
  SUM(CASE
         WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SUN'
         THEN
            tvalue
         ELSE
            0
      END)
     sun,
  SUM(CASE
         WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SAT'
         THEN
            tvalue
         ELSE
            0
      END)
     sat,
  SUM (CASE
          WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SUN' THEN 0
          WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SAT' THEN 0
          ELSE tvalue
       END)
     mon_fri,
  SUM (tvalue) total
FROM   rpt_logsheet_detail_consol
WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:p_month, 2, 0) || :p_year,
                         'ddmmyyyy')
            AND  LAST_DAY(TO_DATE (
                             '01' || LPAD (:p_month, 2, 0) || :p_year,
                             'ddmmyyyy'
                          ))
  AND site = :p_site
  AND indicatorname IN
           ('TBS Terima', 'Mill Hour', 'TBS Olah', 'Hari Kerja')
GROUP BY   DECODE (indicatorname,
          'TBS Terima',
          '1. TBS Terima',
          'Hari Kerja',
          '2. Hari Olah',
          'Mill Hour',
          '3. Mill Hour',
          'TBS Olah',
          '4. TBS Olah')
UNION ALL
SELECT   DECODE (indicatorname,
          'TBS Terima',
          '1. TBS Terima',
          'Hari Kerja',
          '2. Hari Olah',
          'Mill Hour',
          '3. Mill Hour',
          'TBS Olah',
          '4. TBS Olah')
     kategori,
  SUM(CASE
         WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SUN'
         THEN
            tvalue
         ELSE
            0
      END)
     sun,
  SUM(CASE
         WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SAT'
         THEN
            tvalue
         ELSE
            0
      END)
     sat,
  SUM (CASE
          WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SUN' THEN 0
          WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SAT' THEN 0
          ELSE tvalue
       END)
     mon_fri,
  SUM (tvalue) total
FROM   rpt_logsheet_detail_consol
WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:p_month, 2, 0) || :p_year,
                         'ddmmyyyy')
            AND  LAST_DAY(TO_DATE (
                             '01' || LPAD (:p_month, 2, 0) || :p_year,
                             'ddmmyyyy'
                          ))
  AND 'USTP' = :p_site
  AND indicatorname IN
           ('TBS Terima', 'Mill Hour', 'TBS Olah', 'Hari Olah')
GROUP BY   DECODE (indicatorname,
          'TBS Terima',
          '1. TBS Terima',
          'Hari Kerja',
          '2. Hari Olah',
          'Mill Hour',
          '3. Mill Hour',
          'TBS Olah',
          '4. TBS Olah')
ORDER BY   1`

const fetchData = async function (users, routes, params, callback) {
  binds = {};
  //binds.p_year = "11-04-2022"
  binds.p_month = !params.p_month ? "" : params.p_month;
  binds.p_year = !params.p_year ? "" : params.p_year;
  binds.p_site = !params.p_site ? "" : params.p_site;


  let result;

  try {
    result = await database.siteWithDefExecute(users, routes, baseQuery, binds);
  } catch (error) {
    callback(error, '');
  }
//   console.log('db',result);
  callback('', result);
};

module.exports = {
  fetchData,
};

// const _ = require("lodash");
// const oracledb = require("oracledb");
// const database = require("../../../../../oradb/dbHandler");

// const baseQuery = `
// SELECT   '5. Overtime' "kategori",
// SUM (CASE WHEN hari = 'SUN' THEN jam ELSE 0 END) "sun",
// SUM (CASE WHEN hari = 'SAT' THEN jam ELSE 0 END) "sat",
// SUM (CASE
//         WHEN hari = 'SUN' THEN 0
//         WHEN hari = 'SAT' THEN 0
//         ELSE jam
//      END)
//    "mon_fri",
// SUM (jam) "total"
// FROM   (SELECT   b.site,
//           b.empcode,
//           e.empname,
//           SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) hari,
//           othrs jam,
//           idposition,
//           p.description jabatan,
//           gp.description group_jabatan
//    FROM   gangactivitydetail_consol b,
//           empganghistory_consol g,
//           empmasterepms_consol_2 e,
//           epms_gcm.mas_position p,
//           epms_gcm.group_position gp
//   WHERE       e.empcode = g.empcode
//           AND e.empcode = b.empcode
//           AND e.site = g.site
//           AND e.site = b.site
//           AND g.period = :p_month
//           AND g.year = :p_year
//           AND b.site = :p_site
//           AND idposition = p.code
//           AND code LIKE '4%'
//           AND payrollseq = 3
//           AND p.groupcode = gp.groupcode
//           AND othrs <> 0
//           AND tdate BETWEEN TO_DATE (
//                                   '01'
//                                || LPAD (:p_month, 2, 0)
//                                || :p_year,
//                                'ddmmyyyy'
//                             )
//                         AND  LAST_DAY(TO_DATE (
//                                             '01'
//                                          || LPAD (:p_month, 2, 0)
//                                          || :p_year,
//                                          'ddmmyyyy'
//                                       ))
//  UNION ALL
//  SELECT   'USTP',
//           b.empcode,
//           e.empname,
//           SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) hari,
//           othrs jam,
//           idposition,
//           p.description,
//           gp.description
//    FROM   gangactivitydetail_consol b,
//           empganghistory_consol g,
//           empmasterepms_consol_2 e,
//           epms_gcm.mas_position p,
//           epms_gcm.group_position gp
//   WHERE       e.empcode = g.empcode
//           AND e.empcode = b.empcode
//           AND e.site = g.site
//           AND e.site = b.site
//           AND g.period = :p_month
//           AND g.year = :p_year
//           AND 'USTP' = :p_site
//           AND idposition = p.code
//           AND code LIKE '4%'
//           AND payrollseq = 3
//           AND p.groupcode = gp.groupcode
//           AND othrs <> 0
//           AND tdate BETWEEN TO_DATE (
//                                   '01'
//                                || LPAD (:p_month, 2, 0)
//                                || :p_year,
//                                'ddmmyyyy'
//                             )
//                         AND  LAST_DAY(TO_DATE (
//                                             '01'
//                                          || LPAD (:p_month, 2, 0)
//                                          || :p_year,
//                                          'ddmmyyyy'
//                                       )))
// UNION ALL
// SELECT   DECODE (indicatorname,
//           'TBS Terima',
//           '1. TBS Terima',
//           'Hari Kerja',
//           '2. Hari Olah',
//           'Mill Hour',
//           '3. Mill Hour',
//           'TBS Olah',
//           '4. TBS Olah')
//      kategori,
//   SUM(CASE
//          WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SUN'
//          THEN
//             tvalue
//          ELSE
//             0
//       END)
//      sun,
//   SUM(CASE
//          WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SAT'
//          THEN
//             tvalue
//          ELSE
//             0
//       END)
//      sat,
//   SUM (CASE
//           WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SUN' THEN 0
//           WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SAT' THEN 0
//           ELSE tvalue
//        END)
//      mon_fri,
//   SUM (tvalue) total
// FROM   rpt_logsheet_detail_consol
// WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:p_month, 2, 0) || :p_year,
//                          'ddmmyyyy')
//             AND  LAST_DAY(TO_DATE (
//                              '01' || LPAD (:p_month, 2, 0) || :p_year,
//                              'ddmmyyyy'
//                           ))
//   AND site = :p_site
//   AND indicatorname IN
//            ('TBS Terima', 'Mill Hour', 'TBS Olah', 'Hari Kerja')
// GROUP BY   DECODE (indicatorname,
//           'TBS Terima',
//           '1. TBS Terima',
//           'Hari Kerja',
//           '2. Hari Olah',
//           'Mill Hour',
//           '3. Mill Hour',
//           'TBS Olah',
//           '4. TBS Olah')
// UNION ALL
// SELECT   DECODE (indicatorname,
//           'TBS Terima',
//           '1. TBS Terima',
//           'Hari Kerja',
//           '2. Hari Olah',
//           'Mill Hour',
//           '3. Mill Hour',
//           'TBS Olah',
//           '4. TBS Olah')
//      kategori,
//   SUM(CASE
//          WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SUN'
//          THEN
//             tvalue
//          ELSE
//             0
//       END)
//      sun,
//   SUM(CASE
//          WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SAT'
//          THEN
//             tvalue
//          ELSE
//             0
//       END)
//      sat,
//   SUM (CASE
//           WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SUN' THEN 0
//           WHEN SUBSTR (TO_CHAR (tdate, 'DAY'), 1, 3) = 'SAT' THEN 0
//           ELSE tvalue
//        END)
//      mon_fri,
//   SUM (tvalue) total
// FROM   rpt_logsheet_detail_consol
// WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:p_month, 2, 0) || :p_year,
//                          'ddmmyyyy')
//             AND  LAST_DAY(TO_DATE (
//                              '01' || LPAD (:p_month, 2, 0) || :p_year,
//                              'ddmmyyyy'
//                           ))
//   AND 'USTP' = :p_site
//   AND indicatorname IN
//            ('TBS Terima', 'Mill Hour', 'TBS Olah', 'Hari Olah')
// GROUP BY   DECODE (indicatorname,
//           'TBS Terima',
//           '1. TBS Terima',
//           'Hari Kerja',
//           '2. Hari Olah',
//           'Mill Hour',
//           '3. Mill Hour',
//           'TBS Olah',
//           '4. TBS Olah')
// ORDER BY   1
// `;

// const fetchData = async function (users, routes, params) {
//   const binds = {
//     p_month: params.p_month || "",
//     p_year: params.p_year || "",
//     p_site: params.p_site || ""
//   };

//   try {
//     const result = await database.siteWithDefExecute(users, routes, baseQuery, binds);
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

// module.exports = {
//   fetchData
// };
