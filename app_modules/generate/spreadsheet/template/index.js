/*=============================================================================
 |       Author:  Gunadi Rismananda
 |         Dept:  IT - USTP
 |          
 |  Description:  Handling API ROUTE Untuk List Value Data.
 |
 | Dependencies:  express     --> webserver framework 
 |                body-parser --> parsing semua request http menjadi JSON
 |                passport    --> library authentication untuk login. (Login menggunakan JWT)
 |                
 |
 *===========================================================================*/

const _ = require('lodash')

const db = require('./db')
const { setReportName, generateExcel } = require('../../../../util/HelperUtility')
const { DOCTYPE } = require('../../../../util/Constants')


async function get(req, res, next) {

    let responseResult

    try {

        const props = req.user

        // console.log('get filename', props.site, req)

        const filename = await setReportName(req, res, `${props.site}${req.params[0]}${req.query.p_month}${req.query.p_year}`, DOCTYPE.XLS)


        await db.fetchData(req,
            (error, result) => {

                //    console.log(result[0].content.rows)

                if (!_.isEmpty(error)) {
                    responseResult = error;
                }
                else {
                    responseResult = result[0].content.rows;
                }
            })

        if (_.isEmpty(responseResult)) {
            res.send('No Data To Shows..')
        }
        else {


            // console.log('file', filename)
            const buf = await generateExcel(responseResult, 'reportdata', filename)

            res.status(200)
            res.send(buf)
        }

    } catch (error) {

        console.log('error ', error)
        res.send(error)
    }

}


module.exports.get = get;
