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

const machineactivity = require('./MachineActivity/Controller')



router.route(`/machineactivity`)
    .get(machineactivity.get)
    .put(machineactivity.put)
    .post(machineactivity.post)



router.route(`/machineactivity/detail`)
    .get(machineactivity.getDetail)




module.exports = router;