const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

/**
 * ! change query table header
 */
const baseQuery = `select to_char(TDATE, 'dd-mm-yyyy') "tdate", x.GANGCODE "gangcode", x.MANDORE1CODE "mandore1code", get_empname(x.MANDORE1CODE) "mandore1name", 
x.KERANICODE "keranicode", get_empname(x.KERANICODE) "keraniname", x.MANDORECODE "mandorecode", get_empname(x.MANDORECODE) "mandorename", decode(VALID,1,'APPROVED',NULL) "valid",  REMARKS "remarks" , x.INPUTBY "inputby", to_char(x.INPUTDATE, 'dd-mm-yyyy hh24:mi')"inputdate", x.UPDATEBY "updateby", to_char(x.UPDATEDATE, 'dd-mm-yyyy hh24:mi') "updatedate"
from gangactivity x, gang g
where x.gangcode = g.gangcode
and gangtype = 'M' 
and (x.gangcode LIKE  UPPER('%' || :search ||'%') OR x.mandorecode LIKE  UPPER('%' || :search ||'%')) and to_char(tdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(tdate,'mmyyyy')) order by tdate`;

/**
 * ! change query table detail
 */
const detailQuery = `select rowid "rowid",gangcode "gangcode", empcode "empcode", get_empname(empcode) "empname", empcode_lf "empcode_lf",get_empname(empcode_lf) "empname" ,to_char(TDATE, 'dd-mm-yyyy') "tdate",
mandays "mandays", ffb "ffb", lf "lf", ptg1_jp "ptg1_jp",ptg1_unit "ptg1_unit", ptg2_jp "ptg2_jp",ptg2_unit "ptg2_unit", ptg3_jp "ptg3_jp",ptg3_unit "ptg3_unit",
 ptg4_jp "ptg4_jp",ptg4_unit "ptg4_unit",attdcode "attdcode",units "units", 
remarks "remarks", inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby",
 to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from gangactivitydetail where gangcode=:gangcode 
 and to_char(tdate,'mmyyyy') = nvl(to_char(TO_DATE(:period, 'MM/YYYY'),'mmyyyy'),to_char(tdate,'mmyyyy'))  order by tdate`;

const fetchDataHeader = async function (users, params, routes, callback) {
  binds = {};

  binds.limitsize = !params.size ? 0 : params.size;
  binds.page = !params.page ? 1 : params.page;
  binds.search = !params.search ? "" : params.search;
  binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

  let result;

  //console.log(binds.search, binds.dateperiode)
  try {
    result = await database.siteLimitExecute(users, routes, baseQuery, binds);

    // console.log(result)
  } catch (error) {
    callback(error, "");
  }

  // console.log(binds)
  callback("", result);
};
const fetchDataDetail = async function (users, routes, params, callback) {
  binds = {};

  /**
   * ! change the parameters according to the table
   */
  binds.gangcode = !params.gangcode ? "" : params.gangcode;
  binds.period = (!params.period ? '' : params.period)

  let result;

  try {
    result = await database.siteWithDefExecute(
      users,
      routes,
      detailQuery,
      binds
    );
  } catch (error) {
    callback(error, "");
  }

  callback("", result);
};

module.exports = {
  fetchDataHeader,
  fetchDataDetail,
};
