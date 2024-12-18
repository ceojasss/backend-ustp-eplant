const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

const QueryPT = `select 'OER' "description", 		
case when sum(tbsolah_hi) = 0 then null else sum(prod_hi)/sum(tbsolah_hi) * 100000 end "oer_hi",		
case when sum(tbsolah_bi) = 0 then null else sum(prod_bi)/sum(tbsolah_bi) * 100000 end "oer_bi",		
case when sum(tbsolah_sbi) = 0 then null else sum(prod_sbi)/sum(tbsolah_sbi) * 100000 end "oer_sbi"		
from 		
(		
select site, 		
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then ffbprocessed else 0 end) tbsolah_hi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then ffbprocessed else 0 end) tbsolah_bi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then ffbprocessed else 0 end) tbsolah_sbi,		
0 prod_hi,0 prod_bi,0 prod_sbi		
from EPMS_USTP.ffbprocess_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')		
union all		
select pks site, 0,0,0,		
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_hi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_bi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_sbi		
from productstoragedetail_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')		
and productcode = 'CPO'		
)		
union all		
select 		
productcode||' '||'Production' description, sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then production else 0 end) hi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) bi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) sbi		
from productstoragedetail_consol		
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')		
and productcode = 'CPO'		
group by productcode		
union all		
select 		
productcode||' '||'Dispatch' description, sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then dispatch else 0 end) hi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then dispatch else 0 end) bi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then dispatch else 0 end) sbi		
from productstoragedetail_consol		
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')		
and productcode = 'CPO'		
group by productcode		
union all		
select 		
productcode||' '||'Stock' description, sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then ending else 0 end) hi,		
null bi,		
null sbi		
from productstoragedetail_consol		
where tdate = to_date(:p_date,'dd-mm-yyyy')		
and productcode = 'CPO'		
group by productcode		
union all		
select 		
'Total Oil, Losses/FFB' description, 		
avg(hi) hi, 		
avg(bi/c_bi) bi,		
avg(sbi/c_sbi) sbi		
from		
(		
select		
site,		
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then value else null end) hi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then value else null end) bi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') and NVL(value,0) <>0 and INDICATORCODE = '01' then 1 else 0 end) c_bi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then value else 0 end) sbi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy')  and to_date(:p_date,'dd-mm-yyyy') and NVL(value,0) <>0 and INDICATORCODE = '01' then 1 else 0 end) c_sbi		
from EPMS_USTP.V_OIL_PK_LOSSES_consol 		
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')		
and subsubgroupcode = '01'
and site = :site		
group by site		
)	

`;


const QueryNonPT = `select 'OER' "description", 		
case when sum(tbsolah_hi) = 0 then null else sum(prod_hi)/sum(tbsolah_hi) * 100000 end "oer_hi",		
case when sum(tbsolah_bi) = 0 then null else sum(prod_bi)/sum(tbsolah_bi) * 100000 end "oer_bi",		
case when sum(tbsolah_sbi) = 0 then null else sum(prod_sbi)/sum(tbsolah_sbi) * 100000 end "oer_sbi"		
from 		
(		
select site, 		
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then ffbprocessed else 0 end) tbsolah_hi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then ffbprocessed else 0 end) tbsolah_bi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then ffbprocessed else 0 end) tbsolah_sbi,		
0 prod_hi,0 prod_bi,0 prod_sbi		
from EPMS_USTP.ffbprocess_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')		
union all		
select pks site, 0,0,0,		
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_hi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_bi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_sbi		
from productstoragedetail_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')		
and productcode = 'CPO'		
)		
union all		
select 		
productcode||' '||'Production' description, sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then production else 0 end) hi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) bi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) sbi		
from productstoragedetail_consol		
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')		
and productcode = 'CPO'		
group by productcode		
union all		
select 		
productcode||' '||'Dispatch' description, sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then dispatch else 0 end) hi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then dispatch else 0 end) bi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then dispatch else 0 end) sbi		
from productstoragedetail_consol		
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')		
and productcode = 'CPO'		
group by productcode		
union all		
select 		
productcode||' '||'Stock' description, sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then ending else 0 end) hi,		
null bi,		
null sbi		
from productstoragedetail_consol		
where tdate = to_date(:p_date,'dd-mm-yyyy')		
and productcode = 'CPO'		
group by productcode		
union all		
select 		
'Total Oil, Losses/FFB' description, 		
avg(hi) hi, 		
avg(bi/c_bi) bi,		
avg(sbi/c_sbi) sbi		
from		
(		
select		
site,		
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then value else null end) hi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then value else null end) bi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') and NVL(value,0) <>0 and INDICATORCODE = '01' then 1 else 0 end) c_bi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then value else 0 end) sbi,		
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy')  and to_date(:p_date,'dd-mm-yyyy') and NVL(value,0) <>0 and INDICATORCODE = '01' then 1 else 0 end) c_sbi		
from EPMS_USTP.V_OIL_PK_LOSSES_consol 		
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')		
and subsubgroupcode = '01'
group by site		
)
`


const fetchData = async function (users, params, routes, callback) {
  binds = {};
  // binds.limitsize = (!params.size ? 0 : params.size)
  // binds.page = (!params.page ? 1 : params.page)
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
