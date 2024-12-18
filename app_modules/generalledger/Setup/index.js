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
const commodityprice = require('./commodityprice/Controller')

router.route(`/commodityprice`)
    .get(commodityprice.get)
    .post(commodityprice.post)
    .put(commodityprice.put)

router.route(`/commodityprice/detail`)
    .get(commodityprice.getDetail)


module.exports = router;