const _ = require("lodash");
const database = require("../../../../oradb/dbHandler");

const baseQuery = `SELECT ROWID "rowid", parameterratecode "parameterratecode",description "description", RATE "rate", 
INPUTBY "inputby",to_char(INPUTDATE, 'dd-mm-yyyy hh24:mi') "inputdate", UPDATEBY "updateby", 
TO_CHAR(UPDATEDATE, 'dd-mm-yyyy hh24:mi') "updatedate" FROM PARAMETERRATE`;

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
