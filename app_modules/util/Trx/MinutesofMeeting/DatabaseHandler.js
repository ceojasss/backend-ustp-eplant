const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

// const baseQuery = ` select CONTROLJOB "controljob", GROUPCODE "groupcode",
// GROUPDESCRIPTION "groupdescription", LEVELCODE "levelcode", PARENTCODE "parentcode"
// from stockgroup `

const baseQuery = `select 
x.ROWID "rowid",
to_char(TDATE,'dd-mm-yyyy') "tdate", 
TTIME "ttime", 
AREA "area", 
LOCATION "location", 
AGENDA "agenda", 
ATTENDEE "attendee", 
SUMMARY_MOM "summary_mom", 
FOTO1 "foto1", 
FOTO2 "foto2", 
FOTO3 "foto3", 
FOTO4 "foto4", 
FOTO5 "foto5", 
uniq "uniq",
x.INPUTBY "inputby", 
to_char(x.INPUTDATE,'dd-mm-yyyy hh24:mi') "inputdate", 
x.UPDATEBY "updateby", 
to_char(x.UPDATEDATE,'dd-mm-yyyy hh24:mi') "updatedate"
--x.TID "tid" 
from mom x, epmsapps.userprofile y, empmasterepms z,(SELECT   id_position userpos, p.department userdept
                        FROM   epmsapps.userprofile u,
                               empmasterepms e,
                               mas_position p
                       WHERE       u.email = e.empcode
                               AND loginid = :loginid
                               AND code = id_position) u
WHERE x.inputby = loginid
and y.email = empcode
AND x.inputby = decode(userdept,'BOD',x.inputby,'IT',x.inputby, :loginid)
and (TDATE LIKE UPPER('%'||: search || '%')
OR TTIME LIKE UPPER('%'||: search || '%')
OR UPPER(location) LIKE UPPER('%'||: search || '%')
OR UPPER(area) LIKE UPPER('%'||: search || '%')
OR UPPER(agenda) LIKE UPPER('%'||: search || '%')
OR UPPER(summary_mom) LIKE UPPER('%'||: search || '%')
OR empname LIKE UPPER('%'||: search || '%')
OR x.inputby LIKE UPPER('%'||: search || '%')
)
order by tdate desc`





const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}

    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)

    let result

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)

        //console.log(result)
    } catch (error) {
        callback(error, '')
    }

    callback('', result)
}

const getUniq = async function (users, routes, params, callback) {

    binds = {}
// console.log(params)
// 'L05805','HA',12
    /**
   * ! change the parameters according to the table
   */
    // binds.fieldcode = (!params.fieldcode ? '' : params.fieldcode)


    let result

    // console.log(users.loginid)

    //    (users, statement, binds, opts = {})
    try {
// console.log(binds)
        // const stmt = `select check_ha_cr ('L05805','HA',12) "ha" from dual`
        const stmt = `SELECT   DBMS_RANDOM.string ('U', 20) "uniq" FROM DUAL`

        result = await database.siteWithDefExecute(users, routes, stmt, binds)
        

    } catch (error) {
        callback(error)
    }

    callback('', result)
}



module.exports = {
    fetchDataHeader,
    getUniq
}


