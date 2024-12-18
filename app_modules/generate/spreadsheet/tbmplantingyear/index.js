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
 
     //let sumresponseResult, sumresponseResult2, sumresponseResult3, detresponseResult, detresponseResult2, detblockresponseResult, detblockresponseResult2
     let responseResult1, responseResult2, responseResult3
     try {
         // template 
         const filename = await setReportName(req, res, `ImmaturePlantingYear_${req.query.P_DIV}_${req.query.P_MONTH}-${req.query.P_MONTH2}${req.query.P_YEAR}`, DOCTYPE.XLS)
 
 
         await db.fetchDataDynamic(req.user, req.query,
             (error, firstSheet, secondSheet, thirdSheet) => {
                 if (!_.isEmpty(error)) {
                     responseResult1 = error;
                     responseResult2 = error;
                     responseResult3 = error;
                 }
                 else {
                     responseResult1 = firstSheet.rows
                     responseResult2 = secondSheet.rows
                     responseResult3 = thirdSheet.rows
                 }
             })
         if (_.isEmpty(responseResult1, responseResult2, responseResult3)) {
             res.send('No Data To Shows..')
         }
         else {
             let _obj = []
             
             if(req.query.report === 'rpt_cost_op_immature_sum.rdf'){
             _obj.push({ data: responseResult1 , sheetname: 'Sheet 1' })
             _obj.push({ data: responseResult2, sheetname: 'Sheet 2' })
             _obj.push({ data: responseResult3, sheetname: 'Sheet 3' })
             }
             else if (req.query.report === 'rpt_cost_op_immature_det.rdf'){
             _obj.push({ data: responseResult1 , sheetname: 'Sheet 1' })
             _obj.push({ data: responseResult2, sheetname: 'Sheet 2' })
             
             }
             else {
             _obj.push({ data: responseResult1 , sheetname: 'Sheet 1' })
             _obj.push({ data: responseResult2, sheetname: 'Sheet 2' })
             
             }
 
 
 
             const buf = await generateDynamicSheetXLS(_obj, filename)
 
             res.status(200)
             res.send(buf)
         }
     } catch (error) {
         res.send(error)
     }
 }
 
 
 module.exports.get = get;
 