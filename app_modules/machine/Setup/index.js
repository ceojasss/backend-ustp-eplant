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

const machineinformation = require('./MachineInformation/Controller')
const parametermastermachine = require('./ParameterMasterMachine/Controller')


router.route(`/machineinformation`)
    .get(machineinformation.get)
    .post(machineinformation.post)
    .put(machineinformation.update)
    .delete(machineinformation.hapus)

router.route(`/parametermachine`)
    .get(parametermastermachine.get)
    .post(parametermastermachine.post)
    .put(parametermastermachine.put)

router.route(`/parametermachine/detail`)
    .get(parametermastermachine.getDetail)

module.exports = router;