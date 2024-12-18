const _ = require("lodash");
const database = require("../../../../oradb/dbHandler");

const baseQuery = `select  rowid "rowid",
pocode "pocode",to_char(podate, 'dd-mm-yyyy') "podate",suppliercode "suppliercode",
remarks "remarks",authorized "authorized", delivered "delivered",transportationcost "transportationcost",
customclearancecost "customclearancecost",othercost "othercost", currency "currency",topcode "topcode",
deliveryinstruction "deliveryinstruction",franco "franco",purchasing_site "purchasing_site",
payment_address "payment_address",to_char(required_date, 'dd-mm-yyyy') "required_date",process_flag "process_flag",
inputby "inputby",to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby",
to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from lpo`; 

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