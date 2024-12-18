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

const infrastructurestatus = require('./InfrastructureStatus/Controller')
const infrastructureprogress = require('./InfrastructureProgress/Controller')



router.route(`/infrastructurestatus`)
    .get(infrastructurestatus.get)
    .post(infrastructurestatus.post)
    .put(infrastructurestatus.put)
router.route(`/infrastructurestatus/detail`)
    .get(infrastructurestatus.getDetail)

router.route(`/infrastructureprogress`)
    .get(infrastructureprogress.get)
    .post(infrastructureprogress.post)
    .put(infrastructureprogress.put)
router.route(`/infrastructureprogress/detail`)
    .get(infrastructureprogress.getDetail)




module.exports = router;
