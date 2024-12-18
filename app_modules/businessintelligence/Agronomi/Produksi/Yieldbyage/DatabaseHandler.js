const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const baseQuery = `select umur "umur", 
sum(case when noww-plantingyear = 30 then yield else 0 end) "t30",
sum(case when noww-plantingyear = 29 then yield else 0 end) "t29",
sum(case when noww-plantingyear = 28 then yield else 0 end) "t28",
sum(case when noww-plantingyear = 27 then yield else 0 end) "t27",
sum(case when noww-plantingyear = 26 then yield else 0 end) "t26",
sum(case when noww-plantingyear = 25 then yield else 0 end) "t25",
sum(case when noww-plantingyear = 24 then yield else 0 end) "t24",
sum(case when noww-plantingyear = 23 then yield else 0 end) "t23",
sum(case when noww-plantingyear = 22 then yield else 0 end) "t22",
sum(case when noww-plantingyear = 21 then yield else 0 end) "t21",
sum(case when noww-plantingyear = 20 then yield else 0 end) "t20",
sum(case when noww-plantingyear = 19 then yield else 0 end) "t19",
sum(case when noww-plantingyear = 18 then yield else 0 end) "t18",
sum(case when noww-plantingyear = 17 then yield else 0 end) "t17",
sum(case when noww-plantingyear = 16 then yield else 0 end) "t16",
sum(case when noww-plantingyear = 15 then yield else 0 end) "t15",
sum(case when noww-plantingyear = 14 then yield else 0 end) "t14",
sum(case when noww-plantingyear = 13 then yield else 0 end) "t13",
sum(case when noww-plantingyear = 12 then yield else 0 end) "t12",
sum(case when noww-plantingyear = 11 then yield else 0 end) "t11",
sum(case when noww-plantingyear = 10 then yield else 0 end) "t10",
sum(case when noww-plantingyear = 9 then yield else 0 end) "t09",
sum(case when noww-plantingyear = 8 then yield else 0 end) "t08",
sum(case when noww-plantingyear = 7 then yield else 0 end) "t07",
sum(case when noww-plantingyear = 6 then yield else 0 end) "t06",
sum(case when noww-plantingyear = 5 then yield else 0 end) "t05",
sum(case when noww-plantingyear = 4 then yield else 0 end) "t04",
sum(case when noww-plantingyear = 3 then yield else 0 end) "t03",
sum(case when noww-plantingyear = 2 then yield else 0 end) "t02",
sum(case when noww-plantingyear = 1 then yield else 0 end) "t01"
from
(
select extract(year from sysdate) noww, year, plantingyear, year- plantingyear umur, round(decode(sum(ha),0,0,sum(ton)/sum(ha)),2) yield
from
(
select year, plantingyear, fieldcode, month, tot_crop_tmonth/1000 ton, decode(month,12,ha,0) ha from rpt_oilpalm_crop_stat_consol
where site = decode(:p_site, 'USTP',site, :p_site)
and (case when substr(fieldcode,1,1) = substr(fieldcode,2,1) then 'PLASMA' else 'INTI' end) = decode(:p_intiplasma,'INTIPLASMA',(case when substr(fieldcode,1,1) = substr(fieldcode,2,1) then 'PLASMA' else 'INTI' end), :p_intiplasma)
and year <> extract (year from sysdate)
and year > plantingyear
union all
select year, plantingyear, fieldcode, month, tot_crop_tmonth/1000 ton, decode(month,TO_NUMBER(TO_CHAR (ADD_MONTHS (SYSDATE, -1), 'MM')),ha,0) ha from rpt_oilpalm_crop_stat_consol
where site = decode(:p_site, 'USTP',site, :p_site)
and (case when substr(fieldcode,1,1) = substr(fieldcode,2,1) then 'PLASMA' else 'INTI' end) = decode(:p_intiplasma,'INTIPLASMA',(case when substr(fieldcode,1,1) = substr(fieldcode,2,1) then 'PLASMA' else 'INTI' end), :p_intiplasma)
and year = extract (year from sysdate)
and year > plantingyear
)
group by year, plantingyear
)
group by umur
order by 1
`;


const fetchData = async function (users, routes, params, callback) {

  binds = {};
  //binds.p_date = "11-04-2022"
  binds.p_site = (!params.p_site ? '' : params.p_site)
  binds.p_intiplasma = (!params.p_intiplasma ? '' : params.p_intiplasma)

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

