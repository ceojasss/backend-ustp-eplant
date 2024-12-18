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

const dailyplanting = require('./DailyPlanting/Controller')
const plantingcompletion = require('./PlantingCompletion/Controller')
const supplying = require('./Supplying/Controller')
const supplyingcompletion = require('./SupplyingCompletion/Controller')
const rainfall = require('./Rainfall/Controller')
const harvestingtransport = require('./HarvestingTransport/Controller')
const restanadjustment = require('./RestanAdjustment/Controller')
const alokasipersentasebbc = require('./AlokasiPersentaseBBC/Controller')
const landacquisition = require('./LandAcquisition/Controller')
const classblocknew = require('./ClassBlockNew/Controller')
const lossespanen = require('./LossesPanen/Controller')
const oilpalmtreecensusnew = require('./OilpalmTreeCensusNew/Controller')
const progresslc = require('./ProgressLC/Controller')
const analisabuah = require('./AnalisaBuah/Controller')

router.route(`/bbcpercentage`)
    .get(alokasipersentasebbc.get)
    .post(alokasipersentasebbc.post)
    .put(alokasipersentasebbc.update)
    .delete(alokasipersentasebbc.hapus)

router.route(`/analisabuah`)
    .get(analisabuah.get)
    .post(analisabuah.post)
    .put(analisabuah.update)
    .delete(analisabuah.hapus)

router.route(`/dailyplanting`)
    .get(dailyplanting.get)
    .post(dailyplanting.post)
    .put(dailyplanting.put)

router.route(`/dailyplanting/detail`)
    .get(dailyplanting.getDetail)


router.route(`/plantingcompletion`)
    .get(plantingcompletion.get)
router.route(`/plantingcompletion/detail`)
    .get(plantingcompletion.getDetail)

router.route(`/supplying`)
    .get(supplying.get)
router.route(`/supplying/detail`)
    .get(supplying.getDetail)


router.route(`/supplyingcompletion`)
    .get(supplyingcompletion.get)
router.route(`/supplyingcompletion/detail`)
    .get(supplyingcompletion.getDetail)

router.route(`/rainfall`)
    .get(rainfall.get)
router.route(`/rainfall/detail`)
    .get(rainfall.getDetail)

router.route(`/harvestingtransport`)
    .get(harvestingtransport.get)
router.route(`/harvestingtransport/detail`)
    .get(harvestingtransport.getDetail)

router.route(`/restanadjustment`)
    .get(restanadjustment.get)
router.route(`/restanadjustment/detail`)
    .get(restanadjustment.getDetail)

router.route(`/landacquisition`)
    .get(landacquisition.get)
router.route(`/landacquisition/detail`)
    .get(landacquisition.getDetail)

router.route(`/classblocknew`)
    .get(classblocknew.get)
router.route(`/classblocknew/detail`)
    .get(classblocknew.getDetail)

router.route(`/lossespanen`)
    .get(lossespanen.get)
router.route(`/lossespanen/detail`)
    .get(lossespanen.getDetail)

router.route(`/oilpalmtreecensusnew`)
    .get(oilpalmtreecensusnew.get)
router.route(`/oilpalmtreecensusnew/detail`)
    .get(oilpalmtreecensusnew.getDetail)

router.route(`/progresslc`)
    .get(progresslc.get)
router.route(`/progresslc/detail`)
    .get(progresslc.getDetail)


module.exports = router;