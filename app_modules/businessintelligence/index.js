const router = require('express').Router();

const dailydashboard = require('../businessintelligence/dailydashboard')
const mill = require('../businessintelligence/mill')
const agronomi = require('../businessintelligence/agronomi')

router.use('/dailydashboard', dailydashboard)
router.use('/mill', mill)
router.use('/agronomi', agronomi)


module.exports = router;