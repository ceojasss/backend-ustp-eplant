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

const DataLegalLimbahCair = require('../Trx/DataLegalLimbahCair/Controller')
const DataLegalLimbahPadat = require('../Trx/DataLegalLimbahPadat/Controller')
const DataLegalPemakaianAir = require('../Trx/DataLegalPemakaianAir/Controller')
const Taxefaktur = require('../Trx/TaxEfaktur/Controller')
const Closing = require('../Trx/Closing/Controller');


router.route(`/limbahcair`)
    .get(DataLegalLimbahCair.get)
    .put(DataLegalLimbahCair.put)

router.route(`/limbahcair/detail`)
    .get(DataLegalLimbahCair.getDetail)

router.route(`/limbahpadat`)
    .get(DataLegalLimbahPadat.get)
    .put(DataLegalLimbahPadat.put)

router.route(`/limbahpadat/detail`)
    .get(DataLegalLimbahPadat.getDetail)

router.route(`/pemakaianair`)
    .get(DataLegalPemakaianAir.get)
    .put(DataLegalPemakaianAir.put)

router.route(`/pemakaianair/detail`)
    .get(DataLegalPemakaianAir.getDetail)


router.route(`/efaktur`)
    .post(Taxefaktur.exportFaktur)
    .get(Taxefaktur.get)

router.route(`/efaktur/detail`)
    .get(Taxefaktur.getDetail)

router.route(`/closing`)
    .get(Closing.get)
    .post(Closing.post)

router.route(`/closing/view`)
    .get(Closing.getViewData)


module.exports = router;