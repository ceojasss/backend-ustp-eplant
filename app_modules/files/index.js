const router = require('express').Router()
const _ = require('lodash')
const fs = require("fs");
const path = require("path")


router.route(`/download/*`)
    /*    .post(upload.single('file'), function (req, res) {
   
           //console.log(req.users)
   
           res.json({ message: 'File uploaded successfully!' });
       }) */
    .get(
        (req, res) => {

            let file

            console.log(req.params[0])

            try {
                file = fs.readFileSync(`./uploads/${req.params[0]}`, 'binary');

                res.setHeader('Content-Length', file.length);
                res.write(file, 'binary');
                res.end();

            } catch (error) {
                res.send(error)
            }



        }
    )

router.route(`/uploads/*`)
    /*    .post(upload.single('file'), function (req, res) {
   
           //console.log(req.users)
   
           res.json({ message: 'File uploaded successfully!' });
       }) */
    .get(
        (req, res) => {

            let file

            console.log(req.params[0])

            try {
                file = fs.readFileSync(`./uploads/${req.params[0]}`, 'binary');

                res.setHeader('Content-Length', file.length);
                res.write(file, 'binary');
                res.end();

            } catch (error) {
                res.send(error)
            }



        }
    )


router.route(`/check/*`)
    /*    .post(upload.single('file'), function (req, res) {
   
           //console.log(req.users)
   
           res.json({ message: 'File uploaded successfully!' });
       }) */
    .get(
        async (req, res) => {

            let file

            let search = req.params[0]

            let baseFolder = search.substring(0, search.lastIndexOf("/"))

            let filetoFound = search.substring(search.lastIndexOf("/") + 1)

            let statusFiles



            try {
                const directoryPath = path.join(`./uploads/${baseFolder}`);


                await fs.readdir(directoryPath, async function (err, files) {
                    //handling error
                    if (err) {
                        return false;
                    }

                    statusFiles = _.find(files, file => path.parse(file).name === filetoFound)

                    if (statusFiles) {
                        res.status(200).json({ status: 'file exists', ...path.parse(statusFiles) })

                    } else {
                        res.status(200).json({ error: 'file not exist', status: 'file not found' })
                    }

                });

            } catch (error) {
                res.status(200).json({ error: 'file not exist', status: 'file Error', errorMsg: error })
            }



        }
    )


module.exports = router
