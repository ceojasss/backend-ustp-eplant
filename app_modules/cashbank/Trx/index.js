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

const paymentvoucher = require('./PaymentVoucher/Controller')
const receivevoucher = require('./ReceiveVoucher/Controller')
const permintaananggaran = require('./PermintaanAnggaran/Controller')
const pettycash = require('./PettyCash/Controller')
const reimbursepettycash = require('./ReimbursePettyCash/Controller')


router.route(`/paymentvoucher`)
    .get(paymentvoucher.get)
    .post(paymentvoucher.post)
    .put(paymentvoucher.put)

router.route(`/paymentvoucher/detail`)
    .get(paymentvoucher.getDetail)

router.route(`/paymentvoucher/approve`)
    .put(paymentvoucher.approve)



router.route(`/receivevoucher`)
    .get(receivevoucher.get)
    .post(receivevoucher.post)
    .put(receivevoucher.put)

router.route(`/receivevoucher/detail`)
    .get(receivevoucher.getDetail)

router.route(`/permintaananggaran`)
    .get(permintaananggaran.get)
    .post(permintaananggaran.post)
    .delete(permintaananggaran.hapus)
    .put(permintaananggaran.update)


router.route(`/pettycash`)
    .get(pettycash.get)
    .post(pettycash.post)
    .put(pettycash.put)

router.route(`/pettycash/detail`)
    .get(pettycash.getDetail)

router.route(`/pettycash/approve`)
    .put(pettycash.approve)


router.route(`/reimbursepettycash`)
    .get(reimbursepettycash.get)
    .post(reimbursepettycash.post)
    .put(reimbursepettycash.put)

router.route(`/reimbursepettycash/detail`)
    .get(reimbursepettycash.getDetail)

router.route(`/reimbursepettycash/link`)
    .get(reimbursepettycash.getLinkedData)

router.route(`/reimbursepettycash/link/detail`)
    .get(reimbursepettycash.getLinkedDataDetails)

router.route(`/reimbursepettycash/approve`)
    .put(paymentvoucher.approve)



module.exports = router;