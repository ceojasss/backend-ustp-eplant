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

const table = 'apps_component'
router.route(`/adminpanel/:params`)
    .get(
        async function get(req, res, next) {
            console.log(req.params.params)

            try {

                await dbhandler.getAdminComponent(req.user, req.params.params).then(result => {

                    //   console.log(req.body)

                    if (result.error) {
                        errors = result
                        // res.status(500).json(errors)
                    } else {
                        rows = result
                    }

                }).catch(error => {

                    res.status(200).json({
                        'error': error.message,
                        'detail': error.stack
                    })
                });


                //console.log(`return -> ${ context.user}`)

                //console.log(`not null -> ${rows} , ${JSON.stringify(rows[0])}`)
                //console.log('error', errors)

                //        res.send(errors)

                res.status(200).json({
                    data: rows
                })

            } catch (error) {
                res.send(error)
            }


        }
    )
router.route(`/adminpanel/:params`)
    .put(
        async function update(req, res, next) {
            // const table = req.params.params
            // const table = JSON.stringify(router.stack[0].params.params).replaceAll('"','')
            // console.log(req.params.params)
            const binds = req
            // console.log(table,binds)
            try {
                await dbhandler.updateDataAdmin(table, req.user, req.body, binds).then(result => {

                    console.log('hasil ', result) 

                    if (result.error) {
                        errors = result
                    } else {
                        rows = result
                    }

                }).catch(error => res.status(200).json({
                    'error': error.message,
                    'detail': error.stack
                }));

                //console.log('hasils ', result)

                res.status(200).json(rows)

            } catch (error) {
                console.log(error)
                res.status(200).json({
                    data: []
                });
            }

        }
    )
router.route(`/adminpanel/:params`)
    .post(
        async function post(req, res, next) {
            // const table = req.params.params
            const stmt = req
            const binds = req

            let rows
            let errors

            try {
                await dbhandler.insertdata(table, req.user, req.body, binds).then(result => {

                    //   console.log(req.body)

                    if (result.error) {
                        errors = result
                        // res.status(500).json(errors)
                    } else {
                        rows = result
                    }

                }).catch(error => {
                    //console.log('error kita', error.message)

                    //            errors = error
                    res.status(200).json({
                        'error': error.message,
                        'detail': error.stack
                    })
                });


                //console.log(`return -> ${ context.user}`)

                //console.log(`not null -> ${rows} , ${JSON.stringify(rows[0])}`)
                //console.log('error', errors)

                //        res.send(errors)

                res.status(200).json(rows)

            } catch (error) {
                res.status(200).json({
                    data: []
                });
            }
        }
    )
router.route(`/adminpanel/:params`)
    .delete(
        
        async function hapus(req, res, next) {
            // const table = 'apps_component'
            // const table = 'bank'
        
            // const stmt = req
            //   const binds = req
            // const table = req.params.params
            let rows
            let errors
        
            // console.log(req.params.id)
            // console.log(req.query.id)
        
            let dataid = req.query.id
        
            try {
        
                await dbhandler.deleteData(table, req.user, dataid).then(result => {
        
                    console.log('result delete ', result)
        
                    if (result.error) {
                        errors = result
                        // res.status(500).json(errors)
                    } else {
                        rows = result
                    }
        
                }).catch(error => {
                    res.status(200).json({ error: error.message, detail: error.stack })
                });
        
                res.status(200).json(rows)
        
            } catch (error) {
                res.status(200).json({ data: [], error: error });
            }
        
        
        
        } 
    )
    
    


module.exports = router;