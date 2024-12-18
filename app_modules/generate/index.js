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
const spreadsheet = require('./spreadsheet')
const pdf = require('./pdf')

router.use('/spreadsheet', spreadsheet)
router.use('/pdf', pdf)


module.exports = router;