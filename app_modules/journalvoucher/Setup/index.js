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

const setupbatchmaster = require("./batchjournalmaster/Controller");

router
  .route(`/batchjournal`)
  .get(setupbatchmaster.get)
  .post(setupbatchmaster.post)
  .put(setupbatchmaster.update)
  .delete(setupbatchmaster.hapus);
router.route(`/batchjournal/:id`).delete(setupbatchmaster.hapus);

router
  .route(`/batchjournal`)
  .get(setupbatchmaster.get)
  .post(setupbatchmaster.post)
  .put(setupbatchmaster.update)
  .delete(setupbatchmaster.hapus);

module.exports = router;
