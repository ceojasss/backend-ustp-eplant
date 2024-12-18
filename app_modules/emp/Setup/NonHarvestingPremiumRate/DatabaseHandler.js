const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = `SELECT  v.rowid "rowid",
v.jobcode "jobcode",
v.basicunits  "basicunits",
v.mrate "mrate",
v.m1rate "m1rate",
v.premiumrate "premiumrate",
v.alldedcode "alldedcode",
v.alldedcodehip "alldedcodehip",
v.alldedcodesku "alldedcodesku",
v.alldedcodebhl "alldedcodebhl",
v.fridaybasicunits "fridaybasicunits",
v.fridaypremiumrate "fridaypremiumrate",
v.formula "formula",
v.emptype "emptype",
v.inputby "inputby",
to_char(v.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate",
v.updateby "updateby",
to_char(v.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate",
v.basicassignment "basicassignment",
a.jobdescription "job description",
g.description "allowance description",
p.PARAMETERVALUE "parametervalue"
FROM empnonharvpremiumrate v, job a, allowded g,parametervalue p
WHERE     v.jobcode = a.jobcode
AND v.alldedcode = g.allowdedcode
AND v.emptype = g.emptype
AND p.parametercode='EMP01'
AND v.emptype = p.PARAMETERVALUECODE
ORDER BY v.jobcode`;



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