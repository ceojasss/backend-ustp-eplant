const db = require('./DatabaseHandler')
const _ = require('lodash')

async function get(req, res, next) {



    await db.fetchData(req, (error, result) => {


        if (error) {
            return next(error)
        }

        res.send(result)

    })


}

async function getSingle(req, res, next) {

    // console.log('called')
    try {

        await db.singeleFetch(req, (error, result) => {

            if (error) {
                return next(error)
            }
            res.send(result)

        })

    } catch (error) {

        console.log('catched', error)

        res.send(error)
    }

}

module.exports = {
    get,
    getSingle
}