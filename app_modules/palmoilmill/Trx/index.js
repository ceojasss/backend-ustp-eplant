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

const ffbgrading = require('./FFBGrading/Controller')


router.route(`/ffbgrading`)
    .get(ffbgrading.get)
    .post(ffbgrading.post)
    .put(ffbgrading.put)

router.route(`/ffbgrading/crdata`)
    .get(ffbgrading.crdata)

router.route(`/ffbgrading/detail`)
    .get(ffbgrading.getDetail)



module.exports = router;