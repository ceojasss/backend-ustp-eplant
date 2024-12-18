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

const journalvoucher = require('./journalvoucher/Controller')
const debitnote=require('./DebitNote/Controller')

router.route(`/journalvoucher`)
    .get(journalvoucher.get)
    .post(journalvoucher.post)
    .put(journalvoucher.put)

router.route(`/journalvoucher/detail`)
    .get(journalvoucher.getDetail)

router.route(`/debitnote`)
    .get(debitnote.get)
    .post(debitnote.post)
    .put(debitnote.put)

router.route(`/debitnote/detail`)
    .get(debitnote.getDetail)


module.exports = router;