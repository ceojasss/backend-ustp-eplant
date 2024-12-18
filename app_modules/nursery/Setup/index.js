/*=============================================================================
 |       Author:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                -
 |                -
 |                -
 |          
 |  Description:  Handling API ROUTE Untuk Module Nursery
 |
 | Dependencies:  express     --> webserver framework 
 |                body-parser --> parsing semua request http menjadi JSON
 |                passport    --> library authentication untuk login. (Login menggunakan JWT)
 |                
 |
 *===========================================================================*/

const router = require('express').Router();

const setupnurserymaster = require('./NurseryMaster/Controller')
const parameternursery = require('./ParameterMasterNursery/Controller')

router.route(`/nurserymaster`)
    .get(setupnurserymaster.get)
    .post(setupnurserymaster.post)
    .put(setupnurserymaster.update)
    .delete(setupnurserymaster.hapus)

router.route(`/parameternursery`)
    .get(parameternursery.get)
    .post(parameternursery.post)
    .put(parameternursery.put)

router.route(`/parameternursery/detail`)
    .get(parameternursery.getDetail)


module.exports = router;