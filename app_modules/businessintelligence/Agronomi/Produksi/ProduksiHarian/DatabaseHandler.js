const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../../oradb/dbHandler");

const baseQuery = `select to_char(tglmasuk, 'dd') "tanggal",
sum(decode(site, 'GCM-1',qty,0)) "inti_gcm",
sum(decode(site, 'SMG-1',qty,0)) "inti_smg",
sum(decode(site, 'SJE-1',qty,0)) "inti_sje",
sum(decode(site, 'SBE-1',qty,0)) "inti_sbe",
sum(decode(site, 'SLM-1',qty,0)) "inti_slm",
sum(decode(intiplasma, '1',qty,0)) "inti_total",
sum(decode(site, 'GCM-0',qty,0)) "plasma_gcm",
sum(decode(site, 'SMG-0',qty,0)) "plasma_smg",
sum(decode(site, 'SJE-0',qty,0)) "plasma_sje",
sum(decode(site, 'SBE-0',qty,0)) "plasma_sbe",
sum(decode(site, 'SLM-0',qty,0)) "plasma_slm",
sum(decode(intiplasma, '0',qty,0)) "plasma_total",
sum(qty) "total"
from
(select tglmasuk, site||'-'|| intiplasma site, intiplasma, sum(totalqty) qty
from NOTAANGKUTBUAH_CONSOL where tglmasuk BETWEEN trunc(TO_DATE (   :p_date,
                                                      'dd-mm-yyyy'
                                                     ),'mm')
                                         AND TO_DATE (   :p_date,
                                                      'dd-mm-yyyy'
                                                     )
group by tglmasuk, site, intiplasma
)
group by tglmasuk
union all
select 'Total' "tanggal",
sum(decode(site, 'GCM-1',qty,0)) "inti_gcm",
sum(decode(site, 'SMG-1',qty,0)) "inti_smg",
sum(decode(site, 'SJE-1',qty,0)) "inti_sje",
sum(decode(site, 'SBE-1',qty,0)) "inti_sbe",
sum(decode(site, 'SLM-1',qty,0)) "inti_slm",
sum(decode(intiplasma, '1',qty,0)) "inti_total",
sum(decode(site, 'GCM-0',qty,0)) "plasma_gcm",
sum(decode(site, 'SMG-0',qty,0)) "plasma_smg",
sum(decode(site, 'SJE-0',qty,0)) "plasma_sje",
sum(decode(site, 'SBE-0',qty,0)) "plasma_sbe",
sum(decode(site, 'SLM-0',qty,0)) "plasma_slm",
sum(decode(intiplasma, '0',qty,0)) "plasma_total",
sum(qty) "total"
from
(select tglmasuk, site||'-'|| intiplasma site, intiplasma, sum(totalqty) qty
from NOTAANGKUTBUAH_CONSOL where tglmasuk BETWEEN trunc(TO_DATE (   :p_date,
                                                      'dd-mm-yyyy'
                                                     ),'mm')
                                         AND TO_DATE (   :p_date,
                                                      'dd-mm-yyyy'
                                                     )
group by tglmasuk, site, intiplasma
)
`;


const fetchData = async function (users, routes, params, callback) {

  binds = {};
  //binds.p_date = "11-04-2022"
  binds.p_date = (!params.p_date ? '' : params.p_date)

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

