const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

const QueryPT = `select to_char(tdate, 'dd') month, case when sum(tbsolah) = 0 then null else sum(production)/sum(tbsolah) * 100000 end oer
from 
(
select site, tdate, ffbprocessed tbsolah, 0 production from epms_ustp.ffbprocess_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm') and to_date(:p_date,'dd-mm-yyyy')
union all
select pks site, tdate, 0, production from productstoragedetail_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm') and to_date(:p_date,'dd-mm-yyyy') and site = :site
and productcode = 'PK'
)
group by to_char(tdate, 'dd')
order by to_char(tdate, 'dd')

`;


const QueryNonPT = `select to_char(tdate, 'dd') month, case when sum(tbsolah) = 0 then null else sum(production)/sum(tbsolah) * 100000 end oer
from 
(
select site, tdate, ffbprocessed tbsolah, 0 production from epms_ustp.ffbprocess_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm') and to_date(:p_date,'dd-mm-yyyy')
union all
select pks site, tdate, 0, production from productstoragedetail_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm') and to_date(:p_date,'dd-mm-yyyy')
and productcode = 'PK'
)
group by to_char(tdate, 'dd')
order by to_char(tdate, 'dd')

`


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
