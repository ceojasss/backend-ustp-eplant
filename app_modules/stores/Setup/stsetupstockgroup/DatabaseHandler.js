const _ = require("lodash");
const database = require("../../../../oradb/dbHandler");

const baseQuery = ` select ROWID "rowid",controljob "controljob#code",getjob_des(CONTROLJOB) "controljob#description", GROUPCODE "groupcode",
GROUPDESCRIPTION "groupdescription", LEVELCODE "levelcode", PARENTCODE "parentcode", to_char(inactivedate, 'dd-mm-yyyy') "inactivedate", inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
from stockgroup order by groupcode`;


const fetchdata = async function (users, route, callback) {

  binds = {}

  let result

  // console.log(route)

  try {
      result = await database.siteWithDefExecute(users, route, baseQuery, binds)
      //console.log(result)
  } catch (error) {
      callback(error, '')
  }

  callback('', result)
}

module.exports = {
  fetchdata
};
