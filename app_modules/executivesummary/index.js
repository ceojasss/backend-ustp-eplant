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
const content = require('./content');
const contentvalue = require('./contentvalue');

const singlecontent = require('./singlecontent');
const managementreport = require('./managementreport')
const generate = require('./generate')
const generatedoc = require('./generatedoc')

router.use('/content', content)
router.use('/contentvalue', contentvalue)
router.use('/managementreport', managementreport)
router.use('/singlecontent', singlecontent)
router.use('/generate', generate)
router.use('/generatedata', generatedoc)

module.exports = router;