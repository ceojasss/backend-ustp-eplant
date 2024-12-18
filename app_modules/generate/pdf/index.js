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

const paymentslip = require('./paymentvoucherslip')
const test = require('./test')
const journalvoucher = require('./journalvoucher')
const receivenote = require('./goodreceivenote')
const evaluasivendor = require('./evaluasivendor')
const siv_rdf = require('./siv_rdf')
const siv_solar = require('./siv_solar')
const purchaserequest = require('./purchaserequest')
const goodreceivenotebpb = require('./goodreceivenotebpb')


// routing report 
router.route(`/paymentvoucher`)
    .get(paymentslip.get)

router.route(`/receivenote`)
    .get(receivenote.get)

router.route(`/journalvoucher`)
    .get(journalvoucher.get)

router.route(`/evaluasivendor`)
    .get(evaluasivendor.get)


router.route(`/test`)
    .get(test.get)

router.route(`/siv_rdf`)
    .get(siv_rdf.get)

router.route(`/siv_solar`)
    .get(siv_solar.get)

router.route(`/purchaserequest`)
    .get(purchaserequest.get)

router.route(`/goodreceivenotebpb`)
    .get(goodreceivenotebpb.get)

    //goodreceivenotebpb

module.exports = router;