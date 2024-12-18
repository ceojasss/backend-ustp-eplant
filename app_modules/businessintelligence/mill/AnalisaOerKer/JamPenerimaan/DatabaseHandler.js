
const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const baseQuery = `SELECT   site,
TO_CHAR (tgljammasuk, 'hh24') jam,
TO_CHAR (tgljammasuk, 'dd') urut,
COUNT ( * ) jml
FROM   wbticket_consol
WHERE   jenismuatan = 'FFB' AND tglmasuk = to_date(:p_date,'dd-mm-yyyy') AND site = :p_site
GROUP BY   site, TO_CHAR (tgljammasuk, 'hh24'), TO_CHAR (tgljammasuk, 'dd')
UNION ALL
SELECT   'USTP' site,
TO_CHAR (tgljammasuk, 'hh24'),
TO_CHAR (tgljammasuk, 'dd') urut,
COUNT ( * )
FROM   wbticket_consol
WHERE   jenismuatan = 'FFB' AND tglmasuk = :p_date AND 'USTP' = :p_site
GROUP BY   TO_CHAR (tgljammasuk, 'hh24'), TO_CHAR (tgljammasuk, 'dd')
ORDER BY   3, 2 `;

const fetchData = async function (users, routes, params, callback) {
  binds = {};
  //binds.p_date = "11-04-2022"
  binds.p_date = !params.p_date ? "" : params.p_date;
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
