/*=============================================================================
 |       Author:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                -
 |                -
 |                -
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

const setupcustomermaster = require('./CustomerMaster/Controller')
const parametermastersales = require('./ParameterMasterSales/Controller')


router.route(`/customer`)
    .get(setupcustomermaster.get)
    .post(setupcustomermaster.post)
    .put(setupcustomermaster.update)
    .delete(setupcustomermaster.hapus)

router.route(`/parametersales`)
    .get(parametermastersales.get)
    .post(parametermastersales.post)
    .put(parametermastersales.put)

router.route(`/parametersales/detail`)
    .get(parametermastersales.getDetail)


module.exports = router;