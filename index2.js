const webServer = require('./services/webServer')
const db = require('./oradb/dbCredentials')
const _ = require('lodash')

const oracledb = require('oracledb');
const { POOL_STATUS_CLOSED } = require('oracledb');
const dbCredentials = require('./oradb/dbCredentials');


const startup = async () => {
    // do something
    console.log('Starting application');
    console.log('Initializing database modules')


    //  console.log('params', process.argv[2])

    let sitepick = process.argv[2]

    try {

        _.map(dbCredentials, async site => {

            if (_.isUndefined(site))
                return;


            //            if (site.poolAlias === sitepick || site.poolAlias === 'APPS') {
            try {

                await oracledb.createPool(site, async (error, pool) => {
                    if (error) {
                        console.log(error);
                    }
                    console.log(`Connection Pool ${site.poolAlias} Initialized`)

                    await pool.reconfigure({ enableStatistics: true });


                    const poolstatistics = pool.getStatistics();
                })
            } catch (error) {
                console.error('error pool ', site.poolAlias, error);
            }
            //          }
        })

        console.log('Initializing web server modules')
        console.log('poolsize ', process.env.UV_THREADPOOL_SIZE)

        await webServer.initialize(dbCredentials.appsPool).then(x => {
            console.log('return promise', x)
        })

    } catch (err) {
        console.error('startup error', err);
        await webServer.closed()
        //     process.exit(1); // Non-zero failure code
    }

    console.log('Application Started.....')

}

startup()

const shutdownx = async (e) => {
    let err = e

    console.log('Shutting down application')

    //   console.log(oracledb.getPool())

    try {

        _.mapValues(dbCredentials, async function (x) {
            if (!_.isUndefined(x)) {
                console.log(`Closing ${x.poolAlias} Connection Pool`)
                await oracledb.getPool(x.poolAlias).close(10);
            }
        })

        console.log('Closing web server module')
        await webServer.closed()
        console.log('Closing web server module Done')
    } catch (e) {
        console.error(e)

        err = err || e;
    }

    console.log('Exiting process')

    if (err) {
        process.exit(1)// Non-zero failure code
    } else {
        process.exit(0)
    }
}

const shutdown = async (e) => {
    let err = e

    console.log('Shutting down application')

    //   console.log(oracledb.getPool())

    try {

        _.map(dbCredentials, async site => {

            if (oracledb.getPool(site.poolAlias))
                return;


            //            if (site.poolAlias === sitepick || site.poolAlias === 'APPS') {
            try {
                // if (oracledb.getPool(site.poolAlias))
                await oracledb.getPool(site.poolAlias).close()

            } catch (error) {
                console.error('error pool ', site.poolAlias, error);

                err = err || error;

            }
            //          }
        })

        await webServer.closed()

        console.log('Closing web server module Done')
    } catch (e) {
        console.error(e)

        err = err || e;
    }

    console.log('Exiting process')

    if (err) {
        process.exit(1)// Non-zero failure codez
    } else {
        process.exit(0)
    }
}

const shutdownForce = async (e) => {
    let err = e

    console.log('Forcing Shutting down application')

    //   console.log(oracledb.getPool())

    try {



        await webServer.closed()

        console.log('Closing web server module Done')
    } catch (e) {
        console.error(e)

        err = err || e;
    }

    console.log('Exiting process')

    if (err) {
        process.exit(1)// Non-zero failure codez
    } else {
        process.exit(0)
    }
}


process.on('SIGTERM', () => {
    console.log('Received SIGTERM - shutdown');

    shutdown()
});

process.on('SIGINT', () => {

    console.log('Received SIGINT IDX2');

    shutdown()
});


process.on('beforeExit', (code) => {
    console.log('Process beforeExit event with code: ', code);
});


process.on('uncaughtException', err => {

    console.log('Uncaught Exception Error')

    console.error(err)

    shutdownForce(err)
});