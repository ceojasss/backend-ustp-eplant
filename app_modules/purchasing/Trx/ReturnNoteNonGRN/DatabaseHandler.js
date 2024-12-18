const _ = require("lodash");
const database = require("../../../../oradb/dbHandler");

const baseQuery = `select rowid "rowid",
returnnotenumber "returnnotenumber",pocode "pocode",suratjalan "suratjalan",to_char(rtndate,'dd-mm-yyyy') "rtndate",REMARKS "remarks",
inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from RETURNNOTE_NONGRN`;

const fetchdata = async function (users, route, callback) {
  binds = {};

  let result;

  // console.log(route)

  try {
    result = await database.siteWithDefExecute(users, route, baseQuery, binds);
    //console.log(result)
  } catch (error) {
    callback(error, "");
  }

  callback("", result);
};

module.exports = {
  fetchdata,
};