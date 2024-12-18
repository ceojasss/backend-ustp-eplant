const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../oradb/dbHandler')


const baseQuery = `SELECT VENDORCODE "vendorcode",
VENDORNAME "vendorname",
VENDORTYPE "vendortype",
ADDRESS "address",
CITY "city",
POSTALCODE "postalcode",
STATE "state",
COUNTRY "country",
EMAIL "email",
REMARKS "remarks"
FROM (SELECT SUPPLIERCODE         VENDORCODE,
        SUPPLIERNAME         VENDORNAME,
        'SUPPPLIER'          VENDORTYPE,
        ADDRESS,
        CITY,
        POSTALCODE,
        STATE,
        COUNTRY,
        EMAIL,
        REMARKS
   FROM epmsapps.supplier
 UNION
 SELECT CONTRACTORCODE         VENDORCODE,
        CONTRACTORNAME         VENDORNAME,
        'CONTRACTOR'           VENDORTYPE,
        ADDRESS,
        CITY,
        POSTALCODE,
        STATE,
        COUNTRY,
        EMAIL,
        REMARKS
   FROM epmsapps.CONTRACTOR)
WHERE VENDORCODE = :id`



async function get(req, res, nex) {

    let result

    binds = {}
    binds.id = req.params.id

    users = req.user


    try {
        result = await database.siteExecute(users, baseQuery, binds)
        res.send(
            // 
            result
            // count: (!_.isEmpty(result) ? result['data'][0]['total_rows'] : 0)
        )

    } catch (error) {
        res.send(error)
        //callback(error, '')
    }

}

module.exports = {
    get
}