/*=============================================================================
 |       Author:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                -
 |                -
 |                -
 |          
 |  Description:  Handling API ROUTE Untuk Module Nursery
 |
 | Dependencies:  express     --> webserver framework 
 |                body-parser --> parsing semua request http menjadi JSON
 |                passport    --> library authentication untuk login. (Login menggunakan JWT)
 |                
 |
 *===========================================================================*/

const router = require('express').Router();

const setupstockgroup = require('./SetupContractor/Controller')
const parametermastercontract = require('./ParameterMasterContract/Controller')

router.route(`/contractor`)
    .get(setupstockgroup.get)
    .post(setupstockgroup.post)
    .put(setupstockgroup.update)
    .delete(setupstockgroup.hapus)

router.route(`/parametercontract`)
    .get(parametermastercontract.get)
    .post(parametermastercontract.post)
    .put(parametermastercontract.put)

router.route(`/parametercontract/detail`)
    .get(parametermastercontract.getDetail)


module.exports = router;