const vendorcontroller = require('./controller')
const router = require('express').Router()
const _ = require('lodash')

router
    .route(`/`)
    .get(async (req, res, next) => {


        res.send(req.user)

    })

router
    .route(`/:id`)
    .get(vendorcontroller.get)
    .put(vendorcontroller.update)

router.route(`/form/:type`)
    .get(vendorcontroller.vendor)


module.exports = router