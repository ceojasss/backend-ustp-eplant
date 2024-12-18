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

const setupfagroupmaster = require('./fagroupmaster/Controller')
const setuptaxmaster = require('./fataxmaster/Controller')
const setupfamaster = require('./FaMaster/Controller')
const parametermasterfa = require('./ParameterMasterFA/Controller')

router.route(`/famaster`)
    .get(setupfamaster.get)
    .post(setupfamaster.post)
    .put(setupfamaster.update)
    .delete(setupfamaster.hapus)

router.route(`/fataxgroup`)
    .get(setuptaxmaster.get)
    .post(setuptaxmaster.post)
    .put(setuptaxmaster.update)
    .delete(setuptaxmaster.hapus)

router.route(`/fagroup`)
    .get(setupfagroupmaster.get)
    .post(setupfagroupmaster.post)
    .put(setupfagroupmaster.update)
    .delete(setupfagroupmaster.hapus)
    
router.route(`/parameterfixedasset`)
    .get(parametermasterfa.get)
    .post(parametermasterfa.post)
    .put(parametermasterfa.put)

router.route(`/parameterfixedasset/detail`)
    .get(parametermasterfa.getDetail)

router.route(`/parameterfixedasset`)
    .get(parametermasterfa.get)
    .post(parametermasterfa.post)
    .put(parametermasterfa.put)

router.route(`/parameterfixedasset/detail`)
    .get(parametermasterfa.getDetail)


module.exports = router;