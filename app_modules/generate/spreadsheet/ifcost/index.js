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
     let responseResult1, responseResult2
     try {
         // template 
         const filename = await setReportName(req, res, `ImmaturePlantingYear_${req.query.V_INFRACODE}_${req.query.V_SUBTYPE}_${req.query.V_TYPE}_${req.query.V_DIVISION}_${req.query.V_ESTATE}_${req.query.V_MONTH}${req.query.V_YEAR}`, DOCTYPE.XLS)
 

         await db.fetchDataDynamic(req.user, req.query,
             (error, firstSheet, secondSheet) => {
                 if (!_.isEmpty(error)) {
                    if(req.query.report === '1-RPT_BIAYA_INFRASTRUKTUR_SUM.RDF'){
                        responseResult1 = error;
                    } else {
                        responseResult1 = error;
                        responseResult2 = error;
                    }
                 }
                 else {
                    if(req.query.report === '1-RPT_BIAYA_INFRASTRUKTUR_SUM.RDF'){
                        responseResult1 = firstSheet.rows
                    } else {
                        responseResult1 = firstSheet.rows
                        responseResult2 = secondSheet.rows
                    }
                 }
             })
         if (_.isEmpty(responseResult1)) {
             res.send('No Data To Shows..')
         }
         else {
             let _obj = []
             
             if(req.query.report === '1-RPT_BIAYA_INFRASTRUKTUR_SUM.RDF'){
             _obj.push({ data: responseResult1 , sheetname: 'Sheet 1' })
             }else {
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
 