/*=============================================================================
 |       Author:  Gunadi Rismananda
 |         Dept:  IT - USTP
 |          
 |  Description:  Handling Express Webserver on node js 
 |
 | Dependencies:  express     --> webserver framework 
 |                body-parser --> parsing semua request http menjadi JSON
 |                morgan      --> Untuk Logging HTTP Traffic.                  
 |                
 |
 *===========================================================================*/

const multer = require('multer');
const fs = require("fs");

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        //        let _path = 'uploads/'

        let mainDir = req.params.params

        let subMainDir = req.user.sub

        //console.log(file)

        let _path = `uploads/${mainDir}/${subMainDir}/`

        fs.mkdir(_path, { recursive: true }, function (err) {
            if (err) {
                console.log('failed to create directory', err);
                //cb(null, _path);
            } else {
                console.log('uploading')
                cb(null, _path);

            }

            //  console.log('hohow')
        });
    },
    filename: function (req, file, cb) {
        //cb(null, Date.now() + '-' + file.originalname);
        cb(null, `${req.user.sub}_${file.originalname}`);
    }
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = { upload };
