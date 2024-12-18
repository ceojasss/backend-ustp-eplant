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

const workshopactivity = require('./WorkshopActivity/Controller')
const workorderactivity = require('./WorkOrderActivity/Controller')
const wocompletion = require('./WoCompletion/Controller')
const workshoporder = require('./WorkshopOrder/Controller')



router.route(`/workshopactivity`)
    .get(workshopactivity.get)
    .post(workshopactivity.post)
    .put(workshopactivity.put)


router.route(`/workshopactivity/detail`)
    .get(workshopactivity.getDetail)


router.route(`/workorderactivity`)
    .get(workorderactivity.get)
    .post(workorderactivity.post)
    .put(workorderactivity.put)


router.route(`/workorderactivity/detail`)
    .get(workorderactivity.getDetail)

    router.route(`/wocompletion`)
    .get(wocompletion.get)
    .post(wocompletion.post)
    .put(wocompletion.update)
    
    router.route(`/wocompletion/detail`)
    .get(wocompletion.getDetail)

    router.route(`/wocompletion/view`)
    .get(wocompletion.getViewData)
    router.route(`/wocompletion/view/detail`)
    .get(wocompletion.getViewDataDetail)

    router.route(`/workshoporder`)
    .get(workshoporder.get)
    .post(workshoporder.post)
    .put(workshoporder.update)
    .delete(workshoporder.hapus)


module.exports = router;