const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `  SELECT   b.iftype, b.iftypename, b.controljob, c.ifsubtype, c.ifsubtypename,
a.ifcode, a.ifname, TO_NUMBER (a.LENGTH) LENGTH, a.width,
a.width_uom, a.installdate, a.developmentcost, a.volume,
a.volume_uom, a.estate, a.division, e.divisionname, a.length_uom,
a.development_uom, a.blockid,
TO_DATE (TO_CHAR (NVL(a.inactivedate,a.inactive_date), 'dd-Mon-yyyy')) inactive_date,
f.locationtype, f.locationcode, 
f.distributionaccount,
getjob_des (f.distributionaccount) jobdes,
g.locationtype locationtype_rawat, g.locationcode locationcode_rawat, 
g.distributionaccount distributionaccount_rawat,
getjob_des (g.distributionaccount) jobdes_rawat
FROM infrastructure a,
infrastructuretype b,
infrastructuresubtype c,
ORGANIZATION e,
infrastructurecostdist_b f,
infrastructurecostdist_r g
WHERE b.iftype = DECODE (:P_IFTYPE, 'ALL', b.iftype, :P_IFTYPE)
AND c.ifsubtype = DECODE (:P_IFSUBTYPE, 'ALL', c.ifsubtype, :P_IFSUBTYPE)
AND a.iftype = b.iftype
AND b.iftype = c.iftype
AND a.ifcode = f.ifcode(+)
AND a.ifcode = g.ifcode(+)
AND a.iftype = c.iftype
AND a.ifsubtype = c.ifsubtype
AND a.estate = e.departmentcode
AND a.estate = NVL (:P_ESTATE, a.estate)
AND a.division = e.divisioncode
AND a.division = NVL (:P_DIVISION, a.division)
ORDER BY ifcode`




const fetchDataDynamic = async function (users, find, callback) {
    let result, error, fillStatement

    // custom code
    // if (find.report === 'M') {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TMONTH ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // } else {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TODATE ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // }


    //let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
    let bindStatement = _.pick(find, ['P_IFTYPE', 'P_IFSUBTYPE', 'P_ESTATE', 'P_DIVISION'])

    try {
        result = await database.executeStmt(users, queryStatement, bindStatement)

    } catch (errors) {

        error = errors
    }


    callback(error, result)
}


module.exports = {
    fetchDataDynamic
}
