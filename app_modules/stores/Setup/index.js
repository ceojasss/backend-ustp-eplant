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

const setupstockgroup = require('./stsetupstockgroup/Controller')
const setupstoreinformation = require('./SetupInventory/Controller')
const parametermasterstores = require('./ParameterMasterStores/Controller')


router.route(`/storeinformation`)
    .get(setupstoreinformation.get)
    .post(setupstoreinformation.post)
    .delete(setupstoreinformation.hapus)
    .put(setupstoreinformation.update)

router.route(`/stsetupstockgroup`)
    .get(setupstockgroup.get)
    .post(setupstockgroup.post)
    .delete(setupstockgroup.hapus)
    .put(setupstockgroup.update)

router
    .route(`/parameterstores`)
    .get(parametermasterstores.get)
    .post(parametermasterstores.post)
    .put(parametermasterstores.put)

router.route(`/parameterstores/detail`)
    .get(parametermasterstores.getDetail)


module.exports = router;