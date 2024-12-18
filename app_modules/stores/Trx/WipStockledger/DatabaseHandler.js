const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

/**
 * ! change query table header
 */
const baseQuery = `select parametervaluecode "parametervaluecode" ,parametervalue "parametervalue" from 
parametervalue where parametercode='WIP_GROUP'`;

/**
 * ! change query table detail
 */
const detailQuery = `select w.rowid "rowid",w.month "month", w.year "year", p.parametervaluecode"parametervaluecode",w.itemcode "itemcode#code",
get_purchaseitemname(w.itemcode) "itemcode#description", w.qty "qty",
w.group_item "group_item", w.inputby "inputby", to_char(w.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", w.updateby "updateby", 
to_char(w.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from WIP_STOCKLEDGER w, parametervalue p where 
group_item = parametervaluecode and group_item = :parametervaluecode
and month= :month and year = :year`;

const fetchDataHeader = async function (users, params, routes, callback) {
  binds = {};

  binds.limitsize = !params.size ? 0 : params.size;
  binds.page = !params.page ? 1 : params.page;
  //   binds.search = !params.search ? "" : params.search;
  // binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

  let result;

  //console.log(binds.search, binds.dateperiode)
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
  binds.parametervaluecode = !params.parametervaluecode ? "" : params.parametervaluecode;
  binds.month = !params.month ? "" : params.month;
  binds.year = !params.year ? "" : params.year;

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
