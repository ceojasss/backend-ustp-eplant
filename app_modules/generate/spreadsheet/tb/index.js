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
 const { setReportName, generateExcel, generateDynamicSheetXLS } = require('../../../../util/HelperUtility')
 const { DOCTYPE } = require('../../../../util/Constants')
 
 
 async function get(req, res, next) {
 
     let responseResult, secondresponseResult, thirdresponseResult
 
     try {
         // template 
         const filename = await setReportName(req, res, `TrialBalanceReport_${req.query.P_MONTH}${req.query.P_YEAR}`, DOCTYPE.XLS)
 
 
         await db.fetchDataDynamic(req.user, req.query,
             (error, result, secondResult) => {
                 if (!_.isEmpty(error)) {
                     responseResult = error;
                     secondresponseResult = error;
                 }
                 else {
                     responseResult = result.rows;
                     secondresponseResult = secondResult.rows;
                     
                 }
             })
 
         if (_.isEmpty(responseResult)) {
             res.send('No Data To Shows..')
         }
         else {
             //const buf = await generateExcel(responseResult, 'reportdata', filename)

             let _obj = []

            _obj.push({ data:responseResult , sheetname: 'Sheet 1' })
            _obj.push({ data: secondresponseResult, sheetname: 'Sheet 2' })

            const buf = await generateDynamicSheetXLS(_obj, filename)

 
             res.status(200)
             res.send(buf)
         }
     } catch (error) {
         res.send(error)
     }
 
 }
 
 
 module.exports.get = get;
 