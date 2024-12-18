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

const SetupBlockMaster = require('./SetupBlockMaster/Controller')
const SetupFieldCrop = require('./SetupFieldCrop/Controller')
const ParameterMasterFOP = require('./ParameterMasterFOP/Controller')
const TphMaster= require('./TPHMaster/Controller')
const BlockMasterOrganization = require('./SetupBlockMasterOrganization/Controller')
const BlockMasterUsage =require('./BlockMasterUsage/Controller')
const JalurEmdek =require('./JalurEmdek/Controller')

router.route(`/blockmaster`)
    .get(SetupBlockMaster.get)
    .post(SetupBlockMaster.post)
    .put(SetupBlockMaster.update)
    .delete(SetupBlockMaster.hapus)

router.route(`/fieldcrop`)
    .get(SetupFieldCrop.get)
    .post(SetupFieldCrop.post)
    .put(SetupFieldCrop.update)
    .delete(SetupFieldCrop.hapus)

router.route(`/parameterfop`)
    .get(ParameterMasterFOP.get)
    .post(ParameterMasterFOP.post)
    .put(ParameterMasterFOP.put)

router.route(`/parameterfop/detail`)
    .get(ParameterMasterFOP.getDetail)

    router.route(`/tphmaster`)
    .get(TphMaster.get)
    .post(TphMaster.post)
    .put(TphMaster.update)
    .delete(TphMaster.hapus)

    router.route(`/blockorganization`)
    .get(BlockMasterOrganization.get)
    .post(BlockMasterOrganization.post)
    .put(BlockMasterOrganization.put)

router.route(`/blockorganization/detail`)
    .get(BlockMasterOrganization.getDetail)

    router.route(`/blockusage`)
    .get(BlockMasterUsage.get)
    .post(BlockMasterUsage.post)
    .put(BlockMasterUsage.put)

router.route(`/blockusage/detail`)
    .get(BlockMasterUsage.getDetail)

    router.route(`/jaluremdek`)
    .get(JalurEmdek.get)
    .post(JalurEmdek.post)
    .put(JalurEmdek.put)
    .delete(JalurEmdek.hapus)


router.route(`/jaluremdek/detail`)
    .get(JalurEmdek.getDetail)




module.exports = router;