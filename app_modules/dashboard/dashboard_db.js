const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../oradb/dbHandler')

const baseQuery = `SELECT trx.name, SUM (totaldata) total
FROM (  SELECT 'Payment Voucher' Name, COUNT (*) totaldata, inputby
          FROM paymentvoucher
      GROUP BY inputby
      UNION ALL
        SELECT 'Receive Voucher', COUNT (*) totaldata, inputby
          FROM receivevoucher
      GROUP BY inputby) trx,
     userprofile u
WHERE     U.LOGINID = :USERID
     AND (   (usertype = 'USR' AND U.LOGINID = TRX.INPUTBY)
          OR (usertype IN ('ADM', 'ASU') AND 1 = 1)) 
GROUP BY trx.name ORDER BY trx.name ASC`




const fetchData = async function (users, callback) {

    let result

    binds = {}
    binds.userid = users.loginid

    try {
        result = await database.siteExecute(users, baseQuery, binds)
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