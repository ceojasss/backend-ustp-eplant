const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

const QueryPT = `select 
count(*) tersedia, 
sum(decode(status,'O',1,0)) ops, 
sum(decode(status,'S',1,0)) stb, 
sum(decode(status,'B',1,0)) brk 
from EPMS_USTP.vehicleavailability_consol where tdate = to_date(:p_date,'dd-mm-yyyy') and units = 'HM' and vehiclegroupcode not in ('FTE','FT') and site = :site
`;


const QueryNonPT = `select 
count(*) tersedia, 
sum(decode(status,'O',1,0)) ops, 
sum(decode(status,'S',1,0)) stb, 
sum(decode(status,'B',1,0)) brk 
from EPMS_USTP.vehicleavailability_consol where tdate = to_date(:p_date,'dd-mm-yyyy') and units = 'HM' and vehiclegroupcode not in ('FTE','FT')
`


const fetchData = async function (users, routes, params, callback) {

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
