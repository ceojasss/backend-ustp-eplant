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

const infrastructure = require('./infrastructure/Controller')
const infratype = require('./Infratype/Controller')
const infrasubtype = require('./Infrasubtype/Controller')


router.route(`/infrasubtype`)
    .get(infrasubtype.get)
    .post(infrasubtype.post)
    .put(infrasubtype.update)
    .delete(infrasubtype.hapus)

router.route(`/infratype`)
    .get(infratype.get)
    .post(infratype.post)
    .put(infratype.update)
    .delete(infratype.hapus)

router.route(`/infrastructure`)
    .get(infrastructure.get)
    .post(infrastructure.post)
    .put(infrastructure.put)
router.route(`/infrastructure/detail`)
    .get(infrastructure.getDetail)

    

module.exports = router;