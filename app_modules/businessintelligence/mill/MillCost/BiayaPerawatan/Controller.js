const HandlerDb = require ("./DatabaseHandler");
const router = require("express").Router();
const { UpdateResult } = require('../../../../../util/HelperUtility')
const _ = require("lodash")

async function get(req, res, next) {

    // console.log("BaseURl",req.baseUrl);

    await HandlerDb.fetchDataHeader(req.user, _.split(req.baseUrl,'/')[3],req.query, (error, result) => {

        if (error) {
            return next(error)
        }

        const re_result = UpdateResult(result)

        res.send({

            ...result,
            data: re_result,
            count: ((_.isUndefined(result['data']) || _.isEmpty(result['data'])) ? 0 : result['data'][0]['total_rows'])
        })


        /*   res.send({
              
              {
            ...result,
            data: _.map(result.data, (v) => { return { ...v, 'test': { 'b': 'a', 'c': 'd' } } })
        },
              count: ((_.isUndefined(result['data']) || _.isEmpty(result['data'])) ? 0 : result['data'][0]['total_rows'])
          })
    */
    })

}

module.exports.get = get;

// async function getDetail(req, res, next) {

//     // console.log("BaseURl",req);

//     await HandlerDb.fetchDataDetail(req.user, _.split(req.baseUrl,'/')[3], req.query, (error, result) => {

        
//         if (error) {
//             return next(error)
//         }

//         const re_result = UpdateResult(result)

//         res.send({

//             ...result,
//             data: re_result,
//             count: ((_.isUndefined(result['data']) || _.isEmpty(result['data'])) ? 0 : result['data'][0]['total_rows'])
//         })

//     })

// }

// module.exports.getDetail = getDetail;


