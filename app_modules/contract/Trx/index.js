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

const contractinvoicetuslah = require('./ContractInvoiceTuslah/Controller')
const contractrequest = require('./ContractRequest/Controller')
const invoicecontract = require('./InvoiceContract/Controller')
const perintahkerja = require('./PerintahKerja/Controller')
const perintahkerjatuslah = require('./PerintahKerjaTuslah/Controller')
const workinprogress = require('./WorkInProgress/Controller')
const contractprogress = require('./ContractProgress/Controller')
const contractprogresstuslah = require('./ContractProgressTuslah/Controller')
const contractrequestho = require('./ContractRequestHO/Controller')
const proformacontract = require('./ProformaContract/Controller')

//* 1. @ Contract Invoice Tuslah  
router.route(`/contractinvoicetuslah`)
    .get(contractinvoicetuslah.get)

router.route(`/contractinvoicetuslah/detail`)
    .get(contractinvoicetuslah.getDetail)

//* 2. @ Perintah Kerja 
router.route(`/perintahkerja`)
    .get(perintahkerja.get)
    .post(perintahkerja.post)
    .put(perintahkerja.put)

router.route(`/perintahkerja/detail`)
    .get(perintahkerja.getDetail)

router.route(`/perintahkerja/crdata`)
    .get(perintahkerja.crdata)


//* 3. @ Perintah Kerja Tuslah 
router.route(`/perintahkerjatuslah`)
    .get(perintahkerjatuslah.get)
    .post(perintahkerjatuslah.post)
    .put(perintahkerjatuslah.put)

router.route(`/perintahkerjatuslah/detail`)
    .get(perintahkerjatuslah.getDetail)

router.route(`/perintahkerjatuslah/crdata`)
    .get(perintahkerjatuslah.crdata)

//* 4. @ Contract Request 
router.route(`/contractrequest`)
    .get(contractrequest.get)
    .post(contractrequest.post)
    .put(contractrequest.put)

router.route(`/contractrequest/detail`)
    .get(contractrequest.getDetail)

router.route(`/contractrequest/getha`)
    .get(contractrequest.getHA)

router.route(`/contractrequest/getplant`)
    .get(contractrequest.getHectPlanted)

//* 5. @ Contract Invoice
router.route(`/invoicecontract`)
    .get(invoicecontract.get)
    .post(invoicecontract.post)
    .put(invoicecontract.put)
router.route(`/invoicecontract/detail`)
    .get(invoicecontract.getDetail)
router.route(`/invoicecontract/link`)
    .get(invoicecontract.getLinkedData)

router.route(`/invoicecontract/link/detail`)
    .get(invoicecontract.getLinkedDataDetails)


//* 6. @ Work In Progress
router.route(`/workinprogress`)
    .get(workinprogress.get)

router.route(`/workinprogress/detail`)
    .get(workinprogress.getDetail)

//* 7. @ Contract Progress
router.route(`/contractprogress`)
    .get(contractprogress.get)
    .post(contractprogress.post)
    .put(contractprogress.put)

router.route(`/contractprogress/detail`)
    .get(contractprogress.getDetail)

router.route(`/contractprogress/crdata`)
    .get(contractprogress.crdata)

//* 6. @ Contract Progress Tuslah
router.route(`/contractprogresstuslah`)
    .get(contractprogresstuslah.get)

router.route(`/contractprogresstuslah/detail`)
    .get(contractprogresstuslah.getDetail)

router.route(`/contractprogresstuslah/cadata`)
    .get(contractprogresstuslah.cadata)


//* 7. @ Contract Request HO 
router.route(`/contractrequestho`)
    .get(contractrequestho.get)
    .post(contractrequestho.post)
    .put(contractrequestho.put)

router.route(`/contractrequestho/detail`)
    .get(contractrequestho.getDetail)

//* 8. @ Proforma Contract 
router.route(`/proformacontract`)
    .get(proformacontract.get)
    .post(proformacontract.post)
    .put(proformacontract.put)

router.route(`/proformacontract/detail`)
    .get(proformacontract.getDetail)


module.exports = router;