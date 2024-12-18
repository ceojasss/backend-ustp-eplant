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

const nurseryrequest = require('./NurseryRequest/Controller')
const nurseryissue = require('./NurseryIssue/Controller')
const nurseryreturn = require('./NurseryReturn/Controller')


router.route(`/nurseryrequest`)
    .get(nurseryrequest.get)
    .post(nurseryrequest.post)
    .put(nurseryrequest.put)

router.route(`/nurseryrequest/detail`)
    .get(nurseryrequest.getDetail)


router.route(`/nurseryissue`)
    .get(nurseryissue.get)
    .post(nurseryissue.post)
    .put(nurseryissue.put)
router.route(`/nurseryissue/detail`)
    .get(nurseryissue.getDetail)

    // router.route(`/nurseryissue/crdata`)
    // .get(nurseryissue.crdata)

    router.route(`/nurseryreturn`)
    .get(nurseryreturn.get)
    .put(nurseryreturn.put)
    .post(nurseryreturn.post)
router.route(`/nurseryreturn/detail`)
    .get(nurseryreturn.getDetail)



module.exports = router;