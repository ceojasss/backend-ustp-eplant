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
         const filename = await setReportName(req, res, `TMPlasma_${req.query.p_month}${req.query.p_year}`, DOCTYPE.XLS)
 
 
         await db.fetchDataDynamic(req.user, req.query,
             (error, result, secondResult, thirdResult) => {
                 if (!_.isEmpty(error)) {
                     responseResult = error;
                     secondresponseResult = error;
                     thirdresponseResult = error;
                 }
                 else {
                     responseResult = result.rows;
                     secondresponseResult = secondResult.rows;
                     thirdresponseResult = thirdResult.rows;
                     
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
            _obj.push({ data: thirdresponseResult, sheetname: 'Sheet 3' })

            const buf = await generateDynamicSheetXLS(_obj, filename)

 
             res.status(200)
             res.send(buf)
         }
     } catch (error) {
         res.send(error)
     }
 
 }
 
 
 module.exports.get = get;
 