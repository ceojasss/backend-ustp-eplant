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

const vehicleactivity = require('./VehicleActivity/Controller')
const verifintrans = require('./VerifIntrans/Controller')
const vehicleavailability = require('./VehicleAvailability/Controller')


router.route(`/vehicleactivity`)
    .get(vehicleactivity.get)
    .post(vehicleactivity.post)
    .put(vehicleactivity.put)
    .delete(vehicleactivity.hapus)


router.route(`/vehicleactivity/detail`)
    .get(vehicleactivity.getDetail)

router.route(`/vehicleactivity/mavh`)
    .post(vehicleactivity.Updatemavh)

router.route(`/verifintrans`)
    .get(verifintrans.get)
    .post(verifintrans.post)
    .put(verifintrans.put)
    .delete(verifintrans.hapus)


router.route(`/verifintrans/detail`)
    .get(verifintrans.getDetail)
    router.route(`/verifintrans/detaillimit`)
    .get(verifintrans.getDetailLimit)

    router.route(`/verifintrans/detailbydate`)
    .get(verifintrans.getDetailByDate)

router.route(`/vehicleactivity/detaillimit`)
    .get(vehicleactivity.getDetailLimit)

router.route(`/vehicleactivity/detailbydate`)
    .get(vehicleactivity.getDetailByDate)



router.route(`/vehicleavailabilitynew`)
    .get(vehicleavailability.get)
    .put(vehicleavailability.put)
    .post(vehicleavailability.post)



router.route(`/vehicleavailabilitynew/detail`)
    .get(vehicleavailability.getDetail)

router.route(`/vehicleavailabilitynew/generatevh`)
    .post(vehicleavailability.init_vh)

module.exports = router;