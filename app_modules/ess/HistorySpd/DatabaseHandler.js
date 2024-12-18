const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../oradb/dbHandler");


const baseQuery = `SELECT a.id_spd                                   "id_spd",
a.ROWID                                    "rowid",
a.no_spd                                   "no_spd",
a.empcode                                  "empcode",
a.empname                                  "empname",
a.div_id                                   "div_id",
a.jab_id                                   "jab_id",
a.destination                              "destination",
a.costing                                  "costing",
a.date_dep                                 "date_dep",
a.date_arr                                 "date_arr",
a.objective                                "objective",
a.approvedby1                              "approvedby1",
TO_CHAR (a.approvedate1, 'dd-mm-yyyy')     "approvedate1",
a.status_pd                                "status_pd",
a.kasbon                                   "kasbon",
a.kasbon_amt                               "kasbon_amt",
a.kategori                                 "kategori",
a.site                                     "site",
a.origin                                   "origin",
a.inputby                                  "inputby",
TO_CHAR (a.inputdate, 'dd-mm-yyyy')        "inputdate",
a.updateby                                 "updateby",
TO_CHAR (a.updatedate, 'dd-mm-yyyy')       "updatedate",
TO_CHAR (b.tdate, 'dd-mm-yyyy')            "tdate",
b.remarks                                  "remarks"
FROM hr_spd_header a LEFT JOIN hr_spd_detail b ON a.no_spd = b.no_spd
WHERE a.no_spd = :no_spd AND a.empcode = :empcode and (a.empcode LIKE '%' || :search ||'%' OR a.empname LIKE '%' || :search ||'%')
ORDER BY b.tdate ASC
`;

const fetchDataHeader = async function (users, params, routes, callback) {
  binds = {};

  binds.limitsize = !params.size ? 0 : params.size;
  binds.page = !params.page ? 1 : params.page;
  binds.search = !params.search ? "" : params.search;
  binds.no_spd = (!params.no_spd ? '' : params.no_spd)
  binds.empcode = users.empcode
  // console.log(binds);
  let result;

  try {
    result = await database.siteLimitExecute(users, routes, baseQuery, binds);

    // console.log(result)
  } catch (error) {
    callback(error, "");
  }

  callback("", result);
};

module.exports = {
  fetchDataHeader
};
