/*=============================================================================
 |       Author:  Gunadi Rismananda
 |         Dept:  IT - USTP
 |          
 |  Description:  Handling ENTRY POINT API ROUTE dari HTPP Request
 |
 | Dependencies:  express     --> webserver framework 
 |                body-parser --> parsing semua request http menjadi JSON
 |                passport    --> library authentication untuk login. (Login menggunakan JWT)
 |                
 |
 *===========================================================================*/

const express = require('express')
const router = new express.Router()
require('./passport')
const authentication = require('../app_modules/authentication/authentication')
const passport = require('passport')

const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignIn = passport.authenticate('local', { session: false })

const requireVendorSignIn = passport.authenticate('vendor', { session: false })


/*
 * import route dari setiap menu disini.. 
 */
const cashbank = require('../app_modules/cashbank/')
const stores = require('../app_modules/stores/')
const vehicle = require('../app_modules/vehicle/')
const nursery = require('../app_modules/nursery/')
const journalvoucher = require('../app_modules/journalvoucher')
const fixedasset = require('../app_modules/fixedasset')
const purchasing = require('../app_modules/purchasing')
const contract = require('../app_modules/contract')
const sales = require('../app_modules/sales')
const palmoilmill = require('../app_modules/palmoilmill')
const fieldoperation = require('../app_modules/fieldoperation')
const generalsetup = require('../app_modules/generalsetup')
const workshop = require('../app_modules/workshop')
const infrastructure = require('../app_modules/infrastructure')
const menu = require('../app_modules/menu/menu')
const dashboard = require('../app_modules/dashboard/dashboard')
const lovs = require('../app_modules/listofvalues')
const machine = require('../app_modules/machine')
const apps = require('../app_modules/apps')
const admin = require('../app_modules/adminpanel')
const report = require('../app_modules/reportlist')
const emp = require('../app_modules/emp')
const hr = require('../app_modules/hr')
const generate = require('../app_modules/generate')
const bi = require('../app_modules/businessintelligence')
const generalledger = require('../app_modules/generalledger')
const connectionMonitor = require('../tools/connectionMonitor')

const util = require('../app_modules/util')
const vendor = require('../app_modules/vendor')


const uploader = require('../app_modules/upload')
const uploadEplant = require('../app_modules/uploadEplant')
const uploadWebcam = require('../app_modules/uploadWebcam')

const files = require('../app_modules/files')
const sysadmin = require('../app_modules/sysadmin')

const executiveSummary = require('../app_modules/executivesummary')

const ess = require('../app_modules/ess')


// const ess = require('../app_modules/ess')


router.get('/', requireAuth, function (req, res) {
    // console.log(req)
    res.send(req.user)
})

router.get('/user', requireAuth, function (req, res) {
    // console.log(req)
    res.send(req.user)
})

router.post('/uservalid', authentication.checkUserExists);
router.get('/authsite', authentication.authSite);



router.post('/signin', requireSignIn, authentication.signin);

router.post('/signin2', requireSignIn, authentication.signinv2);

router.post('/signkey', requireSignIn, authentication.signKey);

router.post('/swap', requireAuth, authentication.swap);

/* router.post('/signup', authentication.signup) */

/*
 * API Entry Point untuk setiap module 
 */

router.use('/cashbank', requireAuth, cashbank)
router.use('/stores', requireAuth, stores)
router.use('/nursery', requireAuth, nursery)
router.use('/menu', requireAuth, menu)
router.use('/dashboard', requireAuth, dashboard)
// router.use('/dashboard', requireAuth, dashboard)
router.use('/lov', requireAuth, lovs)
router.use('/vehicle', requireAuth, vehicle)
router.use('/journalvoucher', requireAuth, journalvoucher)
router.use('/fixedasset', requireAuth, fixedasset)
router.use('/contract', requireAuth, contract)
router.use('/sales', requireAuth, sales)
router.use('/palmoilmill', requireAuth, palmoilmill)
router.use('/fieldoperation', requireAuth, fieldoperation)
router.use('/generalsetup', requireAuth, generalsetup)
router.use('/util', requireAuth, util)
router.use('/workshop', requireAuth, workshop)
router.use('/infrastructure', requireAuth, infrastructure)
router.use('/purchasing', requireAuth, purchasing)
router.use('/machine', requireAuth, machine)
router.use('/apps', requireAuth, apps)
router.use('/admin', requireAuth, admin)
router.use('/report', requireAuth, report)
router.use('/emp', requireAuth, emp)
router.use('/hr', requireAuth, hr)
router.use('/bi', requireAuth, bi)
router.use('/costbook', requireAuth, generalledger)

router.use('/tools', requireAuth, connectionMonitor)

// generate report routing
router.use('/generate', requireAuth, generate)


/** vendor eProcerement */
router.post('/vsignin', requireSignIn, authentication.vendorSignIn);

router.use('/vendor', requireAuth, vendor)
router.use('/upload', requireAuth, uploader)
router.use('/eplant', requireAuth, uploadEplant)
router.use('/webcam', requireAuth, uploadWebcam)
router.use('/files', requireAuth, files)

// sys admin
router.use('/sys', requireAuth, sysadmin)

router.use('/executivesummary', requireAuth, executiveSummary)

router.use('/ess', requireAuth, ess)

module.exports = router