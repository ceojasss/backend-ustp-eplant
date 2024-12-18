const router = require('express').Router()
const _ = require('lodash')
const fs = require("fs");
const path= require('path');
const { upload } = require('../../services/uploader');
const { Decryptor, updatedataHandler } = require('../../util/HelperUtility');
const { executeStmt } = require('../../oradb/dbHandler');

router.route(`/:params`)
    /*    .post(upload.single('file'), function (req, res) {
   
           //console.log(req.users)
   
           res.json({ message: 'File uploaded successfully!' });
       }) */
    // .post(upload.single("file"), async function (req, res) {
    .post( async function (req, res) {
        // console.log(req.query.filename)
        const date = new Date()
        const image = req.body.image;
        const imageName = `${req.query.filename.replaceAll('/','_')}.jpg`;
        // const imagePath = `uploads/ffbgrading/${imageName}`;
        let imagePath = await `uploads/`;
        const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        // console.log(req.query.path)
    //    console.log(imageName)
        let rep =  _.map(_.split(req.query.path,';'),(x,i)=>{
            return _.replace(x,'#','')
           
        //    console.log(rep,x,i)

       })
       rep = _.join(rep,'/')
       if (rep.match('date')){
        // console.log('1')
        rep = _.replace(rep,'date', `${date.getFullYear()}/${date.getMonth() +1}/${date.getDate()}`)
       } 
    //    console.log(imageName)
    //    console.log('tes',imageName)
       imagePath = imagePath + rep
    //    console.log(imagePath)
    //    console.log(rep)
        // fs.mkdirSync(imagePath, { recursive: true })
        // fs.writeFileSync(path.join(imagePath,imageName), imageBuffer,"UTF8")

//    console.log(imageBuffer)
fs.mkdir(imagePath, { recursive: true }, function (err) {
    if (err) {
        // console.log('failed to create directory', err);
        //cb(null, _path);
    } else {
        // console.log('uploading')
        // cb(null, imagePath);
        //  if (_.isNull(imagePath)){
//         //  }
fs.writeFile(path.join(imagePath,imageName), imageBuffer,"UTF8", (err) => {
    if (err) {
    // console.error('Error saving image:', err);
    res.json( {message:'Error saving image'});
    } else {
    // console.log('Image saved:', imageName);
    res.json({message:'berhasil', path :path.join(imagePath,imageName)});
    }
});   
    }
//     //  console.log('hohow')
});    


     
    })
module.exports = router;