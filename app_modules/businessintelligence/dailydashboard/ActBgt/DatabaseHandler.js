const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

const QueryPT = `select bulan, sum(actual) actual, sum(budget) budget
from
(
select 
extract(month from tdate) bulan,
sum(production) actual,
0 budget
from productstoragedetail_consol
where tdate between trunc(to_date(:p_date,'dd-MM-yyyy'),'yyyy') and to_date(:p_date,'dd-MM-yyyy')
and productcode = 'FFB'
and site = :site
group by extract(month from tdate) 
union all
select 
x.month, 0, sum((kg))/1000 
from epms_ustp.budgetcrop_consol_detail x, (select extract(year from tdate) year, extract(month from tdate) month, count(*) hari
from calendar where substr(to_char(tdate,'DAY'),1,3) not in ('SUN')
group by extract(year from tdate), extract(month from tdate)) y
where x.year = y.year
and x.month = y.month
and x.year = extract(year from to_date(:p_date,'dd-MM-yyyy'))
and site = :site
group by x.month
) group by bulan
order by 1

`;


const QueryNonPT = `select bulan, sum(actual) actual, sum(budget) budget
from
(
select 
extract(month from tdate) bulan,
sum(production) actual,
0 budget
from productstoragedetail_consol
where tdate between trunc(to_date(:p_date,'dd-MM-yyyy'),'yyyy') and to_date(:p_date,'dd-MM-yyyy')
and productcode = 'FFB'
group by extract(month from tdate) 
union all
select 
x.month, 0, sum((kg))/1000 
from epms_ustp.budgetcrop_consol_detail x, (select extract(year from tdate) year, extract(month from tdate) month, count(*) hari
from calendar where substr(to_char(tdate,'DAY'),1,3) not in ('SUN')
group by extract(year from tdate), extract(month from tdate)) y
where x.year = y.year
and x.month = y.month
and x.year = extract(year from to_date(:p_date,'dd-MM-yyyy'))
group by x.month
) group by bulan
order by 1`



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
