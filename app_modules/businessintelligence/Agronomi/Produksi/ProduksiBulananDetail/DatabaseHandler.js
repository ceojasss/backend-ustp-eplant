const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const baseQuery = `select 
decode(descr,'ACT','1','BGT','2','SEN','4','POT','6') "urut",
decode(site,'GCM',1,'SMG',2,'SJE',3,'SBE',4,'SLM',5) "urut_site",
site "site", 
decode(descr,'ACT','Actual (Ton)','BGT','Budget (Ton)','SEN','Sensus (Ton)','POT','Potensi (Ton)') "descr",
sum(decode(month,1,kg/1000,0)) "bln01",
sum(decode(month,2,kg/1000,0)) "bln02",
sum(decode(month,3,kg/1000,0)) "bln03",
sum(decode(month,4,kg/1000,0)) "bln04",
sum(decode(month,5,kg/1000,0)) "bln05",
sum(decode(month,6,kg/1000,0)) "bln06",
sum(decode(month,7,kg/1000,0)) "bln07",
sum(decode(month,8,kg/1000,0)) "bln08",
sum(decode(month,9,kg/1000,0)) "bln09",
sum(decode(month,10,kg/1000,0)) "bln10",
sum(decode(month,11,kg/1000,0)) "bln11",
sum(decode(month,12,kg/1000,0)) "bln12",
sum(kg/1000) "total"
from view_produksi_tbs_det_consol 
where year = :p_year
--AND SITE = DECODE(:p_site,null,SITE,:p_site)
and plantingyear = decode(:p_plant,null, plantingyear, :p_plant)
--and estatecode = decode(:p_estate,null, estatecode, :p_estate)
--and divisioncode = decode(:p_division,null, divisioncode, :p_division)
and intiplasma = decode(:p_intiplasma, null, intiplasma, decode(:p_intiplasma,'INTI','1','0'))
group by descr, site
union all
select '3', decode(site,'GCM',1,'SMG',2,'SJE',3,'SBE',4,'SLM',5) "urut_site",
site "site", 'Actual vs Budget %' "descr",
sum(decode(month,1,decode(bgt,0,0,act/bgt),0))*100 "bln01",
sum(decode(month,2,decode(bgt,0,0,act/bgt),0))*100 "bln02",
sum(decode(month,3,decode(bgt,0,0,act/bgt),0))*100 "bln03",
sum(decode(month,4,decode(bgt,0,0,act/bgt),0))*100 "bln04",
sum(decode(month,5,decode(bgt,0,0,act/bgt),0))*100 "bln05",
sum(decode(month,6,decode(bgt,0,0,act/bgt),0))*100 "bln06",
sum(decode(month,7,decode(bgt,0,0,act/bgt),0))*100 "bln07",
sum(decode(month,8,decode(bgt,0,0,act/bgt),0))*100 "bln08",
sum(decode(month,9,decode(bgt,0,0,act/bgt),0))*100 "bln09",
sum(decode(month,10,decode(bgt,0,0,act/bgt),0))*100 "bln10",
sum(decode(month,11,decode(bgt,0,0,act/bgt),0))*100 "bln11",
sum(decode(month,12,decode(bgt,0,0,act/bgt),0))*100 "bln12",
decode(sum(bgt),0,0,sum(act)/sum(bgt))*100 "total"
from 
(
select site, month, sum(act) act, sum(bgt) bgt, sum(sen)sen, sum(pot)pot from view_produksi_tbs_consol 
where year = :p_year
--AND SITE = DECODE(:p_site,null,SITE,:p_site)
and plantingyear = decode(:p_plant,null, plantingyear, :p_plant)
--and estatecode = decode(:p_estate,null, estatecode, :p_estate)
--and divisioncode = decode(:p_division,null, divisioncode, :p_division)
and intiplasma = decode(:p_intiplasma, null, intiplasma, decode(:p_intiplasma,'INTI','1','0'))
group by month, site
)group by site
union all
select '5',decode(site,'GCM',1,'SMG',2,'SJE',3,'SBE',4,'SLM',5) "urut_site",
site "site", 'Actual vs Sensus %' "descr",
sum(decode(month,1,decode(sen,0,0,act/sen),0))*100 "bln01",
sum(decode(month,2,decode(sen,0,0,act/sen),0))*100 "bln02",
sum(decode(month,3,decode(sen,0,0,act/sen),0))*100 "bln03",
sum(decode(month,4,decode(sen,0,0,act/sen),0))*100 "bln04",
sum(decode(month,5,decode(sen,0,0,act/sen),0))*100 "bln05",
sum(decode(month,6,decode(sen,0,0,act/sen),0))*100 "bln06",
sum(decode(month,7,decode(sen,0,0,act/sen),0))*100 "bln07",
sum(decode(month,8,decode(sen,0,0,act/sen),0))*100 "bln08",
sum(decode(month,9,decode(sen,0,0,act/sen),0))*100 "bln09",
sum(decode(month,10,decode(sen,0,0,act/sen),0))*100 "bln10",
sum(decode(month,11,decode(sen,0,0,act/sen),0))*100 "bln11",
sum(decode(month,12,decode(sen,0,0,act/sen),0))*100 "bln12",
decode(sum(sen),0,0,sum(act)/sum(sen))*100 "total"
from 
(
select site, month, sum(act) act, sum(bgt) bgt, sum(sen)sen, sum(pot)pot from view_produksi_tbs_consol 
where year = :p_year
--AND SITE = DECODE(:p_site,null,SITE,:p_site)
and plantingyear = decode(:p_plant,null, plantingyear, :p_plant)
--and estatecode = decode(:p_estate,null, estatecode, :p_estate)
--and divisioncode = decode(:p_division,null, divisioncode, :p_division)
and intiplasma = decode(:p_intiplasma, null, intiplasma, decode(:p_intiplasma,'INTI','1','0'))
group by month, site
) group by site
union all
select '7', decode(site,'GCM',1,'SMG',2,'SJE',3,'SBE',4,'SLM',5) "urut_site",
site "site", 'Actual vs Potensi %' "descr",
sum(decode(month,1,decode(pot,0,0,act/pot),0))*100 "bln01",
sum(decode(month,2,decode(pot,0,0,act/pot),0))*100 "bln02",
sum(decode(month,3,decode(pot,0,0,act/pot),0))*100 "bln03",
sum(decode(month,4,decode(pot,0,0,act/pot),0))*100 "bln04",
sum(decode(month,5,decode(pot,0,0,act/pot),0))*100 "bln05",
sum(decode(month,6,decode(pot,0,0,act/pot),0))*100 "bln06",
sum(decode(month,7,decode(pot,0,0,act/pot),0))*100 "bln07",
sum(decode(month,8,decode(pot,0,0,act/pot),0))*100 "bln08",
sum(decode(month,9,decode(pot,0,0,act/pot),0))*100 "bln09",
sum(decode(month,10,decode(pot,0,0,act/pot),0))*100 "bln10",
sum(decode(month,11,decode(pot,0,0,act/pot),0))*100 "bln11",
sum(decode(month,12,decode(pot,0,0,act/pot),0))*100 "bln12",
decode(sum(pot),0,0,sum(act)/sum(pot))*100 "total"
from 
(
select site, month, sum(act) act, sum(bgt) bgt, sum(sen)sen, sum(pot)pot from view_produksi_tbs_consol 
where year = :p_year
--AND SITE = DECODE(:p_site,null,SITE,:p_site)
and plantingyear = decode(:p_plant,null, plantingyear, :p_plant)
--and estatecode = decode(:p_estate,null, estatecode, :p_estate)
--and divisioncode = decode(:p_division,null, divisioncode, :p_division)
and intiplasma = decode(:p_intiplasma, null, intiplasma, decode(:p_intiplasma,'INTI','1','0'))
group by month, site
)
group by site
order by 2, 1
`;


const fetchData = async function (users, routes, params, callback) {

  binds = {};
  //binds.p_date = "11-04-2022"
  binds.p_year = (!params.p_year ? '' : params.p_year)
  binds.p_plant = (!params.p_plant ? '' : params.p_plant)
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

