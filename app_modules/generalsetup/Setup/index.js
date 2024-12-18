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

const setupsuppliermaster = require('./SupplierMaster/Controller')
const currencydailyrate = require('./CurrencyDailyRate/Controller')
const setupcurrencymaster = require('./CurrencyMaster/Controller')


router.route(`/supplier`)
    .get(setupsuppliermaster.get)
    .post(setupsuppliermaster.post)
    .put(setupsuppliermaster.update)
    .delete(setupsuppliermaster.hapus)

    router.route(`/currencydailyrate`)
    .get(currencydailyrate.get)
    .post(currencydailyrate.post)
    .put(currencydailyrate.put)

router.route(`/currencydailyrate/detail`)
    .get(currencydailyrate.getDetail)

    router.route(`/currencymaster`)
    .get(setupcurrencymaster.get)
    .post(setupcurrencymaster.post)
    .put(setupcurrencymaster.update)
    .delete(setupcurrencymaster.hapus)



module.exports = router;