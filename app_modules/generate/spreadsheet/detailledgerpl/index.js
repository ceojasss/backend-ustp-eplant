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
        // template 
        const filename = await setReportName(req, res, `DetailLedgerPL_${req.query.P_JOBCODE2}-${req.query.P_JOBCODE2}_${req.query.P_MONTH}${req.query.P_YEAR}`, DOCTYPE.XLS)


        await db.fetchDataDynamic(req.user, req.query,
            (error, result) => {
                if (!_.isEmpty(error)) {
                    responseResult = error;
                }
                else {
                    responseResult = result.rows;
                }
            })

        if (_.isEmpty(responseResult)) {
            res.send('No Data To Shows..')
        }
        else {
            let _obj = []

            _obj.push({ data: responseResult, sheetname: 'Detail Ledger PL' })
            //_obj.push({ data: responseResult, sheetname: 'Detail Ledger 2' })

            const buf = await generateDynamicSheetXLS(_obj, filename)

            res.status(200)
            res.send(buf)
        }
    } catch (error) {
        res.send(error)
    }

}


module.exports.get = get;
