const _ = require("lodash");
const database = require("../../../../oradb/dbHandler");

const baseQuery = `select 
rowid "rowid",
to_char(tdate, 'dd-mm-yyyy') "tdate",
itemcode "itemcode",
qty "qty",
remarks "remarks",
inputby "inputby", 
to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate",
updateby "updateby", 
to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" 
from FG_STOCKLEDGER order by itemcode`;


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

