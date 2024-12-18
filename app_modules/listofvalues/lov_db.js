const _ = require('lodash')
const database = require('../../oradb/dbHandler')

const fetchData = async function (users, query, callback) {
    let result

    binds = {}
    binds.find = find

    try {
        result = await database.siteExecute(users, query, binds)
    } catch (error) {
        callback(error, '')
    }

    callback('', result)
}


const fetchDataDynamic = async function (users, find, query, callback) {
    let result, error


    try {
        result = await database.siteExecuteDynamicBinds(users, query, find)

    } catch (errors) {

        error = errors
        //callback(error, '')
    }


    callback(error, result)
}

const fetchDatas = async function (users, query, callback) {
    let result

    binds = {}


    try {
        result = await database.siteExecute(users, query, binds)
    } catch (error) {
        callback(error, '')
    }

    callback('', result)
}


module.exports = {
    fetchDataDynamic
    , fetchData,
    fetchDatas
}
