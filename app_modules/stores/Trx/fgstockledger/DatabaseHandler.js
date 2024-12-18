const _ = require("lodash");
const database = require("../../../../oradb/dbHandler");

const baseQuery = `select rowid "rowid",tdate "tdate",itemcode "itemcode",qty "qty",remarks "remarks",inputby "inputby", inputdate "inputdate", updateby "updateby", updatedate "updatedate" from FG_STOCKLEDGER
`;

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
