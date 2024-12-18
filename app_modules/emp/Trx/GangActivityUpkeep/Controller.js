const HandlerDB = require('./DatabaseHandler')
const _ = require('lodash')
const { UpdateResult, UpdateResultAsync } = require('../../../../util/HelperUtility')

const table = ['GANGACTIVITY', 'GANGACTIVITYDETAIL']

async function get(req, res, next) {


    await HandlerDB.fetchDataHeader(req.user, req.query, req.route.path.replace("/", ""), (error, result) => {


        if (error) {
            return next(error)
        }
        // if(_.isUndefined(result['data'])||_.isEmpty(result['data'])){
        //     res.send({
        //
        //         ...result,
        //         count: 0
        //     })
        // } else {
        //     // result['data'][0]['total_rows']
        //     res.send({
        //
        //         ...result,
        //         count: result['data'][0]['total_rows']
        //     })
        // }
        const re_result = UpdateResult(result)
        res.send({
            ...result,
            data: re_result,
            count: ((_.isUndefined(result['data']) || _.isEmpty(result['data'])) ? 0 : result['data'][0]['total_rows'])
        })


    })

}

module.exports.get = get;

async function getDetail(req, res, next) {


    await HandlerDB.fetchDataDetail(req.user, req.route.path.replace("/", ""), req.query, async (error, result) => {


        if (error) {
            return next(error)
        }

        const re_result = await UpdateResultAsync(result)


        res.send(
            re_result
            
        )

    })

}

module.exports.getDetail = getDetail;

async function post(req, res, next) {
    const stmt = req;
    const binds = req;


    let rows;
    let errors;



    const document = 'GANG ACTIVITY UPKEEP'

    try {
        await CrudhandlerDB.createmasterdetail(table, document, req.user, req.body, binds)
            .then((result) => {
                

                if (result.error) {
                    errors = result;
                    
                } else {
                    rows = result;
                }
            })
            .catch((error) => {
                
                console.log('error --> ', error, '<---')
                res.status(200).json({ error: error.message, detail: error.stack });
            });

       

        res.status(200).json(rows);
    } catch (error) {
        console.log(error)
        res.status(200).json({ data: [] });
    }
}

module.exports.post = post;

async function put(req, res, next) {

    const stmt = req, binds = req

    let rows, errors, httpstatus, retval;


    try {

        await CrudhandlerDB.insertupdatemasterdetail(table, req.user, req.body, binds)
            .then((v) => res.status(200).json(v))
            .catch((e) => res.status(200).json({ error: e.stack }))


    } catch (error) {

        
        res.status(200).json({ data: [], errormessage: error.message });
    }




}

module.exports.put = put