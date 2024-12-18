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
 const { setReportName, generateDynamicSheetXLS } = require('../../../../util/HelperUtility')
 const { DOCTYPE } = require('../../../../util/Constants')
 
 
 async function get(req, res, next) {
 
     let responseResultfirst,responseResultsecond
 
     try {
         // template 
         const filename = await setReportName(req, res, `MaturePlantingYear_${req.query.P_MONTH}-${req.query.P_MONTH2}_${req.query.P_DIV}${req.query.P_YEAR}`, DOCTYPE.XLS)
 
 
         await db.fetchDataDynamic(req.user, req.query,
             (error, firstsheet,secondsheet) => {
                 if (!_.isEmpty(error)) {
                     responseResultfirst = error;
                     responseResultsecond = error;
                 }
                 else {
                     responseResultfirst = firstsheet.rows;
                     responseResultsecond = secondsheet.rows;
                 }
             })
         
 
         if (_.isEmpty(responseResultfirst)) {
             res.send('No Data To Shows..')
         }
         else {
             let _obj = []
 
             _obj.push({ data:responseResultfirst , sheetname: 'Sheet 1' })
             _obj.push({ data:responseResultsecond, sheetname: 'Sheet 2' })
 
             const buf = await generateDynamicSheetXLS(_obj, filename)
 
             res.status(200)
             res.send(buf)
         }
     } catch (error) {
         res.send(error)
     }
 
 }
 
 
 module.exports.get = get;
 