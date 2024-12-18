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
const parametermasterpurchasing = require("./ParameterMasterPurchasing/Controller")
const purchaseitem = require("./PurchaseItem/Controller")
const suppliervisitation = require("./SupplierVisitation/Controller")

router.route(`/setuppurchaseitem`)
    .get(purchaseitem.get)
    .post(purchaseitem.post)
    .put(purchaseitem.update)
    .delete(purchaseitem.hapus)

router.route(`/supplierpurchasing`)
    .get(setupsuppliermaster.get)
    .post(setupsuppliermaster.post)
    .put(setupsuppliermaster.update)
    .delete(setupsuppliermaster.hapus)

router.route(`/parameterpurchasing`)
    .get(parametermasterpurchasing.get)
    .post(parametermasterpurchasing.post)
    .put(parametermasterpurchasing.put)

router.route(`/parameterpurchasing/detail`)
    .get(parametermasterpurchasing.getDetail)

    router.route(`/suppliervisitation`)
    .get(suppliervisitation.get)
    .post(suppliervisitation.post)
    .put(suppliervisitation.update)
    .delete(suppliervisitation.hapus)


module.exports = router;