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

const router = require("express").Router();

const setupworkshopinfo = require("./stworkshop/Controller");

router
  .route(`/stworkshop`)
  .get(setupworkshopinfo.get)
  .post(setupworkshopinfo.post)
  .put(setupworkshopinfo.update)
  .delete(setupworkshopinfo.hapus);

router.route(`/stworkshop/:id`).delete(setupworkshopinfo.hapus);
module.exports = router;
