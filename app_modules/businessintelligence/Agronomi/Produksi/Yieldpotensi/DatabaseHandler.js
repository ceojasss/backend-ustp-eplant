const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const baseQuery = `select  plantingyear "plantingyear", 
sum(decode(site,'USTP',act,0))  "ustp_act",
sum(decode(site,'USTP',bgt,0))  "ustp_bgt",
sum(decode(site,'USTP',pot,0))  "ustp_pot",
sum(decode(site,'USTP',act_ly,0))  "ustp_actly",
sum(decode(site,'USTP',bgt_full,0))  "ustp_bgtfull",
sum(decode(site,'USTP',pot_teo,0))  "ustp_potteo",
sum(decode(site,'USTP',pot_riil,0))  "ustp_potriil",
sum(decode(site,'GCM',act,0))  "gcm_act",
sum(decode(site,'GCM',bgt,0))  "gcm_bgt",
sum(decode(site,'GCM',pot,0))  "gcm_pot",
sum(decode(site,'GCM',act_ly,0))  "gcm_actly",
sum(decode(site,'GCM',bgt_full,0))  "gcm_bgtfull",
sum(decode(site,'GCM',pot_teo,0))  "gcm_potteo",
sum(decode(site,'GCM',pot_riil,0))  "gcm_potriil",
sum(decode(site,'SMG',act,0))  "smg_act",
sum(decode(site,'SMG',bgt,0))  "smg_bgt",
sum(decode(site,'SMG',pot,0))  "smg_pot" ,
sum(decode(site,'SMG',act_ly,0))  "smg_actly",
sum(decode(site,'SMG',bgt_full,0))  "smg_bgtfull",
sum(decode(site,'SMG',pot_teo,0))  "smg_potteo",
sum(decode(site,'SMG',pot_riil,0))  "smg_potriil",
sum(decode(site,'SJE',act,0))  "sje_act",
sum(decode(site,'SJE',bgt,0))  "sje_bgt",
sum(decode(site,'SJE',pot,0))  "sje_pot" ,
sum(decode(site,'SJE',act_ly,0))  "sje_actly",
sum(decode(site,'SJE',bgt_full,0))  "sje_bgtfull",
sum(decode(site,'SJE',pot_teo,0))  "sje_potteo",
sum(decode(site,'SJE',pot_riil,0))  "sje_potriil",
sum(decode(site,'SBE',act,0))  "sbe_act",
sum(decode(site,'SBE',bgt,0))  "sbe_bgt",
sum(decode(site,'SBE',pot,0))  "sbe_pot",
sum(decode(site,'SBE',act_ly,0))  "sbe_actly",
sum(decode(site,'SBE',bgt_full,0))  "sbe_bgtfull",
sum(decode(site,'SBE',pot_teo,0))  "sbe_potteo",
sum(decode(site,'SBE',pot_riil,0))  "sbe_potriil",
sum(decode(site,'SLM',act,0))  "slm_act",
sum(decode(site,'SLM',bgt,0))  "slm_bgt",
sum(decode(site,'SLM',pot,0))  "slm_pot",
sum(decode(site,'SLM',act_ly,0))  "slm_actly",
sum(decode(site,'SLM',bgt_full,0))  "slm_bgtfull",
sum(decode(site,'SLM',pot_teo,0))  "slm_potteo",
sum(decode(site,'SLM',pot_riil,0))  "slm_potriil"
from
(
select site, plantingyear, 
decode(sum(decode(month,:p_month,ha,0)),0,0,sum(act)/sum(decode(month,:p_month,ha,0))/1000) act, 
decode(sum(decode(month,:p_month,ha,0)),0,0,sum(bgt)/sum(decode(month,:p_month,ha,0))/1000) bgt, 
decode(sum(decode(month,:p_month,ha,0)),0,0,sum(pot)/sum(decode(month,:p_month,ha,0))/1000) pot,
0 act_ly, 
0 bgt_full,
decode(sum(decode(month,:p_month,ha,0)),0,0,sum(pot) /sum(decode(month,:p_month,ha,0))/1000) pot_teo, 
(decode(sum(decode(month,:p_month,ha,0)),0,0,sum(pot) /sum(decode(month,:p_month,ha,0))/1000)) * 
decode((sum(decode(month,:p_month,ha,0))*136),0,0,sum(decode(month,:p_month,sph,0) * decode(month,:p_month,ha,0))/ (sum(decode(month,:p_month,ha,0))*136)) pot_riil
from view_produksi_tbs_consol
where year = :p_year 
and month <= :p_month
and ha <> 0
AND intiplasma = decode(:p_intiplasma, null, intiplasma, decode(:p_intiplasma,'INTI','1','0'))
group by site, plantingyear
union all
select site, plantingyear, 
0 act, 
0 bgt, 
0 pot, 
decode(sum(decode(month,12,ha,0)),0,0,sum(act)/sum(decode(month,12,ha,0))/1000) act_ly, 0 bgt_full,
0 pot_teo, 0 pot_riil
from view_produksi_tbs_consol
where year = :p_year-1 
and month <= :p_month
and ha <> 0
AND intiplasma = decode(:p_intiplasma, null, intiplasma, decode(:p_intiplasma,'INTI','1','0'))
group by site, plantingyear
union all
select site, plantingyear, 
0 act, 
0 bgt, 
0 pot, 0 act_ly, 
decode(sum(decode(month,:p_month,ha,0)),0,0,sum(bgt)/sum(decode(month,:p_month,ha,0))/1000)  bgt_full,
0 pot_teo, 0 pot_riil
from view_produksi_tbs_consol
where year = :p_year
and month <= :p_month
and ha <> 0
AND intiplasma = decode(:p_intiplasma, null, intiplasma, decode(:p_intiplasma,'INTI','1','0'))
group by site, plantingyear
)
group by plantingyear
order by plantingyear
`;


const fetchData = async function (users, routes, params, callback) {

  binds = {};
  //binds.p_date = "11-04-2022"
  binds.p_month = (!params.p_month ? '' : params.p_month)
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

