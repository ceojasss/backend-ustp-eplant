const _ = require('lodash');
const router = require('express').Router();
const oracledb = require('oracledb');
const { getdbCreds } = require('../../oradb/dbHandler');
const dbCredentials = require('../../oradb/dbCredentials');





async function monitorConnectionPools(cb) {


    const connectionPool = []


    const promises = _.map(dbCredentials, async site => {

        //        console.log(site)

        let statistics

        if (_.isUndefined(site))
            return;

        //            if (site.poolAlias === sitepick || site.poolAlias === 'APPS') {
        try {

            const pool = await oracledb.getPool(site.poolAlias)
            statistics = await pool.getStatistics();

            //console.log(site.poolAlias, statistics)



        } catch (error) {
            //            console.error(`[${site.poolAlias}] Error occurred while monitoring connection pool:`, error);
            //  connectionPool.push({ pool: site.poolAlias, status: 'offline' })

            statistics = 'Database API Connection Offline'

        }

        connectionPool.push({ pool: site.poolAlias, status: statistics })



        //          }



    })

    await Promise.all(promises);


    cb(connectionPool);
}


router.route(`/`)
    .get(

        async function get(req, res, next) {
            //dbConnection = getdbCreds(user.site)

            connectionPool = []

            await monitorConnectionPools((con) => res.json(con))




        }

    )

module.exports = router;