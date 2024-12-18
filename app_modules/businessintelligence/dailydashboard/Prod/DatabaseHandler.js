const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

const QueryPT = `select
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_hi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_sbi
from EPMS_USTP.productstoragedetail_consol
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
and productcode = 'FFB' and site = :site`;

const QueryNonPT = `select
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_hi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_sbi
from EPMS_USTP.productstoragedetail_consol
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
and productcode = 'FFB'`

//   let result;

//   binds = {};
//   binds.p_date = "11-04-2018";
//   try {
//     result = await database.siteExecute(users, Query_1, binds);
//   } catch (error) {
//     callback(error, "");
//   }

//   if (_.isEmpty(result)) return callback("", []);

//   callback("", result.rows);
// };

const fetchData = async function (users, params, routes, callback) {

  binds = {};
  binds.p_date = (!params.p_date ? '' : params.p_date)
  binds.site = (!params.site ? '' : params.site)

  let result
  if(binds.site === "USTP"){
    let binds2 = _.omit(binds, ['site'])
    try {

      result = await database.siteWithDefExecute(users, routes, QueryNonPT, binds2)



    } catch (error) {
      callback(error, '')
    }



    callback('', result)


  }

  else{
    try {
      result = await database.siteWithDefExecute(users, routes, QueryPT, binds)



    } catch (error) {
      callback(error, '')
    }


    callback('', result)

  }
}



module.exports = {
  fetchData
};
