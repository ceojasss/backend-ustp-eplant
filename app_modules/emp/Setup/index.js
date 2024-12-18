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

const setuphavalidation = require('./HaValidation/Controller')
const gangmaster = require('./GangMaster/Controller')
const AllowVariable = require('./VariableAllowance/Controller')
const AllowFix = require('./AllowanceFix/Controller')
const setuppayrollallowdedtype = require("./AllowdedType/Controller");
const setuppenaltypanen = require("./PenaltyPanen/Controller");
const otherpayrollrate = require("./OtherPayrollRate/Controller");
const oprate = require("./OPRate/Controller");
const nonharvpremiumrate = require("./NonHarvestingPremiumRate/Controller");
const otherharvestingrate = require("./OtherHarvestingRate/Controller");
const workingcalendar = require("./WorkingCalendar/Controller");
const FringeBenefitType = require('./FringeBenefitType/Controller')
const GangMasterPasangan = require('./GangMasterPasangan/Controller')
const parametermasterpayroll = require("./ParameterMasterPayroll/Controller");
const salarygrade = require("./SalaryGrade/Controller");
const payrollarea = require("./PayrollArea/Controller");
const parameterpayrollprocess = require("./ParameterPayrollProcess/Controller");




router.route(`/havalidation`)
    .get(setuphavalidation.get)
    .post(setuphavalidation.post)
    .delete(setuphavalidation.hapus)
    .put(setuphavalidation.update)

router.route(`/setupgangmaster`)
    .get(gangmaster.get)

router.route(`/setupgangmaster/detail`)
    .get(gangmaster.getDetail)

router
    .route(`/allowancevariable`)
    .get(AllowVariable.get)
router
    .route(`/allowancevariable/detail`)
    .get(AllowVariable.getDetail)

router
    .route(`/allowancefix`)
    .get(AllowFix.get)

router
    .route(`/allowancefix/detail`)
    .get(AllowFix.getDetail)



router.route(`/payrollallowdedtype`)
    .get(setuppayrollallowdedtype.get)
    .post(setuppayrollallowdedtype.post)
    .put(setuppayrollallowdedtype.update)
    .delete(setuppayrollallowdedtype.hapus)

router
    .route(`/penaltypanen`)
    .get(setuppenaltypanen.get)
    .post(setuppenaltypanen.post)
    .delete(setuppenaltypanen.hapus)
    .put(setuppenaltypanen.update);


router.route(`/otherpayrollrate`)
    .get(otherpayrollrate.get)
    .post(otherpayrollrate.post)
    .put(otherpayrollrate.update)
    .delete(otherpayrollrate.hapus)

router
    .route(`/oprate`)
    .get(oprate.get)
    .post(oprate.post)
    .delete(oprate.hapus)
    .put(oprate.update);

router
    .route(`/nonharvpremiumrate`)
    .get(nonharvpremiumrate.get)
    .post(nonharvpremiumrate.post)
    .delete(nonharvpremiumrate.hapus)
    .put(nonharvpremiumrate.update);

router
    .route(`/otherharvestingrate`)
    .get(otherharvestingrate.get)
    .post(otherharvestingrate.post)
    .delete(otherharvestingrate.hapus)
    .put(otherharvestingrate.update);


router.route(`/fringebenefittype`)
    .get(FringeBenefitType.get);

router
    .route(`/fringebenefittype/detail`)
    .get(FringeBenefitType.getDetail);

router.route(`/gangmasterpasangan`)
    .get(GangMasterPasangan.get);

router
    .route(`/gangmasterpasangan/detail`)
    .get(GangMasterPasangan.getDetail);

router
    .route(`/parameterpayroll`)
    .get(parametermasterpayroll.get)
    .post(parametermasterpayroll.post)
    .put(parametermasterpayroll.put)

router.route(`/parameterpayroll/detail`)
    .get(parametermasterpayroll.getDetail)


router.route(`/salarygrade`)
    .get(salarygrade.get)
    .post(salarygrade.post)
    .put(salarygrade.update)
    .delete(salarygrade.hapus)


router.route(`/payrollarea`)
    .get(payrollarea.get)
    .post(payrollarea.post)
    .put(payrollarea.update)
    .delete(payrollarea.hapus)


router.route(`/parameterpayrollprocess`)
    .get(parameterpayrollprocess.get)
    .post(parameterpayrollprocess.post)
    .put(parameterpayrollprocess.put)
router.route(`/parameterpayrollprocess/detail`)
    .get(parameterpayrollprocess.getDetail)


router.route(`/workingcalendar`)
    .get(workingcalendar.get)
    .post(workingcalendar.post)
    .put(workingcalendar.put)
    .delete(workingcalendar.hapus)


router.route(`/workingcalendar/detail`)
    .get(workingcalendar.getDetail)

router.route(`/workingcalendar/detaillimit`)
    .get(workingcalendar.getDetailLimit)

router.route(`/workingcalendar/detailbydate`)
    .get(workingcalendar.getDetailByDate)

module.exports = router;