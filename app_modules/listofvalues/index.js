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

const _ = require('lodash');
const { Decryptor } = require('../../util/HelperUtility');
const router = require('express').Router();

const db = require('./lov_db')
const query = require('./queries')



router.route(`/:params`)
    .get(

        async function get(req, res, next) {

            let responseResult

            await db.fetchDataDynamic(req.user, req.query, query[req.params.params],
                (error, result) => {
                    if (!_.isEmpty(error)) {
                        responseResult = error;
                    }
                    else {
                        responseResult = result;
                    }
                })

            res.send(responseResult)

        }

    )

module.exports = router;

router.route(`/report/custom`)
    .get(

        async function get(req, res, next) {
            let responseResult

            const stmt = await Decryptor(req.query.q)


            //  console.log('STATEMENT', stmt)


            await db.fetchDatas(req.user, stmt,
                (error, result) => {
                    if (!_.isEmpty(error)) {
                        responseResult = error;
                    }
                    else {
                        responseResult = result;
                    }
                })

            res.send(responseResult)

        }

    )

module.exports = router;

/* lov dengan user login sebagai extra parameter
 */
router.route(`/:params/user`)
    .get(

        async function get(req, res, next) {

            let responseResult


            let binding = _.assignIn(req.query, { loginid: req.user.loginid })

            //   console.log(binding)

            await db.fetchDataDynamic(req.user, req.query, query[req.params.params],
                (error, result) => {
                    if (!_.isEmpty(error)) {
                        responseResult = error;
                    }
                    else {
                        responseResult = result;
                    }
                })

            res.send(responseResult)

        }

    )

module.exports = router;
