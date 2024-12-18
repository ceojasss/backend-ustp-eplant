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

const dbhandler = require('../../oradb/dbHandler')
const router = require('express').Router();

router.route(`/formcomponent/:params`)
    .get(
        async function get(req, res, next) {
            console.log(req.params.params)

            try {

                await dbhandler.getFormComponents(req.user, req.params.params).then(result => {

                    //   console.log(req.body)

                    if (result.error) {
                        errors = result
                        // res.status(500).json(errors)
                    } else {
                        rows = result
                    }

                }).catch(error => {

                    res.status(200).json({ 'error': error.message, 'detail': error.stack })
                });


                //console.log(`return -> ${ context.user}`)

                //console.log(`not null -> ${rows} , ${JSON.stringify(rows[0])}`)
                //console.log('error', errors)

                //        res.send(errors)

                res.status(200).json({ formComps: rows })

            } catch (error) {
                res.send(error)
            }


        }
    )

router.route(`/formcomponent/single/:params`)
    .get(
        async function get(req, res, next) {
            console.log('apps', req.params.params)

            try {

                await dbhandler.getFormComponent(req.user, req.params.params).then(result => {


                    if (result.error) {
                        errors = result

                    } else {
                        rows = result
                    }

                    res.status(200).json({ formComps: rows })

                }).catch(error => {

                    res.status(200).json({ 'error': error.message, 'detail': error.stack })
                });

                //   

            } catch (error) {
                res.send(error)
            }


        }
    )



module.exports = router;