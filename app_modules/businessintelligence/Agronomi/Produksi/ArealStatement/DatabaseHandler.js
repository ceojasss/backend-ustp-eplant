const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const baseQuery = `select  x.year "year" , x.plantingyear "plantingyear" , case when x.year - NVL(plantingyear, x.year) < 4 then 'AREA TBM' else 'AREA TM' end "area", 
sum(decode(x.site, 'GCM',ha,0)) "gcm",
sum(decode(x.site, 'SMG',ha,0)) "smg",
sum(decode(x.site, 'SJE',ha,0)) "sje",
sum(decode(x.site, 'SBE',ha,0)) "sbe",
sum(decode(x.site, 'SLM',ha,0)) "slm"
from rpt_oilpalm_crop_stat_consol x, fieldcrop_consol y
where x.site = y.site and x.fieldcode = y.fieldcode and year = :p_year and month = 12 and case 
when :p_intiplasma = 'INTI' then 1
when :p_intiplasma = 'PLASMA' then 0
when :p_intiplasma = 'INTIPLASMA' then intiplasma end = intiplasma
and nvl(ha,0) <> 0
and (x.site, year) not in 
(select site "site", max(year) from rpt_oilpalm_crop_stat_consol group by site)
group by x.year, case when x.year - NVL(plantingyear, x.year) < 4 then 'AREA TBM' else 'AREA TM' end, plantingyear
union all
select x.year, x.plantingyear, case when x.year - NVL(plantingyear, x.year) < 4 then 'AREA TBM' else 'AREA TM' end "area", 
    sum(decode(x.site, 'GCM',ha,0)) "gcm",
    sum(decode(x.site, 'SMG',ha,0)) "smg",
    sum(decode(x.site, 'SJE',ha,0)) "sje",
    sum(decode(x.site, 'SBE',ha,0)) "sbe",
    sum(decode(x.site, 'SLM',ha,0)) "slm"
from rpt_oilpalm_crop_stat_consol x, fieldcrop_consol y where x.site = y.site
    and x.fieldcode = y.fieldcode
    and year = :p_year
    and nvl(ha,0) <> 0
    and (x.site, year||lpad(month,2,'0')) in 
        (select site, max(year||lpad(month,2,'0')) from rpt_oilpalm_crop_stat_consol group by site)
            group by x.year, case when x.year - NVL(plantingyear, x.year) < 4 then 'AREA TBM' else 'AREA TM' end, plantingyear
`;


const fetchData = async function (users, routes, params, callback) {

  binds = {};
  //binds.p_date = "11-04-2022"
  binds.p_year = (!params.p_year ? '' : params.p_year)
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

