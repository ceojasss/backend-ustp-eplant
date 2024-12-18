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

const fadisposal = require('./FaDisposal/Controller')
const faclearingaddition = require("./FAClearingAddition/Controller")
const famaturitystatement = require('./FAMaturityStatement/Controller')
const farepair = require('./FaRepair/Controller')
const cipaddition = require('./CIPAddition/Controller')

router.route(`/cipaddition`)
    .get(cipaddition.get)

router.route(`/cipaddition/detail`)
    .get(cipaddition.getDetail)

router.route(`/farepair`)
    .get(farepair.get)

router.route(`/farepair/detail`)
    .get(farepair.getDetail)

router.route(`/maturitystatement`)
    .get(famaturitystatement.get)

router.route(`/maturitystatement/detail`)
    .get(famaturitystatement.getDetail)

router.route(`/faclearingaddition`)
    .get(faclearingaddition.get)

router.route(`/faclearingaddition/detail`)
    .get(faclearingaddition.getDetail)

router.route(`/fadisposal`)
    .get(fadisposal.get)



module.exports = router;