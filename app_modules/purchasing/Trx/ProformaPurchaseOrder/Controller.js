const HandlerDB = require('./DatabaseHandler')
const _ = require('lodash')
const { UpdateResult } = require('../../../../util/HelperUtility')

const CrudhandlerDB = require('../../../../oradb/dbCrudHandler')



const table = ['LPPO', 'LPPODETAILS', 'LPRPPO']

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


    await HandlerDB.fetchDataDetail(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {

        //console.log(result)

        if (error) {
            return next(error)
        }

        const re_result = UpdateResult(result)


        res.send(
            // 
            re_result
            // count: (!_.isEmpty(result) ? result['data'][0]['total_rows'] : 0)
        )

    })

}

module.exports.getDetail = getDetail;


async function getLinkedData(req, res, next) {

    // console.log(req.params.prcode)
    //   console.log(req.query.search)
    // res.status(200).send('ok')

    await HandlerDB.fetchDataLinkHeader(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {


        if (error) {
            return next(error)
        }

        if (_.isEmpty(result))
            return res.status(200).send('kosong')

        const re_result = UpdateResult(result)


        res.send(
            re_result

        )

    })

}

module.exports.getLinkedData = getLinkedData;

async function getLinkedDataDetails(req, res, next) {

    // console.log(req.params.prcode)
    //   console.log(req.query.search)
    // res.status(200).send('ok')

    await HandlerDB.fetchDataLinkDetails(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {


        if (error) {
            return next(error)
        }

        if (_.isEmpty(result))
            return res.status(200).send('kosong')

        const re_result = UpdateResult(result)


        res.send(
            re_result

        )

    })

}

module.exports.getLinkedDataDetails = getLinkedDataDetails;



async function post(req, res, next) {
    const stmt = req;
    const binds = req;


    let rows;
    let errors;

    //   console.log(req)

    //  const table = ['JOURNALVOUCHER', 'JVDETAILS']

    const document = req.user.loginid.match(/^.*HO$/) ? 'PROFORMA PURCHASE ORDER HO' : 'PROFORMA PURCHASE ORDER'

    try {
        await CrudhandlerDB.createmasterdetail(table, document, req.user, req.body, binds)
            .then((result) => {
                //   console.log(req.body)

                if (result.error) {
                    errors = result;
                    // res.status(500).json(errors)
                } else {
                    rows = result;
                }
            })
            .catch((error) => {
                //console.log('error kita', error.message)

                //            errors = error
                console.log('error --> ', error, '<---')
                res.status(200).json({ error: error.message, detail: error.stack });
            });

        //console.log(`return -> ${ context.user}`)

        //console.log(`not null -> ${rows} , ${JSON.stringify(rows[0])}`)
        //console.log('error', errors)

        //        res.send(errors)

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

        //console.log('error', JSON.parse(error))

        //   console.log('masuk sini')
        res.status(200).json({ data: [], errormessage: error.message });
    }




}

module.exports.put = put


async function getAgreement(req, res, next) {


    await HandlerDB.CheckAgreement(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {


        if (error) {
            return next(error)
        }

        const re_result = UpdateResult(result)


        res.send(
            // 
            re_result
            // count: (!_.isEmpty(result) ? result['data'][0]['total_rows'] : 0)
        )

    })

}

module.exports.getAgreement = getAgreement;

async function postapp(req, res, next) {


    const rows = await HandlerDB.runEmail(req.user, req.body);

    if (rows) {
        res.status(200).json({
            data: rows
        });
    } else {
        res.status(200).json({ data: [] });
    }

}
module.exports.postapp = postapp;