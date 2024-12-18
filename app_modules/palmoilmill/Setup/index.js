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

const station = require('./SetupStation/Controller')
const parametermasterpom = require('./ParameterMasterPOM/Controller')
const productstorage = require('./ProductStorage/Controller')

router.route(`/station`)
    .get(station.get)
    .post(station.post)
    .put(station.update)
    .delete(station.hapus)


router.route(`/parameterpom`)
    .get(parametermasterpom.get)
    .post(parametermasterpom.post)
    .put(parametermasterpom.put)

router.route(`/parameterpom/detail`)
    .get(parametermasterpom.getDetail)

    router.route(`/productstorage`)
    .get(productstorage.get)
    .post(productstorage.post)
    .put(productstorage.update)
    .delete(productstorage.hapus)



module.exports = router;