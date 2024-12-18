/*=============================================================================
 |       Author:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                -
 |                -
 |                -
 |                  
 |  Description:  Handling API ROUTE Untuk Module Machine
 |
 | Dependencies:  express     --> webserver framework 
 |                body-parser --> parsing semua request http menjadi JSON
 |                passport    --> library authentication untuk login. (Login menggunakan JWT)
 |                
 |
 *===========================================================================*/
const router = require('express').Router();
const dbcontroller = require('./controller/Controller')


router.route(`/*`)
    .get(dbcontroller.get)


module.exports = router;