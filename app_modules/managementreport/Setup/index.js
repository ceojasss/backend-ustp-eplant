/*=============================================================================
 |       Author:  Gunadi Rismananda
 |         Dept:  IT - USTP
 |          
 |  Description:  Management Report - Cpo Price
 |
 | Dependencies:  express     --> webserver framework 
 |                body-parser --> parsing semua request http menjadi JSON
 |                passport    --> library authentication untuk login. (Login menggunakan JWT)
 |                
 |
 *===========================================================================*/

 const router = require('express').Router();
 const cpoprice = require('./cpoprice/Controller')
 
 router.route(`/cpoprice`)
     .get(cpoprice.get)


 
 module.exports = router;