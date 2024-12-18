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
 
     let responseResult, sec_responseResult
 
     try {
         // template 
         const filename = await setReportName(req, res, `DetailLedger_${req.query.afd}`, DOCTYPE.XLS)
 
 
         await db.fetchDataDynamic(req.user, req.query,
             (error, result,sec_result) => {
                 if (!_.isEmpty(error)) {
                     responseResult = error;
                     sec_responseResult = error;
                 }
                 else {
                     responseResult = result.rows;
                     sec_responseResult= sec_result.rows;
                 }
             })
 
         if (_.isEmpty(responseResult)) {
             res.send('No Data To Shows..')
         }
         else {
 
             let _obj = []
 
             _obj.push({ data:responseResult , sheetname: 'Sheet 1' })
             _obj.push({ data: sec_responseResult, sheetname: 'Sheet 2' })
 
             const buf = await generateDynamicSheetXLS(_obj, filename)
 
             res.status(200)
             res.send(buf)
         }
     } catch (error) {
         res.send(error)
     }
 
 }
 
 
 module.exports.get = get;
 