const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

const QueryPT = `select 'Pct'description,  sum(hadir)/sum(actual) * 100 value
from
(
select count(*) actual, 0 hadir from EPMS_USTP.empganghistorydetail_consol where month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and hr_name = 'Panen'
and site = :site
union all
select 0, count(*) 
from
(
select x.site, x.empcode, x.tdate from EPMS_USTP.gangactivitydetail_consol x, EPMS_USTP.empganghistorydetail_consol  y 
where tdate = to_date(:p_date,'dd-mm-yyyy')
and month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and x.site = y.site
and x.empcode = y.empcode
and hr_name = 'Panen'
and x.site = :site
and attdcode in ('KJ','PH','KE','PE','DL')
group by x.site, x.empcode, x.tdate
)
)
union all
select 'MPP' description, sum(qty) from EPMS_USTP.emp_mpp_consol where year = extract(year from to_date(:p_date,'dd-mm-yyyy')) and mppgroup = 'Panen'
and site = :site
union all
select 'Aktual' description, count(*)  from EPMS_USTP.empganghistorydetail_consol where month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and hr_name = 'Panen'
and site = :site
union all
select 'Hadir' description, count(*) 
from
(
select x.site, x.empcode, x.tdate from EPMS_USTP.gangactivitydetail_consol x, EPMS_USTP.empganghistorydetail_consol  y 
where tdate = to_date(:p_date,'dd-mm-yyyy')
and month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and x.site = y.site
and x.empcode = y.empcode
and hr_name = 'Panen'
and attdcode in ('KJ','PH','KE','PE','DL')
and x.site = :site
group by x.site, x.empcode, x.tdate
)
`;


const QueryNonPT = `select 'Pct'description,  sum(hadir)/sum(actual) * 100 value
from
(
select count(*) actual, 0 hadir from EPMS_USTP.empganghistorydetail_consol where month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and hr_name = 'Panen'
union all
select 0, count(*) 
from
(
select x.site, x.empcode, x.tdate from EPMS_USTP.gangactivitydetail_consol x, EPMS_USTP.empganghistorydetail_consol  y 
where tdate = to_date(:p_date,'dd-mm-yyyy')
and month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and x.site = y.site
and x.empcode = y.empcode
and hr_name = 'Panen'
and attdcode in ('KJ','PH','KE','PE','DL')
group by x.site, x.empcode, x.tdate
)
)
union all
select 'MPP' description, sum(qty) from EPMS_USTP.emp_mpp_consol where year = extract(year from to_date(:p_date,'dd-mm-yyyy')) and mppgroup = 'Panen'
union all
select 'Aktual' description, count(*)  from EPMS_USTP.empganghistorydetail_consol where month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and hr_name = 'Panen'
union all
select 'Hadir' description, count(*) 
from
(
select x.site, x.empcode, x.tdate from EPMS_USTP.gangactivitydetail_consol x, EPMS_USTP.empganghistorydetail_consol  y 
where tdate = to_date(:p_date,'dd-mm-yyyy')
and month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and x.site = y.site
and x.empcode = y.empcode
and hr_name = 'Panen'
and attdcode in ('KJ','PH','KE','PE','DL')
group by x.site, x.empcode, x.tdate
)
`



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
