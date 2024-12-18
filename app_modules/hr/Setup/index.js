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
 const parametermasterhr = require('./ParameterMasterHr/Controller')
 
 router.route(`/parameterhr`)
     .get(parametermasterhr.get)
     .post(parametermasterhr.post)
     .put(parametermasterhr.put)
     
 router.route(`/parameterhr/detail`)
     .get(parametermasterhr.getDetail)
 
 module.exports = router;