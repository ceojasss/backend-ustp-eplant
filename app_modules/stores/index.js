/*=============================================================================
 |       Author:  Gunadi Rismananda
 |         Dept:  IT - USTP
 |          
 |  Description:  Handling API ROUTE Untuk Module CashBank
 |
 | Dependencies:  express     --> webserver framework 
 |                body-parser --> parsing semua request http menjadi JSON
 |                passport    --> library authentication untuk login. (Login menggunakan JWT)
 |                
 |
 *===========================================================================*/
 const router = require('express').Router();

 const setup = require('./Setup')
 const trx = require('./Trx')
 
 /* router.route(`/bankinformation`)
     .get(bankinformation.get)
     .post(bankinformation.post)
 
 router.route(`/paymentvoucher`)
     .get(paymentvoucher.get)
  */
 router.use('/setup', setup)
 router.use('/trx', trx)
 
 module.exports = router;
 