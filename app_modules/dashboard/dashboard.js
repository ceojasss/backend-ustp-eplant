const dashboard_db = require('./dashboard_db')
const router = require('express').Router()
const _ = require('lodash')

router.route(`/`)
    .get(async (req, res, next) => {

        //console.log(req)

        await dashboard_db.fetchData(req.user, (error, result) => {
            if (error) {
                return next(error)
            }


            //    ConstantSourceNode
            //res.send(result)




            res.send(result)

        })

    })

module.exports = router