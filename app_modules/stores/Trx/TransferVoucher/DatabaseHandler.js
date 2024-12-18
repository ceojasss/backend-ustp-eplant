const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid",transfercode "transfercode",to_char(wodate, 'dd-mm-yyyy') "wodate",remarks "remarks",fromstore "fromstore",v_url_preview_site (
  'TRF',
  CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || transfercode "v_url_preview",process_flag "process_flag",
tostore "tostore", authorization "authorization", receivenotecode"receivenotecode#code", inputby "inputby", to_char(inputdate, 'dd-mm-yyyy') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy') "updatedate" from transfervoucher
where (transfercode LIKE  UPPER('%' || :search ||'%') OR remarks LIKE  UPPER('%' || :search ||'%'))
  and to_char(wodate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(wodate,'mmyyyy')) ORDER BY wodate DESC`;

/**
 * ! change query table detail
 */
const detailQuery = `select rowid "rowid",
tid "tid",transfercode "transfercode",itemcode "itemcode#code",get_purchaseitemname(itemcode) "itemcode#description", quantity "quantity",remarks "remarks", karung "karung",
fromspecificlocationcode "fromspecificlocationcode",tospecificlocationcode "tospecificlocationcode", inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from transferdetails
where transfercode = :transfercode`;

const fetchDataHeader = async function (users, params, routes, callback) {
  binds = {};

  binds.limitsize = !params.size ? 0 : params.size;
  binds.page = !params.page ? 1 : params.page;
  binds.search = !params.search ? "" : params.search;
  binds.dateperiode = !params.dateperiode ? "" : params.dateperiode;

  let result;

  try {
    result = await database.siteLimitExecute(users, routes, baseQuery, binds);

    // console.log(result)
  } catch (error) {
    callback(error, "");
  }

  callback("", result);
};
const fetchDataDetail = async function (users, routes, params, callback) {
  binds = {};

  /**
   * ! change the parameters according to the table
   */
  binds.transfercode = (!params.transfercode ? "" : params.transfercode)

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
