const _ = require('lodash')
const binf_db = require('./DatabaseHandler')
const dbhandler = require('../../../../oradb/dbHandler')
const { UpdateResult, insertdataHandler, updatedataHandler, deleteDataHandler, sendResult } = require('../../../../util/HelperUtility')

const table = 'supplier_visitation'

async function get(req, res, next) {
    await binf_db.fetchdata(req.user, req.route.path.replace("/", ""), (error, result) => {
        if (error) {
            return next(error)
        }
        sendResult(result, res)

    })
}


async function getFormComponent(req, res, next) {

    let resultResponse, errorResponse

    try {
        await dbhandler
            .getFormComponents(req.user, req.route.path.split('/')[1])
            .then(result => {
                if (result.error) {
                    errorResponse = result
                } else {
                    resultResponse = result
                }
            })
            .catch(error => { errorResponse = { 'error': error.message, 'detail': error.stack } })

    } catch (error) {
        errorResponse = error
    }

    if (errorResponse) {
        res.status(200).json(errorResponse)
    } else {
        res.status(200).json({ formComps: resultResponse })
    }
}


async function getdynamic(req, res, next) {
    await binf_db.fetchDynamic(req.user, req.route.path.replace("/", ""), (error, result) => {
        if (error) {
            return next(error)
        }
        res.send(result)
    })
}


async function post(req, res, next) {

    const stmt = req
    const binds = req

    let resultResponse


    try {
        await dbhandler
            .insertdataFile(table, req.user, req.body, binds)
            .then(result => resultResponse = result)
            .catch(error => resultResponse = { 'error': error.message, 'detail': error.stack });

    } catch (error) {
        resultResponse = error
    }



    res.status(200).json(resultResponse)


}

async function update(req, res, next) {
    await updatedataHandler(table, req, res)
}

async function hapus(req, res, next) {
    await deleteDataHandler(table, req, res);
}


module.exports = {
    hapus, getdynamic, get, getFormComponent, post, update
}