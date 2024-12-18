const { sendResult } = require('../../../../util/HelperUtility')
const db = require('./DatabaseHandler')
const router = require('express').Router()
const _ = require('lodash')

async function get(req, res, next) {



    await db.fetchData(req, (error, result) => {
        if (error) {
            return next(error)
        }

        //console.log(result.data[0].content.rows[0].QUERY_STATEMENT)


        res.send(result)

    })


}

async function getreportlist(req, res, next) {

    // console.log('run request')

    await db.fetchList(req, (error, result) => {
        if (error) {
            return next(error)
        }

        //console.log(result.data[0].content.rows[0].QUERY_STATEMENT)


        sendResult(result, res)

    })


}



module.exports = {
    get,
    getreportlist
}