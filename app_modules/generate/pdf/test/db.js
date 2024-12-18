const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const fetchData = async function (users, find, query, callback) {
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

    //    console.log(find)

    //  console.log('site D', '<' + users.site + '>')

    try {
        result = await database.fetchTemporaryData(users, query, find)

    } catch (errors) {
        console.log('error fetch', errors.message)
        error = errors.message
        //callback(error, '')
    }


    callback(error, result)
}


module.exports = {
    fetchDataDynamic
    , fetchData
}
