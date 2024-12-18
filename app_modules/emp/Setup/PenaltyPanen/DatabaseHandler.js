const _ = require("lodash");
const database = require("../../../../oradb/dbHandler");

const baseQuery = `select ROWID "rowid", JP "jp", RATE "rate", DESCRIPTION "description", TYPE "type", 
x.inputby, to_char(x.inputdate,'dd-mm-yyyy hh24:mi') inputdate, x.updateby, to_char(x.updatedate,'dd-mm-yyyy hh24:mi') updatedate 
from harvesting_penalty x
order by jp`;

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