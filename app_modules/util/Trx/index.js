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

const approval = require('./approval/Controller')
const approvallhm = require('./LhmApproval/Controller')
const mom = require('../../util/Trx/MinutesofMeeting/Controller')

router.route(`/approval`)
    .get(approval.get)
    .post(approval.post)
    .put(approval.put)

router.route(`/approval/detail`)
    .get(approval.getDetail)

router.route(`/lhmapproval`)
    .get(approvallhm.get)
    .post(approvallhm.post)
    .put(approvallhm.put)

router.route(`/lhmapproval/detail`)
    .get(approvallhm.getDetail)


    router.route(`/mom`)
    .get(mom.get)
    .post(mom.post)
    .put(mom.update)
    .delete(mom.hapus)
router.route(`/mom/uniq`)
.get(mom.getUniq)
module.exports = router;