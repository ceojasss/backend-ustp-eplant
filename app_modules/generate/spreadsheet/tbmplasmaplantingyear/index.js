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
     // console.log('find di index : ', find);
     let responseResult, secondresponseResult, thirdresponseResult;
 
     let RB_LABEL = [];
 
     try {
         // template 
         const filename = await setReportName(req, res, `ImmaturePlantingYearPlasma_${req.query.P_JOBCODE2}-${req.query.P_JOBCODE2}_${req.query.P_MONTH}${req.query.P_YEAR}`, DOCTYPE.XLS)
         
         console.log('tes from index : ', req.query.report)
 
        //  if(req.query.report == 'rpt_cost_op_mature_sum_plasma.rdf'){
        //      RB_LABEL = 'Summary'
        //  }else {
        //      RB_LABEL = 'Details'
        //  } 
 
         await db.fetchDataDynamic(req.user, req.query,
             (error, result, secondResult, thirdResult) => {

                 if (!_.isEmpty(error)) {
                     responseResult = error;
                     secondresponseResult = error;
                     thirdresponseResult = error;

                    //  console.log('responseResult :',responseResult );
                    //  console.log('secondresponseResult :',secondresponseResult );
                    //  console.log('thirdresponseResult :',thirdresponseResult );
                 }
                 else {
                     responseResult = result.rows;
                     secondresponseResult = secondResult.rows;
                     thirdresponseResult = thirdResult.rows;

                    //  console.log('responseResult :',responseResult );
                    //  console.log('secondresponseResult :',secondresponseResult );
                    //  console.log('thirdresponseResult :',thirdresponseResult );
                 }
             })
 
         if (_.isEmpty(responseResult)) {
             res.send('No Data To Shows..')
         }
         else {
            let _obj = []

            if(req.query.report == 'rpt_cost_op_immature_plasma.rdf'){
                _obj.push({ data:responseResult , sheetname: 'Sheet 1' })
                _obj.push({ data: secondresponseResult, sheetname: 'Sheet 2' })
                _obj.push({ data: thirdresponseResult, sheetname: 'Sheet 3' })

            } else if(req.query.report == 'rpt_cost_op_immature_det_plasma.rdf'){
                _obj.push({ data:responseResult , sheetname: 'Sheet 1' })
                _obj.push({ data: secondresponseResult, sheetname: 'Sheet 2' })
            } else {
                _obj.push({ data:responseResult , sheetname: 'Sheet 1' })
                _obj.push({ data: secondresponseResult, sheetname: 'Sheet 2' })
            }
            
            
            //  const buf = await generateExcel(responseResult, RB_LABEL, filename)

             const buf = await generateDynamicSheetXLS(_obj, filename)
 
             res.status(200)
             res.send(buf)
         }
     } catch (error) {
         res.send(error)
     }
 
 }
 
 
 module.exports.get = get;
 