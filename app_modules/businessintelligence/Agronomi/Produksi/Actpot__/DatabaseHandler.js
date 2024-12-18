const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");
const connection = require('../../../../../mysql/dbCredentials');



const baseQuery = `SELECT   x.site "site",
y.seq "seq",
x.divisioncode "divisioncode",
SUM (DECODE (month, :p_month, ha, 0)) "ha",
SUM (act) / 1000 "act",
(SUM (pot))
* SUM(DECODE (month, :p_month, sph, 0)
      * DECODE (month, :p_month, ha, 0))
/ (SUM (DECODE (month, :p_month, ha, 0)) * 136)
/ 1000
   "pot",
ROUND (
   DECODE (
      SUM (bgt),
      0,
      0,
      SUM (act)
      / ( (SUM (pot))
         * SUM(DECODE (month, :p_month, sph, 0)
               * DECODE (month, :p_month, ha, 0))
         / (SUM (DECODE (month, :p_month, ha, 0)) * 136))
      * 100
   ),
   2
)
   "ach",
merah / SUM (DECODE (month, :p_month, ha, 0)) * 100 "merah",
kuning / SUM (DECODE (month, :p_month, ha, 0)) * 100 "kuning",
hijau / SUM (DECODE (month, :p_month, ha, 0)) * 100 "hijau",
merah + kuning + hijau - SUM (DECODE (month, :p_month, ha, 0))
   "control_warna"
FROM   view_produksi_tbs_consol x,
division y,
(  SELECT   site,
            divisioncode,
            SUM (CASE WHEN pct >= 100 THEN ha ELSE 0 END) hijau,
            SUM (
               CASE WHEN pct BETWEEN 90 AND 99.99 THEN ha ELSE 0 END
            )
               kuning,
            SUM (CASE WHEN pct < 90 THEN ha ELSE 0 END) merah
     FROM   (                                  
     SELECT   site,
                        x.divisioncode,
                        fieldcode,
                        SUM (DECODE (month, :p_month, ha, 0)) ha,
                        SUM (act) / 1000 act,
                        SUM (pot) / 1000 pot,
                        (SUM (pot))
                        * DECODE (
                             SUM (DECODE (month, :p_month, ha, 0)),
                             0,
                             0,
                             SUM(DECODE (month, :p_month, sph, 0)
                                 * DECODE (month, :p_month, ha, 0))
                             / (SUM (DECODE (month, :p_month, ha, 0))
                                * 136)
                          )
                        / 1000
                           potriil,
                        round(CASE
                           WHEN SUM (DECODE (month, :p_month, ha, 0)) =
                                   0
                                OR SUM (pot) = 0
                           THEN
                              0
                           ELSE
                              SUM (act) / (SUM (pot))
                              * SUM(DECODE (month, :p_month, sph, 0)
                                    * DECODE (month, :p_month, ha, 0))
                              / (SUM (DECODE (month, :p_month, ha, 0))
                                 * 136)
                              * 100
                        END,2)
                           pct
                 FROM   view_produksi_tbs_consol x
                WHERE       year = :p_year
                        AND month <= :p_month
                        AND NVL (ha, 0) <> 0
                        AND site = :p_site
                        AND intiplasma =
                              DECODE (
                                 :p_intiplasma,
                                 NULL,
                                 intiplasma,
                                 DECODE (:p_intiplasma,
                                         'INTI', '1',
                                         '0')
                              )
             GROUP BY   site, x.divisioncode, fieldcode
             )
 GROUP BY   site, divisioncode) z
WHERE       year = :p_year
AND month <= :p_month
AND ha <> 0
AND x.site = :p_site
AND x.site = z.site
AND x.divisioncode = z.divisioncode
AND x.divisioncode = y.divisioncode
AND intiplasma =
      DECODE (:p_intiplasma,
              NULL, intiplasma,
              DECODE (:p_intiplasma, 'INTI', '1', '0'))
GROUP BY   x.site,
x.divisioncode,
seq,
merah,
kuning,
hijau
ORDER BY   seq
`;

// const mapQuery = `SELECT
//                      X.KOORDINAT as kordinat, 
//                      X.TYPE as tipe, 
//                      X.BLOK as blok, 
//                      X.KEBUN as kebun, 
//                      X.AFDELING as afdeling, 
//                      X.properties as properties, 
//                      X.SITE as site, 
//                      X.MAPS as maps, 
//                      X.STREET as street, 
//                      X.SLENGTH as slength, 
//                      Y.WARNA as warna
//                   FROM
//                      MST_ALL_MAP X
//                   LEFT JOIN
//                      PRODUKSI_BLOK Y
//                   ON
//                      X.BLOK = Y.BLOCKID
//                   WHERE
//                      X.SITE = :p_site
//                      AND Y.SITE = :p_site
//                      AND X.BLOK = Y.BLOCKID`;


const mapQuery = `SELECT
                     X.KOORDINAT AS kordinat,
                     X.TYPE AS tipe,
                     X.BLOK AS blok,
                     X.KEBUN AS kebun,
                     X.AFDELING AS afdeling,
                     X.properties AS properties,
                     X.SITE AS site,
                     X.MAPS AS maps,
                     X.STREET AS street,
                     X.SLENGTH AS slength,
                     Y.WARNA AS warna
                  FROM
                     MST_ALL_MAP X
                  LEFT JOIN
                     PRODUKSI_BLOK Y
                  ON
                     X.BLOK = Y.BLOCKID
                  WHERE
                     X.SITE = ? 
                     AND 
                     Y.SITE = ? 
                     AND 
                     X.BLOK = Y.BLOCKID`;
             

const fetchData = async function (users, routes, params, callback) {

   binds = {};
   //binds.p_date = "11-04-2022"
   binds.p_month = (!params.p_month ? '' : params.p_month)
   binds.p_year = (!params.p_year ? '' : params.p_year)
   binds.p_site = (!params.p_site ? '' : params.p_site)
   binds.p_intiplasma = (!params.p_intiplasma ? '' : params.p_intiplasma)


   let result

   try {
      result = await database.siteWithDefExecute(users, routes, baseQuery, binds)


   } catch (error) {
      callback(error, '')
   }



   callback('', result)
}


const fetchMap = async function (users, routes, params) {
   console.log('check params', params);
   const binds = {};
   binds.p_site = (!params.p_site ? '' : params.p_site);
   let xSite = binds.p_site;
   let ySite = binds.p_site;
   
   let filter = [xSite, ySite];

   console.log('check binds', binds);

   try {
      const sql = mapQuery;

      const rows = await new Promise((resolve, reject) => {
         connection.query(sql, filter, (error, rows) => {
            if (error) {
               reject(error);
               console.log('error disini', error);
            } else {
               resolve(rows);
               // console.log('tidak error', rows);
            }
         });
      });

      return rows;
   } catch (error) {
      throw error;
   }
};


// const fetchMap = async function (users, routes, params, callback) {
//    console.log('check params', params);
//    const binds = {};
//    binds.p_site = (!params.p_site ? '' : params.p_site);
//    let xSite = binds.p_site;
//    let ySite = binds.p_site;
   
//    let filter = [xSite, ySite];

//    console.log('check binds', binds);

//    try {
//       const sql = mapQuery;

//       const rows = await new Promise((resolve, reject) => {
//          connection.query(sql, filter, (error, rows) => {
//             if (error) {
//                reject(error);
//                console.log('error disini', error);
//             } else {
//                resolve(rows);
//                // console.log('tidak error', rows);
//             }
//          });
//       });

//       callback('', rows)
//    } catch (error) {
//       callback(error, '')
//    }
// };

// const fetchMap = async function (users, routes, params, callback) {
//    const binds = {};
//    binds.p_site = (!params.p_site ? '' : params.p_site);

//    try {
//       const sql = mapQuery;
//       console.log(sql);

//       const rows = await new Promise((resolve, reject) => {
//          connection.query(sql, (error, rows) => {
//             if (error) {
//                reject(error);
//             } else {
//                resolve(rows);
//             }
//          });
//       });

//       callback('', rows);
//    } catch (error) {
//       callback(error, '');
//    }
// }

// async function fetchMap(user, baseUrl, data) {
//    return new Promise((resolve, reject) => {
//      const sql = mapQuery;
//      console.log(sql);

//      connection.query(sql, (error, rows) => {
//        if (error) {
//          reject(error);
//        } else {
//          resolve(rows);
//        }
//      });
//    });
//  }








module.exports = {
   fetchData, fetchMap
};

