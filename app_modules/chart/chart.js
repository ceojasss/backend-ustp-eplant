const chart_db = require('./chart_db')
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

router.route(`/chartdua`)
    .get(async (req, res, next) => {

        console.log(req)

        await chart_db.fetchDataDua(req.user, (error, result) => {
            if (error) {
                return next(error)
            }

            res.send(result)

        })

    })


// panen
router.route(`/charttigapanen`)
    .get(async (req, res, next) => {

        console.log(req)

        await chart_db.fetchDataTigaPanen(req.user, (error, result) => {
            if (error) {
                return next(error)
            }

            res.send(result)

        })

    })


// rawat
router.route(`/charttigarawat`)
    .get(async (req, res, next) => {

        console.log(req)

        await chart_db.fetchDataTigaRawat(req.user, (error, result) => {
            if (error) {
                return next(error)
            }

            res.send(result)

        })

    })

router.route(`/chartempatdumptruk`)
    .get(async (req, res, next) => {

        console.log(req)

        await chart_db.fetchDataEmpatDumptruk(req.user, (error, result) => {
            if (error) {
                return next(error)
            }

            res.send(result)

        })

    })

router.route(`/chartempatalatberat`)
    .get(async (req, res, next) => {

        console.log(req)

        await chart_db.fetchDataEmpatAlatberat(req.user, (error, result) => {
            if (error) {
                return next(error)
            }

            res.send(result)

        })

    })

router.route(`/chartlima`)
    .get(async (req, res, next) => {

        console.log(req)

        await chart_db.fetchDataLima(req.user, (error, result) => {
            if (error) {
                return next(error)
            }

            res.send(result)

        })

    })



// linechart
router.route(`/chartenam`)
    .get(async (req, res, next) => {

        console.log(req)

        await chart_db.fetchDataEnam(req.user, (error, result) => {
            if (error) {
                return next(error)
            }

            res.send(result)

        })

    })

router.route(`/charttujuh`)
    .get(async (req, res, next) => {

        console.log(req)

        await chart_db.fetchDataTujuh(req.user, (error, result) => {
            if (error) {
                return next(error)
            }

            res.send(result)

        })

    })


router.route(`/chartdelapan`)
    .get(async (req, res, next) => {

        console.log(req)

        await chart_db.fetchDataDelapan(req.user, (error, result) => {
            if (error) {
                return next(error)
            }

            res.send(result)

        })

    })

router.route(`/chartsembilan`)
    .get(async (req, res, next) => {

        console.log(req)

        await chart_db.fetchDataSembilan(req.user, (error, result) => {
            if (error) {
                return next(error)
            }

            res.send(result)

        })

    })
module.exports = router