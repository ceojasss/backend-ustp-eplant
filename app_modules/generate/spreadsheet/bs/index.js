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
         const filename = await setReportName(req, res, `Balance Sheet_${req.query.P_TARGETTYPE}-${req.query.P_TARGETCODE}_${req.query.P_MONTH}${req.query.P_YEAR}`, DOCTYPE.XLS)
 
 
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
             const buf = await generateExcel(responseResult, 'reportdata', filename)
 
             res.status(200)
             res.send(buf)
         }
 
     } catch (error) {
         res.send(error)
     }
 
 }
 
 
 module.exports.get = get;
 