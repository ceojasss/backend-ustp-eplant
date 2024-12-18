const chart_db = require('./DbChart')
const router = require('express').Router()
const _ = require('lodash')

router.route(`/`)
    .get(async (req, res, next) => {

        console.log(req)

        await chart_db.fetchData(req.user, (error, result) => {
            if (error) {
                return next(error)
            }

            res.send(result)

        })

    })

module.exports = router