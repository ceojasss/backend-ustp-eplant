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


const gangmasterperiod = require('./GangMasterPeriod/Controller')
const employeeadhocallowancededuction = require('./EmployeeAdHocAllowanceDeduction/Controller')
const employeeotherreceivables = require('./EmployeeOtherReceivables/Controller')
const employeereceivables = require('./EmployeeReceivables/Controller')
const gangactivitygeneral = require("./GangActivityGeneral/Controller")
const bkmpanenpasangan = require("./BkmPanenPasangan/Controller")
const gangactivityupkeep = require("./GangActivityUpkeep/Controller");
const gangactivityfactory = require("./GangActivityFactory/Controller");
const masterperencanaanintrans = require('./MasterPerencanaanIntrans/Controller');
const verifupkeep = require('./VerifUpkeep/Controller');





router.route(`/gangmasterperiod`)
    .get(gangmasterperiod.get)

router.route(`/gangmasterperiod/detail`)
    .get(gangmasterperiod.getDetail)

    router.route(`/employeeadhocallowancededuction`)
    .get(employeeadhocallowancededuction.get)

router.route(`/employeeadhocallowancededuction/detail`)
    .get(employeeadhocallowancededuction.getDetail)

router.route(`/employeeotherreceivables`)
    .get(employeeotherreceivables.get)
    .post(employeeotherreceivables.post)
    .put(employeeotherreceivables.put)

router.route(`/employeeotherreceivables/detail`)
    .get(employeeotherreceivables.getDetail)

router.route(`/employeereceivables`)
    .get(employeereceivables.get)

router.route(`/employeereceivables/detail`)
    .get(employeereceivables.getDetail)

    router.route(`/gangactivitygeneral`)
    .get(gangactivitygeneral.get)
    .post(gangactivitygeneral.post)
    .put(gangactivitygeneral.put)

    router.route(`/gangactivitygeneral/detail`).get(gangactivitygeneral.getDetail);
    

    router.route(`/bkmpanenpasangan`)
    .get(bkmpanenpasangan.get)
    .post(bkmpanenpasangan.post)
    .put(bkmpanenpasangan.put)

router.route(`/bkmpanenpasangan/detail`)
    .get(bkmpanenpasangan.getDetail)

    router.route(`/gangactivityupkeep`)
    .get(gangactivityupkeep.get)
.put(gangactivityupkeep.put)
.post(gangactivityupkeep.post);

router.route(`/gangactivityupkeep/detail`).get(gangactivityupkeep.getDetail);

router.route(`/gangactivityfactory`)
.get(gangactivityfactory.get)
.put(gangactivityfactory.put)
.post(gangactivityfactory.post);


router.route(`/gangactivityfactory/detail`).get(gangactivityfactory.getDetail);

router.route(`/masterperencanaanintrans`)
    .get(masterperencanaanintrans.get)
    .post(masterperencanaanintrans.post)
    .put(masterperencanaanintrans.put)
    .delete(masterperencanaanintrans.hapus)


router.route(`/masterperencanaanintrans/detail`)
    .get(masterperencanaanintrans.getDetail)

router.route(`/verifupkeep`)
    .get(verifupkeep.get)
    .post(verifupkeep.post)
    .put(verifupkeep.put)
    .delete(verifupkeep.hapus)


router.route(`/verifupkeep/detail`)
    .get(verifupkeep.getDetail)





module.exports = router;