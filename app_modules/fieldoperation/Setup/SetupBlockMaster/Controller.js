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
 const { insertdataHandler, deleteDataHandler, updatedataHandler, sendResult } = require('../../../../util/HelperUtility')
 
 const stsg_db = require('./DatabaseHandler')
 
 const table = 'blockmaster'
 
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
     await insertdataHandler(table, req, res)
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