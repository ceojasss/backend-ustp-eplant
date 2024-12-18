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


const alokasibiayaumum = require('./alokasibiayaumum')
const areastatement = require('./areastatement')
const bbtplantingyear = require('./bbtplantingyear')
const bs = require('./bs')
const cogs = require('./cogs')
const detailledger = require('./detailledger')
const detailledgerhist = require('./detailledgerhist')
const detailledgerpl = require('./detailledgerpl')
const estatefoh = require('./estatefoh')
const faledger = require('./faledger')
const ifcost = require('./ifcost')
const infrastructure = require('./infrastructure')
const masteractivity = require('./masteractivity')
const millcost = require('./millcost')
const millcostsummary = require('./millcostsummary')
const millfoh = require('./millfoh')
const pl = require('./pl')
const tb = require('./tb')
const tbmplantingyear = require('./tbmplantingyear')
const tbmplasmaplantingyear = require('./tbmplasmaplantingyear')
const tbpl = require('./tbpl')
const tmplantingyear = require('./tmplantingyear')
const tmplasma = require('./tmplasma')
const tmplasmaplantingyear = require('./tmplasmaplantingyear')
const validasitransaksi = require('./validasitransaksi')
const rekapklaimobat = require('./rekapklaimobat')
const rekapobat = require('./rekapobat')
const template = require('./template')

// ** ROUTING 


// REPORT MODULE COSTBOOK / GL
router.route(`/detailledger`).get(detailledger.get)
router.route(`/alokasibiayaumum`).get(alokasibiayaumum.get)
router.route(`/bbtplantingyear`).get(bbtplantingyear.get)
router.route(`/bs`).get(bs.get)
router.route(`/cogs`).get(cogs.get)
router.route(`/detailledger`).get(detailledger.get)
router.route(`/detailledgerhist`).get(detailledgerhist.get)
router.route(`/detailledgerpl`).get(detailledgerpl.get)
router.route(`/estatefoh`).get(estatefoh.get)


router.route(`/masteractivity`).get(masteractivity.get)
router.route(`/millcost`).get(millcost.get)
router.route(`/millcostsummary`).get(millcostsummary.get)
router.route(`/millfoh`).get(millfoh.get)
router.route(`/pl`).get(pl.get)
router.route(`/tb`).get(tb.get)
router.route(`/tbmplantingyear`).get(tbmplantingyear.get)
router.route(`/tbmplasmaplantingyear`).get(tbmplasmaplantingyear.get)
router.route(`/tbpl`).get(tbpl.get)
router.route(`/tmplantingyear`).get(tmplantingyear.get)
router.route(`/tmplasma`).get(tmplasma.get)
router.route(`/tmplasmaplantingyear`).get(tmplasmaplantingyear.get)
router.route(`/validasitransaksi`).get(validasitransaksi.get)


// REPORT MODULE FIXEDASSET
router.route(`/faledger`).get(faledger.get)


// REPORT MODULE INFRASTRUCTURE
router.route(`/ifcost`).get(ifcost.get)
router.route(`/infrastructure`).get(infrastructure.get)


// REPORT MODULE FIELDOPERATION
router.route(`/areastatement`).get(areastatement.get)


// REPORT MODULE HR
router.route(`/rekapklaimobat`).get(rekapklaimobat.get)
router.route(`/rekapobat`).get(rekapobat.get)

// report management excel (dengan query dari database )
router.route(`/managementreport/*`).get(template.get)



module.exports = router;