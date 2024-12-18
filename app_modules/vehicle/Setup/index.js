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

const setupvehiclemaster = require('./VehicleMaster/Controller')
const setupvehicledocument = require('./VehicleDocument/Controller')
const setupvehiclegroup = require('./VehicleGroup/Controller')
const parametermastervehicle = require('./ParameterMasterVehicle/Controller')

router.route(`/vehiclemaster`)
    .get(setupvehiclemaster.get)
    .post(setupvehiclemaster.post)
    .put(setupvehiclemaster.update)
    .delete(setupvehiclemaster.hapus)
    
router.route(`/vehicledocument`)
    .get(setupvehicledocument.get)
    .post(setupvehicledocument.post)
    .put(setupvehicledocument.update)
    // .delete(setupvehiclemaster.hapus)

    
router.route(`/vehicledocument`)
    .get(setupvehicledocument.get)
    .post(setupvehicledocument.post)
    .put(setupvehicledocument.update)
    .delete(setupvehicledocument.hapus)
 
router.route(`/vehiclegroup`)
    .get(setupvehiclegroup.get)
    .post(setupvehiclegroup.post)
    .put(setupvehiclegroup.update)
    .delete(setupvehiclegroup.hapus)

router.route(`/parametervehicle`)
    .get(parametermastervehicle.get)
    .post(parametermastervehicle.post)
    .put(parametermastervehicle.put)

router.route(`/parametervehicle/detail`)
    .get(parametermastervehicle.getDetail)

module.exports = router;