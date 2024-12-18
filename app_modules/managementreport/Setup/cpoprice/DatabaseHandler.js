const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

const baseQuery = `select 
PERIOD "period", 
TO_CHAR (SUM (USTP) OVER (), '999,999,990')       "ustp",
TO_CHAR (SUM (KUMAI) OVER (), '999,999,990')       "kumai",
TO_CHAR (SUM (MALAYSIA) OVER (), '999,999,990')       "malaysia",
TO_CHAR (SUM (ROTERDAM) OVER (), '999,999,990')       "roterdam"
from 
VIEW_COMMODITY_SUMMARY`;


const fetchData = async function (users, routes, params, callback) {

  binds = {};

  let result

  try {
      result = await database.siteWithDefExecute(users, routes, baseQuery, binds)


  } catch (error) {
      callback(error, '')
  }



  callback('', result)
}



module.exports = {
  fetchData
};

