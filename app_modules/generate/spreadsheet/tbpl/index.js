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
 
     let responseResult, responseResult2
 
     try {
         // template 
         const filename = await setReportName(req, res, `TrialBalancePL_${req.query.P_MONTH}${req.query.P_YEAR}`, DOCTYPE.XLS)
 
 
         await db.fetchDataDynamic(req.user, req.query,
             (error, result, result2) => {
                 if (!_.isEmpty(error)) {
                     responseResult = error;
                     responseResult2 = error
                 }
                 else {
                     responseResult = result.rows;
                     responseResult2 = result2.rows
                 }
             })
 
         if (_.isEmpty(responseResult)) {
             res.send('No Data To Shows..')
         }
         else {
             let _obj = []
 
             _obj.push({ data: responseResult , sheetname: 'Sheet 1' })
             _obj.push({ data: responseResult2, sheetname: 'Sheet 2' })
 
             const buf = await generateDynamicSheetXLS(_obj, filename)
 
             res.status(200)
             res.send(buf)
         }
     } catch (error) {
         res.send(error)
     }
 
 }
 
 
 module.exports.get = get;
 