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
const _ = require('lodash')
const dbhandler = require('../../oradb/dbHandler')
const router = require('express').Router();


router.route(`/:params`)
    .get(
        async function get(req, res, next) {
            //  console.log(req.params.params)
            let responseResult
            try {

                await dbhandler.getReportComponent('report', req.user, req.params.params).then(result => {

                    //   console.log(req.body)

                    if (result.error) {
                        responseResult = result
                        // res.status(500).json(errors)
                    } else {
                        responseResult = result
                    }

                }).catch(error => {

                    responseResult = {
                        'code': 'error 123',
                        'error': error.message,
                        'detail': error.stack
                    }

                });




                res.status(200).json({
                    data: responseResult
                })

            } catch (error) {
                console.log(error)
                res.send(error)
            }


        }
    )



router.route(`/:params/:registryid`)
    .get(
        async function get(req, res, next) {
            let responseResult
            try {

                await dbhandler.getReportComponentDetail('report', req.user, req.params.params, req.params.registryid).then(result => {

                    if (result.error) {
                        responseResult = result
                    } else {
                        responseResult = { data: result }
                    }

                }).catch(error => {
                    responseResult = {
                        'error': error.message,
                        'detail': error.stack,
                    }
                });

                res.send(responseResult)
            } catch (error) {
                res.send(error)
            }


        }
    )



module.exports = router;