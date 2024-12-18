const router = require('express').Router()
const _ = require('lodash')
const fs = require("fs");

const { upload } = require('../../services/uploadTools');
const { Decryptor, updatedataHandler } = require('../../util/HelperUtility');
const { executeStmt } = require('../../oradb/dbHandler');
const { mode } = require('crypto-js');

router.route(`/:params`)
    .post(upload.single("file"), async function (req, res) {
        console.log('callback run ')
        //    console.log(req.file.path)

        let result

        const fileResult = req.file.path

        //    console.log('RUN', req.query)
        if (req.query.savedb === 'true') {

            //          console.log('SAVE DB')

            const tname = await Decryptor(req.query.tname);
            const rid = await Decryptor(req.query.rid);
            const field = await Decryptor(req.query.field);

            //            console.log(tname, rid, field, req.user)

            const users = { ...req.user }



            const binds = {
                rowids: rid, loginid: req.user.loginid, val: req.file.path
            }

            const stmt = `    update ${tname} 
        set ${field} = :val , updateby = :loginid ,updatedate = sysdate
        where rowid = :rowids`


            try {
                result = await executeStmt(users, stmt, binds)
            } catch (error) {
                result = ({ ...error, errorMessage: error.message })
            }

            // res.status(200).json(result)

        } else {

        }

        //        console.log('response', 'response end')

        res.json({ message: 'File uploaded successfully!', path: fileResult, ...result });
    })


module.exports = router;