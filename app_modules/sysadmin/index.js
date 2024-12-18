/*=============================================================================
 |       Author:  Gunadi Rismananda
 |         Dept:  IT - USTP
 |          
 |  Description:  Handling API ROUTE Untuk List Value Data.
 |
 | Dependencies:  express     --> webserver framework 
 |                body-parser --> parsing semua request http menjadi JSON
 |                passport    --> library authentication untuk login. (Login menggunakan JWT)
 |                
 |
 *===========================================================================*/

const router = require('express').Router();
const oracledb = require('oracledb');
const _ = require('lodash')

const { getdbCreds } = require('../../oradb/dbHandler');

router.route(`/dbstatistic`)
    .get(
        async function get(req, res, next) {
            const ret = []

            //            console.log(req.user)

            try {
                dbConnection = getdbCreds(req.user.site)

                conn = await oracledb.getConnection(dbConnection);

                //console.log(conn)

                res.send(conn)

            } catch (err) {
                console.error(err);
            } finally {
                if (conn) { // conn assignment worked, need to close
                    try {
                        await conn.close()
                    } catch (err) {
                        // console.log(err)
                        reject(err)
                    }
                }
            }


        }
    )

module.exports = router;