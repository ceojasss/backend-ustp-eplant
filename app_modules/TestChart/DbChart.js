const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../oradb/dbHandler')

const Query = `select
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_hi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_sbi
from productstoragedetail_consol
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'dd') and to_date(:p_date,'dd-mm-yyyy')
and productcode = 'FFB'`

const fetchData = async function (users, callback) {

    let result

    binds = {}
    binds.p_date = '11-04-2018'
// console.log(Query)
    try {
        result = await database.siteExecute(users,Query, binds)
    } catch (error) {
        callback(error, '')
    }

    if (_.isEmpty(result))
        return callback('', [])


    callback('', result.rows)
}

module.exports = {
    fetchData
}