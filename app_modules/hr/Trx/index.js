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
const multer = require('multer');
const path = require('path');

const family = require('./FamilyDependents/Controller')
const contactinfo = require('./ContactInfo/Controller')
const reference = require('./Reference/Controller')
const workingexperience = require('./WorkingExperience/Controller')
const diciplinarynotification = require('./DiciplinaryNotification/Controller')
const rewardnotification = require('./RewardNotification/Controller')
const careerhistory = require('./CareerHistory/Controller')
const education = require('./Education/Controller')
const language = require('./Language/Controller')
const training = require('./Training/Controller')
const skills = require('./Skills/Controller')
const termination = require('./Termination/Controller')
const medicalexternal = require('./MedicalExternal/Controller')
const medicalinternal = require('./MedicalInternal/Controller')
const gradestatus = require('./GradeStatus/Controller')
const taxstatus = require('./TaxStatus/Controller')
const trainingschedule = require('./TrainingSchedule/Controller')
const baabsensi = require('./BAAbsensi/Controller')
const biodata = require('./Biodata/Controller')
const atkissued = require('./AtkIssued/Controller')
const medicalho = require('./MedicalHO/Controller')
const setupcuti = require('./SetupCuti/Controller')
const realisasispd = require('./RealisasiSpd/Controller')
const mom = require('./Mom/Controller')



// const storage = multer.diskStorage({
//     destination: function (req,file,cb) {
//         cb(null,"./path/");
//     },
//     filename: function (req,file,cb) {
//         // console.log('req user',req.body)
//         // console.log('req body',JSON.parse(req.body.data))
//         // console.log('req emp',req.body.empcode)
//         let namePath = path.parse(file.originalname)
//         // let empparse = JSON.parse(req.body.data)
//         let empparse = req.body.empcode
//         // console.log('emp',empparse)
//         // cb(
//         //     null,
//         //     empparse[0].header.empcode + "-" + Date.now() + path.extname(file.originalname)
//         // );
//         cb(
//             null,
//             empparse + path.extname(file.originalname)
//         );
//     }
// });

// const fileFilter = (req,file,cb) => {
//     if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
//         cb(null,true); 
//     }else{
//         cb(null,false);
//     }
// }
// const upload = multer({storage: storage, fileFilter: fileFilter});


router.route(`/family`)
    .get(family.get)
    .post(family.post)
    .put(family.put)
router.route(`/family/detail`)
    .get(family.getDetail)

router.route(`/contactinfo`)
    .get(contactinfo.get)
router.route(`/contactinfo/detail`)
    .get(contactinfo.getDetail)

router.route(`/reference`)
    .get(reference.get)
    .post(reference.post)
    .put(reference.put)
router.route(`/reference/detail`)
    .get(reference.getDetail)

router.route(`/workingexperience`)
    .get(workingexperience.get)
    .post(workingexperience.post)
    .put(workingexperience.put)
router.route(`/workingexperience/detail`)
    .get(workingexperience.getDetail)

router.route(`/diciplinarynotification`)
    .get(diciplinarynotification.get)
router.route(`/diciplinarynotification/detail`)
    .get(diciplinarynotification.getDetail)

router.route(`/rewardnotification`)
    .get(rewardnotification.get)
    .post(rewardnotification.post)
    .put(rewardnotification.put)
router.route(`/rewardnotification/detail`)
    .get(rewardnotification.getDetail)

router.route(`/careerhistory`)
    .get(careerhistory.get)
    .post(careerhistory.post)
    .put(careerhistory.put)
router.route(`/careerhistory/detail`)
    .get(careerhistory.getDetail)

router.route(`/education`)
    .get(education.get)
    .post(education.post)
    .put(education.put)
router.route(`/education/detail`)
    .get(education.getDetail)

router.route(`/language`)
    .get(language.get)
    .post(language.post)
    .put(language.put)
router.route(`/language/detail`)
    .get(language.getDetail)

router.route(`/training`)
    .get(training.get)
    .post(training.post)
    .put(training.put)
router.route(`/training/detail`)
    .get(training.getDetail)

router.route(`/skills`)
    .get(skills.get)
    .post(skills.post)
    .put(skills.put)
router.route(`/skills/detail`)
    .get(skills.getDetail)

router.route(`/termination`)
    .get(termination.get)
    .post(termination.post)
    .put(termination.put)
router.route(`/termination/detail`)
    .get(termination.getDetail)

router.route(`/medicalexternal`)
    .get(medicalexternal.get)
    .post(medicalexternal.post)
    .put(medicalexternal.put)
router.route(`/medicalexternal/detail`)
    .get(medicalexternal.getDetail)

router.route(`/medicalinternal`)
    .get(medicalinternal.get)
    .post(medicalinternal.post)
    .put(medicalinternal.put)
router.route(`/medicalinternal/detail`)
    .get(medicalinternal.getDetail)

router.route(`/gradestatus`)
    .get(gradestatus.get)
    .post(gradestatus.post)
    .put(gradestatus.put)
router.route(`/gradestatus/detail`)
    .get(gradestatus.getDetail)

router.route(`/taxstatus`)
    .get(taxstatus.get)
    .post(taxstatus.post)
    .put(taxstatus.put)
router.route(`/taxstatus/detail`)
    .get(taxstatus.getDetail)

router.route(`/trainingschedule`)
    .get(trainingschedule.get)
    .post(trainingschedule.post)
    .put(trainingschedule.put)
router.route(`/trainingschedule/detail`)
    .get(trainingschedule.getDetail)

router.route(`/baabsensi`)
    .get(baabsensi.get)
    .post(baabsensi.post)
    .put(baabsensi.put)
router.route(`/baabsensi/detail`)
    .get(baabsensi.getDetail)

router.route(`/biodata`)
    .get(biodata.get)
    // .post(upload.single('photodisplayonly'),biodata.post)
    // .put(upload.single('photodisplayonly'),biodata.put)
router.route(`/biodata/detail`)
    .get(biodata.getDetail)

router.route(`/atkissued`)
    .get(atkissued.get)
    .post(atkissued.post)
    .put(atkissued.put)
router.route(`/atkissued/detail`)
    .get(atkissued.getDetail)


router.route(`/medicalho`)
    .get(medicalho.get)
    .post(medicalho.post)
    .put(medicalho.update)
    .delete(medicalho.hapus)

router.route(`/medicalho/detail`)
    .get(medicalho.getDetail)

router.route(`/medicalho/generatedocument`)
    .post(medicalho.process)

router.route(`/setupcuti`)
    .get(setupcuti.get)
    .post(setupcuti.post)
    .put(setupcuti.put)


router.route(`/setupcuti/detail`)
    .get(setupcuti.getDetail)


router.route(`/realisasispd`)
    .get(realisasispd.get)
    .post(realisasispd.post)
    .put(realisasispd.put)
    .delete(realisasispd.hapus)

router.route(`/realisasispd/detail`)
    .get(realisasispd.getDetail)


router.route(`/mom`)
    .get(mom.get)
    .post(mom.post)
    .put(mom.update)
    .delete(mom.hapus)



module.exports = router;