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

const purchaserequest = require('./PurchaseRequest/Controller')
const purchaseorder = require('./PurchaseOrder/Controller')
const proformapurchaseorder = require('./ProformaPurchaseOrder/Controller')
const receivenote = require('./ReceiveNote/Controller')
const returnnote = require('./ReturnNote/Controller')
const invoicewithoutpo = require('./InvoiceWithoutPO/Controller')
const purchaseordercancel = require('./PurchaseOrderCancel/Controller')
const purchaseordertransport = require('./PurchaseOrderTransport/Controller')
const invoice = require('./Invoice/Controller')
const forceclosepo = require('./ForceClosePO/Controller')
const penerimaanprp = require('./PenerimaanPRProcurement/Controller')
const forceclosepr = require('./ForceClosePR/Controller')
const potransportexpedition = require('./POTransportExpedition/Controller')
const penerimaanprao = require('./PenerimaanPRAO/Controller')
const returnnotenongrn = require('./ReturnNoteNonGRN/Controller')
const approvalform = require('./ApprovalForm/Controller')
const purchaseordercontract = require('./PurchaseOrderContract/Controller')
const evaluasisupplier = require('./EvaluasiSupplier/Controller')
const evalvendor = require('./EvaluasiVendor/Controller')

router.route(`/purchaserequest`)
    .get(purchaserequest.get)
    .post(purchaserequest.post)
    .put(purchaserequest.put)

// ? purchase Order 

router.route(`/purchaserequest/detail`)
    .get(purchaserequest.getDetail)

router.route(`/purchaseorder`)
    .get(purchaseorder.get)
    .post(purchaseorder.post)
    .put(purchaseorder.put)


router.route(`/purchaseorder/detail`)
    .get(purchaseorder.getDetail)

router.route(`/purchaseorder/link`)
    .get(purchaseorder.getLinkedData)

router.route(`/purchaseorder/link/detail`)
    .get(purchaseorder.getLinkedDataDetails)

router.route(`/proformapurchaseorder`)
    .get(proformapurchaseorder.get)
    .post(proformapurchaseorder.post)
    .put(proformapurchaseorder.put)

router.route(`/proformapurchaseorder/getagreement`)
    .get(proformapurchaseorder.getAgreement)
router.route(`/proformapurchaseorder/approve`)
    .post(proformapurchaseorder.postapp)

router.route(`/proformapurchaseorder/detail`)
    .get(proformapurchaseorder.getDetail)

router.route(`/proformapurchaseorder/link`)
    .get(proformapurchaseorder.getLinkedData)

router.route(`/proformapurchaseorder/link/detail`)
    .get(proformapurchaseorder.getLinkedDataDetails)



router.route(`/receivenote`)
    .get(receivenote.get)
    .post(receivenote.post)
    .put(receivenote.put)

router.route(`/receivenote/getsack`)
    .get(receivenote.getSack)
    

router.route(`/receivenote/detail`)
    .get(receivenote.getDetail)

router.route(`/receivenote/link/detail`)
    .get(receivenote.getLinkedDataDetails)

router.route(`/receivenote/link`)
    .get(receivenote.getLinkedData)


router.route(`/returnnote`)
    .get(returnnote.get)
    .post(returnnote.post)
    .put(returnnote.put)

router.route(`/returnnote/detail`)
    .get(returnnote.getDetail)
    router.route(`/returnnote/getsack`)
    .get(returnnote.getSack)

router.route(`/invoicewpo`)
    .get(invoicewithoutpo.get)
    .post(invoicewithoutpo.post)
    .put(invoicewithoutpo.put)

router.route(`/invoicewpo/detail`)
    .get(invoicewithoutpo.getDetail)

router.route(`/purchaseordercancel`)
    .get(purchaseordercancel.get)

router.route(`/purchaseordercancel/detail`)
    .get(purchaseordercancel.getDetail)

router.route(`/purchaseordertransport`)
    .get(purchaseordertransport.get)

router.route(`/purchaseordertransport/detail`)
    .get(purchaseordertransport.getDetail)

//* 5. @ Contract Invoice
router.route(`/invoice`)
    .get(invoice.get)
    .post(invoice.post)
    .put(invoice.put)
router.route(`/invoice/detail`)
    .get(invoice.getDetail)
    router.route(`/invoice/link`)
    .get(invoice.getLinkedData)

router.route(`/invoice/link/detail`)
    .get(invoice.getLinkedDataDetails)


router.route(`/forceclosepo`)
    .get(forceclosepo.get)
    .post(forceclosepo.post)


router.route(`/forceclosepo/detail`)
    .get(forceclosepo.getDetail)



router.route(`/potransportexpedition`)
    .get(potransportexpedition.get)
    .post(potransportexpedition.post)
    .put(potransportexpedition.put)

// ? purchase Order 

router.route(`/potransportexpedition/detail`)
    .get(potransportexpedition.getDetail)

router.route(`/returnnotenongrn`)
    .get(returnnotenongrn.get)
    .put(returnnotenongrn.update)
    .post(returnnotenongrn.post)
    .delete(returnnotenongrn.hapus)

router.route(`/approvalform`)
    .get(approvalform.get)
    .put(approvalform.update)
    .post(approvalform.post)
    .delete(approvalform.hapus)

router.route(`/penerimaanprp`)
    .get(penerimaanprp.get)

router.route(`/penerimaanprp/detail`)
    .get(penerimaanprp.getDetail)

router.route(`/forceclosepr`)
    .get(forceclosepr.get)
    .post(forceclosepr.post)

router.route(`/forceclosepr/detail`)
    .get(forceclosepr.getDetail)

router.route(`/penerimaanprao`)
    .get(penerimaanprao.get)

router.route(`/penerimaanprao/detail`)
    .get(penerimaanprao.getDetail)


router.route(`/pocontract`)
    .get(purchaseordercontract.get)
    .put(purchaseordercontract.update)
    .post(purchaseordercontract.post)
    .delete(purchaseordercontract.hapus)

router.route(`/pocontract/approve`)
.post(purchaseordercontract.postapp)

router.route(`/evalsupplier`)
    .get(evaluasisupplier.get)
    .post(evaluasisupplier.post)
    .put(evaluasisupplier.put)

router.route(`/evalsupplier/crdata`)
    .get(evaluasisupplier.crdata)

router.route(`/evalsupplier/detail`)
    .get(evaluasisupplier.getDetail)

router.route(`/evalvendor`)
    .get(evalvendor.get)
    .put(evalvendor.update)

router.route(`/evalvendor/sendemail`)
    .get(evalvendor.sendEmail)

// tes aja hehe
module.exports = router;