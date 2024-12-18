const db = require('./DatabaseHandler')

async function get(req, res, next) {



    await db.fetchClobData(req, async (error, result) => {
        if (error) {
            return next(error)
        }


        //        console.log('result', result.data[0].rows)
        //console.log(result.data[0].content.rows[0].QUERY_STATEMENT)

        //        console.log(result.data[0]?.rows)

        if (result.data[0]?.rows) {

            await db.fetchStmt(req, result.data[0]?.rows, (error, retval) => {
                if (error) {
                    return next(error)
                }


                res.send(retval)

            })
        } else {

            console.log('empty')
            res.send(null)

        }


    })


}

async function getSingle(req, res, next) {

    // console.log('called')

    await db.singeleFetch(req, (error, result) => {
        if (error) {
            return next(error)
        }
        //  console.log(result)

        //console.log(result.data[0].content.rows[0].QUERY_STATEMENT)


        res.send(result)

    })


}

module.exports = {
    get,
    getSingle
}