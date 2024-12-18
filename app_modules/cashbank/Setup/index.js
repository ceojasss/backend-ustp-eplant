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

 const bankinformation = require('./BankInformation/Controller')
 const contractorbank = require('./ContractorBank/Controller')
 
 
 router.route(`/bankinformation`)
     .get(bankinformation.get)
     .post(bankinformation.post)
     .delete(bankinformation.hapus)
     .put(bankinformation.update)
 
 router.route(`/bankinformation/formcomponent`)
     .get(bankinformation.getFormComponent)
 
 
 router.route(`/bankinformation/:id`)
     .delete(bankinformation.hapus)


 router.route(`/contractorbank`)
     .get(contractorbank.get)
     .post(contractorbank.post)
     .put(contractorbank.update)
     .delete(contractorbank.hapus)
 
 module.exports = router;
 