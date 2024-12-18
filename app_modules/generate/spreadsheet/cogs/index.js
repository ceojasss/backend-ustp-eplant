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
 
     let responseResult, responseResult2, responseResult3, responseResult4, responseResult5, responseResult6
 
     try {
         // template 
         const filename = await setReportName(req, res, `COGS_${req.query.P_MONTH}${req.query.P_YEAR}`, DOCTYPE.XLS)
 
 
         await db.fetchDataDynamic(req.user, req.query,
             (error, result,result2, result3, result4, result5, result6) => {
                 if (!_.isEmpty(error)) {
                     responseResult = error;
                     responseResult2 = error;
                     responseResult3 = error;
                     responseResult4 = error;
                     responseResult5 = error;
                     responseResult6 = error;
 
                 }
                 else {
                     responseResult = result.rows;
                     responseResult2 = result2.rows;
                     responseResult3 = result3.rows;
                     responseResult4 = result4.rows;
                     responseResult5 = result5.rows;
                     responseResult6 = result6.rows;
                 }
             })
 
         if (_.isEmpty(responseResult)) {
             res.send('No Data To Shows..')
         }
         else {
             let _obj = []
            
             _obj.push({ data: responseResult , sheetname: 'Sheet 1' })
             _obj.push({ data: responseResult2, sheetname: 'Sheet 2' })
             _obj.push({ data: responseResult3, sheetname: 'Sheet 3' })
             _obj.push({ data: responseResult4, sheetname: 'Sheet 4' })
             _obj.push({ data: responseResult5, sheetname: 'Sheet 5' })
             _obj.push({ data: responseResult6, sheetname: 'Sheet 6' })
 
             const buf = await generateDynamicSheetXLS(_obj, filename)
 
             res.status(200)
             res.send(buf)
         }
     } catch (error) {
         res.send(error)
     }
 
 }
 
 
 module.exports.get = get;
 