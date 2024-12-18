const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

const QueryPT = `select 
sum(case when umur between 10 and 12 then ha else 0 end) luas_1012,
sum(case when umur between 10 and 12 then jml else 0 end) cnt_1012,
sum(case when umur between 10 and 12 then jml else 0 end) / sum(jml) * 100 pct_1012,
sum(case when umur >= 13 then ha else 0 end) luas_l12,
sum(case when umur >= 13 then jml else 0 end) cnt_l12,
sum(case when umur >= 13 then jml else 0 end) / sum(jml) * 100 pct_l12
from
(
select site, intiplasma, umur, count(*) jml, sum(ha) ha
from
( 
select 'USTP' site, intiplasma, hectplanted ha, 
case 
when dd = 1 then decode(t1,'X',1,to_number(t1)) 
when dd = 2 then decode(t2,'X',1,to_number(t2)) 
when dd = 3 then decode(t3,'X',1,to_number(t3)) 
when dd = 4 then decode(t4,'X',1,to_number(t4)) 
when dd = 5 then decode(t5,'X',1,to_number(t5)) 
when dd = 6 then decode(t6,'X',1,to_number(t6)) 
when dd = 7 then decode(t7,'X',1,to_number(t7)) 
when dd = 8 then decode(t8,'X',1,to_number(t8)) 
when dd = 9 then decode(t9,'X',1,to_number(t9)) 
when dd = 10 then decode(t10,'X',1,to_number(t10)) 
when dd = 11 then decode(t11,'X',1,to_number(t11)) 
when dd = 12 then decode(t12,'X',1,to_number(t12)) 
when dd = 13 then decode(t13,'X',1,to_number(t13)) 
when dd = 14 then decode(t14,'X',1,to_number(t14)) 
when dd = 15 then decode(t15,'X',1,to_number(t15)) 
when dd = 16 then decode(t16,'X',1,to_number(t16)) 
when dd = 17 then decode(t17,'X',1,to_number(t17)) 
when dd = 18 then decode(t18,'X',1,to_number(t18)) 
when dd = 19 then decode(t19,'X',1,to_number(t19)) 
when dd = 20 then decode(t20,'X',1,to_number(t20)) 
when dd = 21 then decode(t21,'X',1,to_number(t21)) 
when dd = 22 then decode(t22,'X',1,to_number(t22)) 
when dd = 23 then decode(t23,'X',1,to_number(t23)) 
when dd = 24 then decode(t24,'X',1,to_number(t24)) 
when dd = 25 then decode(t25,'X',1,to_number(t25)) 
when dd = 26 then decode(t26,'X',1,to_number(t26)) 
when dd = 27 then decode(t27,'X',1,to_number(t27)) 
when dd = 28 then decode(t28,'X',1,to_number(t28)) 
when dd = 29 then decode(t29,'X',1,to_number(t29)) 
when dd = 30 then decode(t30,'X',1,to_number(t30)) 
when dd = 31 then decode(t31,'X',1,to_number(t31))  
 else 0 end umur
 from EPMS_USTP.emp_harv_rotation_consol x, (select to_number(extract(day from to_date(:p_date,'dd-mm-yyyy'))) dd from dual)
 where year = extract(year from to_date(:p_date,'dd-mm-yyyy')) and site = :site and period = extract(month from to_date(:p_date,'dd-mm-yyyy'))
 )
 where intiplasma = 1
 group by site, intiplasma, umur
 ) group by site, intiplasma
 order by intiplasma, decode(site,'GCM',1,'SMG',2,'SJE',3,'SBE',4,'SLM',5,'USTP',10)


`;


const QueryNonPT = `select 
sum(case when umur between 10 and 12 then ha else 0 end) luas_1012,
sum(case when umur between 10 and 12 then jml else 0 end) cnt_1012,
sum(case when umur between 10 and 12 then jml else 0 end) / sum(jml) * 100 pct_1012,
sum(case when umur >= 13 then ha else 0 end) luas_l12,
sum(case when umur >= 13 then jml else 0 end) cnt_l12,
sum(case when umur >= 13 then jml else 0 end) / sum(jml) * 100 pct_l12
from
(
select site, intiplasma, umur, count(*) jml, sum(ha) ha
from
( 
select 'USTP' site, intiplasma, hectplanted ha, 
case 
when dd = 1 then decode(t1,'X',1,to_number(t1)) 
when dd = 2 then decode(t2,'X',1,to_number(t2)) 
when dd = 3 then decode(t3,'X',1,to_number(t3)) 
when dd = 4 then decode(t4,'X',1,to_number(t4)) 
when dd = 5 then decode(t5,'X',1,to_number(t5)) 
when dd = 6 then decode(t6,'X',1,to_number(t6)) 
when dd = 7 then decode(t7,'X',1,to_number(t7)) 
when dd = 8 then decode(t8,'X',1,to_number(t8)) 
when dd = 9 then decode(t9,'X',1,to_number(t9)) 
when dd = 10 then decode(t10,'X',1,to_number(t10)) 
when dd = 11 then decode(t11,'X',1,to_number(t11)) 
when dd = 12 then decode(t12,'X',1,to_number(t12)) 
when dd = 13 then decode(t13,'X',1,to_number(t13)) 
when dd = 14 then decode(t14,'X',1,to_number(t14)) 
when dd = 15 then decode(t15,'X',1,to_number(t15)) 
when dd = 16 then decode(t16,'X',1,to_number(t16)) 
when dd = 17 then decode(t17,'X',1,to_number(t17)) 
when dd = 18 then decode(t18,'X',1,to_number(t18)) 
when dd = 19 then decode(t19,'X',1,to_number(t19)) 
when dd = 20 then decode(t20,'X',1,to_number(t20)) 
when dd = 21 then decode(t21,'X',1,to_number(t21)) 
when dd = 22 then decode(t22,'X',1,to_number(t22)) 
when dd = 23 then decode(t23,'X',1,to_number(t23)) 
when dd = 24 then decode(t24,'X',1,to_number(t24)) 
when dd = 25 then decode(t25,'X',1,to_number(t25)) 
when dd = 26 then decode(t26,'X',1,to_number(t26)) 
when dd = 27 then decode(t27,'X',1,to_number(t27)) 
when dd = 28 then decode(t28,'X',1,to_number(t28)) 
when dd = 29 then decode(t29,'X',1,to_number(t29)) 
when dd = 30 then decode(t30,'X',1,to_number(t30)) 
when dd = 31 then decode(t31,'X',1,to_number(t31))  
 else 0 end umur
 from EPMS_USTP.emp_harv_rotation_consol x, (select to_number(extract(day from to_date(:p_date,'dd-mm-yyyy'))) dd from dual)
 where year = extract(year from to_date(:p_date,'dd-mm-yyyy')) and period = extract(month from to_date(:p_date,'dd-mm-yyyy'))
 )
 where intiplasma = 1
 group by site, intiplasma, umur
 ) group by site, intiplasma
 order by intiplasma, decode(site,'GCM',1,'SMG',2,'SJE',3,'SBE',4,'SLM',5,'USTP',10)

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
