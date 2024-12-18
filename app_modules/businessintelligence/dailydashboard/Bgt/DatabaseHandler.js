const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

const Query_1 = `select 
sum(case when x.month = extract(month from to_date(:p_date,'dd-mm-yyyy')) then (kg/hari) end)/1000 bgt_hi,
sum(case when x.month = extract(month from to_date(:p_date,'dd-mm-yyyy')) then (kg) end)/1000 bgt_bi,
sum(case when x.month <= extract(month from to_date(:p_date,'dd-mm-yyyy')) then (kg) end)/1000 bgt_sbi,
sum((kg))/1000 bgt_year
from EPMS_USTP.budgetcrop_consol_detail x, (select extract(year from tdate) year, extract(month from tdate) month, count(*) hari
from calendar where substr(to_char(tdate,'DAY'),1,3) not in ('SUN')
group by extract(year from tdate), extract(month from tdate)) y
where x.year = y.year
and x.month = y.month
and x.year = extract(year from to_date(:p_date,'dd-mm-yyyy')) and site = :site`;

const Query_2 = `select 
sum(case when x.month = extract(month from to_date(:p_date,'dd-mm-yyyy')) then (kg/hari) end)/1000 bgt_hi,
sum(case when x.month = extract(month from to_date(:p_date,'dd-mm-yyyy')) then (kg) end)/1000 bgt_bi,
sum(case when x.month <= extract(month from to_date(:p_date,'dd-mm-yyyy')) then (kg) end)/1000 bgt_sbi,
sum((kg))/1000 bgt_year
from EPMS_USTP.budgetcrop_consol_detail x, (select extract(year from tdate) year, extract(month from tdate) month, count(*) hari
from calendar where substr(to_char(tdate,'DAY'),1,3) not in ('SUN')
group by extract(year from tdate), extract(month from tdate)) y
where x.year = y.year
and x.month = y.month
and x.year = extract(year from to_date(:p_date,'dd-mm-yyyy'))`


const fetchData = async function (users, params, routes, callback) {

  binds = {};
  binds.p_date = (!params.p_date ? '' : params.p_date)
  binds.site = (!params.site ? '' : params.site)

  let result
  if(binds.site === "USTP"){
    let binds2 = _.omit(binds, ['site'])
    try {

      result = await database.siteWithDefExecute(users, routes, Query_2, binds2)



    } catch (error) {
      callback(error, '')
    }



    callback('', result)


  }

  else{
    try {
      result = await database.siteWithDefExecute(users, routes, Query_1, binds)



    } catch (error) {
      callback(error, '')
    }


    callback('', result)

  }
}



module.exports = {
  fetchData
};
