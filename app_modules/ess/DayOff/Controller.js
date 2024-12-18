/*=============================================================================
 |       Author:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                -
 |                -
 |                -
 |
 |  Description:  Handling API ROUTE Untuk Module CashBank
 |
 | Dependencies:  express     --> webserver framework 
 |                body-parser --> parsing semua request http menjadi JSON
 |                passport    --> library authentication untuk login. (Login menggunakan JWT)
 |                
 |
 *===========================================================================*/



 const _ = require('lodash')
 const { insertdataHandler, deleteDataHandler, updatedataHandler, sendResult } = require('../../../util/HelperUtility')
 const CrudhandlerDB = require('../../../oradb/dbCrudHandler')
 const stsg_db = require('./DatabaseHandler')
 
 const table = 'hr_dayoff'
 
 async function get(req, res, next) {
     let err, results
     await stsg_db.fetchdata(req.user, req.route.path.replace("/", ""), (error, result) => {
         if (error) {
             err = error
         }
         else {
             results = result
         }
     })
 
     if (err) {
         res.json({ "errorMessage": err })
     } else {
         sendResult(results, res)
     }
 
 
 }
 
 async function post(req, res, next) {
    const stmt = req;
    const binds = req;


    let rows;
    let errors;


    //  const table = ['JOURNALVOUCHER', 'JVDETAILS']

   const tableemail = `select key_cuti, id_cuti from hr_dayoff where id_cuti in (select max(id_cuti) from hr_dayoff where empcode = '${req.user.empcode}' and approvedby1 is null)`

    try {
        await CrudhandlerDB.createMasterEmail(table,tableemail, req.user, req.body, binds)
            .then((result) => {
                //   console.log(req.body)

                if (result.error) {
                    errors = result;
                    // res.status(500).json(errors)
                } else {
                    rows = result;
                }
            })
            .catch((error) => {
                //console.log('error kita', error.message)

                //            errors = error
                console.log('error --> ', error, '<---')
                res.status(200).json({ error: error.message, detail: error.stack });
            });

        //console.log(`return -> ${ context.user}`)

        //console.log(`not null -> ${rows} , ${JSON.stringify(rows[0])}`)
        //console.log('error', errors)

        //        res.send(errors)

        res.status(200).json(rows);
    } catch (error) {
        console.log(error)
        res.status(200).json({ data: [] });
    }
 }
 
 async function update(req, res, next) {
     await updatedataHandler(table, req, res)
 }
 
 async function hapus(req, res, next) {
     await deleteDataHandler(table, req, res);
 }
 
 module.exports = {
     hapus, get, post, update
 }