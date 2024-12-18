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

const storeadjusment = require('./StoreAdjusment/Controller')
const materialrequest = require('./MaterialRequest/Controller')
const returntostore = require('./ReturnToStore/Controller')
const writeoffvoucher = require('./WriteOffVoucher/Controller')
const transfervoucher = require('./TransferVoucher/Controller')
const transferreceivevoucher = require('./TransferReceiveVoucher/Controller')
const finishgoodstockledger = require('./FinishGoodStockledger/Controller')
const storeissuevoucher = require('./StoreIssueVoucher/Controller')
const wipstockledger = require('./WipStockledger/Controller')
const stockitem = require("./StockItem/Controller")
const updatesiv = require('./UpdateSiv/Controller')


router.route(`/storeadjusment`)
    .get(storeadjusment.get)
    .post(storeadjusment.post)
    .put(storeadjusment.put)


router.route(`/storeadjusment/detail`)
    .get(storeadjusment.getDetail)

router.route(`/materialrequest`)
    .get(materialrequest.get)
    .post(materialrequest.post)
    .put(materialrequest.put)
router.route(`/materialrequest/detail`)
    .get(materialrequest.getDetail)
router.route(`/materialrequest/emdek`)
    .get(materialrequest.getEMDEK)

router.route(`/returntostore`)
    .get(returntostore.get)
    .post(returntostore.post)
    .put(returntostore.put)


router.route(`/returntostore/detail`)
    .get(returntostore.getDetail)

router.route(`/writeoffvoucher`)
    .get(writeoffvoucher.get)

router.route(`/writeoffvoucher/detail`)
    .get(writeoffvoucher.getDetail)

router.route(`/transfervoucher`)
    .get(transfervoucher.get)
    .post(transfervoucher.post)
    .put(transfervoucher.put)

router.route(`/transfervoucher/detail`)
    .get(transfervoucher.getDetail)



router.route(`/transferreceivevoucher`)
    .get(transferreceivevoucher.get)
    .post(transferreceivevoucher.post)
    .put(transferreceivevoucher.put)


router.route(`/transferreceivevoucher/detail`)
    .get(transferreceivevoucher.getDetail)

    router.route(`/transferreceivevoucher/crdata`)
    .get(transferreceivevoucher.crdata)



    router.route(`/siv`)
    .get(storeissuevoucher.get)
    .post(storeissuevoucher.post)

router.route(`/siv/detail`)
    .get(storeissuevoucher.getDetail)

router.route(`/siv/link`)
    .get(storeissuevoucher.getLinkedData)

router.route(`/siv/link/detail`)
    .get(storeissuevoucher.getLinkedDataDetails)


router
    .route(`/finishgoodstockledger`)
    .get(finishgoodstockledger.get)
    .post(finishgoodstockledger.post)
    .put(finishgoodstockledger.update)
    .delete(finishgoodstockledger.hapus);
router
    .route(`/wipstockledger`)
    .get(wipstockledger.get)
    .post(wipstockledger.post)
    .put(wipstockledger.put)

    router.route(`/wipstockledger/detail`)
    .get(wipstockledger.getDetail)

    router.route(`/stockitem`)
    .get(stockitem.get)
    .post(stockitem.post)
    .put(stockitem.update)
    .delete(stockitem.hapus)

    router.route(`/updatesiv`)
    .get(updatesiv.get)
    .post(updatesiv.post)
    .delete(updatesiv.hapus)
    .put(updatesiv.update)

module.exports = router;