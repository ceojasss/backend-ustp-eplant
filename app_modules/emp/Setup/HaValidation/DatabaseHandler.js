const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = `select x.rowid "rowid", x.jobcode "jobcode#code",getjob_des(x.jobcode) "jobcode#description", x.emptype "emptype", x.inputby "inputby",
to_char(x.inputdate,'dd-mm-yyyy hh24:mi') inputdate, x.updateby "updateby",
 to_char(x.updatedate,'dd-mm-yyyy hh24:mi') updatedate from empcontrolactivity x, job j
where x.jobcode= j.jobcode 
order by x.jobcode`




const fetchdata = async function (users, route, callback) {

    binds = {}

    let result

    // console.log(route)

    try {
        result = await database.siteWithDefExecute(users, route, baseQuery, binds)
        //console.log(result)
    } catch (error) {
        callback(error, '')
    }

    callback('', result)
}




module.exports = {
    fetchdata
}