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

 const stsg_db = require("./DatabaseHandler");
 const dbhandler = require("../../../../oradb/dbHandler");
 const { result, reject } = require("lodash");
 const e = require("express");
 
 const table = "LPO";
 async function get(req, res, next) {
   await stsg_db.fetchdata(
     req.user,
     req.route.path.replace("/", ""),
     (error, result) => {
       if (error) {
         return next(error);
       }
       res.send(result);
     }
   );
 }
 
 module.exports.get = get;
 
 async function post(req, res, next) {
   const stmt = req;
   const binds = req;
   // console.log(binds.body)
   let rows;
   let errors;
 
   try {
     await dbhandler
       .insertdata(table, req.user, req.body, binds)
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
         res.status(200).json({ error: error.message, detail: error.stack });
       });
 
     //console.log(`return -> ${ context.user}`)
 
     //console.log(`not null -> ${rows} , ${JSON.stringify(rows[0])}`)
     //console.log('error', errors)
 
     //        res.send(errors)
 
     res.status(200).json(rows);
   } catch (error) {
     res.status(200).json({ data: [] });
   }
 }
 
 module.exports.post = post;
 
 async function update(req, res, next) {
   const binds = req;
   try {
     await dbhandler
       .updateData(table, req.user, req.body, binds)
       .then((result) => {
         //console.log('hasil ', result)
 
         if (result.error) {
           errors = result;
         } else {
           rows = result;
         }
       })
       .catch((error) =>
         res.status(200).json({ error: error.message, detail: error.stack })
       );
 
     //console.log('hasils ', result)
 
     res.status(200).json(rows);
   } catch (error) {
     console.log(error);
     res.status(200).json({ data: [] });
   }
 }
 
 module.exports.update = update;
 
 async function hapus(req, res, next) {
   // const stmt = req
   //   const binds = req
 
   let rows;
   let errors;
 
   // console.log(req.params.id)
   // console.log(req.query.id)
 
   let dataid = req.query.id;
 
   try {
     await dbhandler
       .deleteData(table, req.user, dataid)
       .then((result) => {
         console.log("result delete ", result);
 
         if (result.error) {
           errors = result;
           // res.status(500).json(errors)
         } else {
           rows = result;
         }
       })
       .catch((error) => {
         res.status(200).json({ error: error.message, detail: error.stack });
       });
 
     res.status(200).json(rows);
   } catch (error) {
     res.status(200).json({ data: [], error: error });
   }
 }
 
 module.exports.hapus = hapus;
 