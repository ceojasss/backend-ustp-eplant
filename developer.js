const webServer = require('./services/webServer')
const _ = require('lodash')

const oracledb = require('oracledb');
const dbCredentials = require('./oradb/dbCredentials');

const mysql = require('./mysql/dbCredentials'); // Adjust the path as needed
const { param } = require('./app_modules/cashbank');


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


            if (site.poolAlias === sitepick.toUpperCase() || site.poolAlias === 'APPS') {
                try {

                    await oracledb.createPool(site, async (error, pool) => {
                        if (error) {
                            console.log(error);
                        }
                        console.log(`Connection Pool ${site.poolAlias} Initialized`)

                        await pool.reconfigure({ enableStatistics: true });


                        const poolstatistics = pool.getStatistics();


                        //console.log(poolstatistics)
                    })
                } catch (error) {
                    console.error('error pool ', site.poolAlias, error);
                }
            }
        })

        console.log('Initializing web server modules')

        // await webServer.initialize(dbCredentials.appsPool).then(x => { console.log('return promise', x)})

        await webServer.initialize(dbCredentials.appsPool)


    } catch (err) {
        console.error('startup error', err);
        await webServer.closed()
        //     process.exit(1); // Non-zero failure code
    }


    await mysql.getConnection(function (params) {
        console.log(params)
    })

    //console.log('mysql ' + conn)


    console.log('Application Started.....')


}

startup()

const shutdown = async (e) => {
    let err = e



    try {

        _.map(dbCredentials, async site => {

            if (!oracledb.getPool(site.poolAlias))
                return;


            //            if (site.poolAlias === sitepick || site.poolAlias === 'APPS') {
            try {
                if (oracledb.getPool(site.poolAlias)) {

                    //console.log('Releasing Pool ' + site.poolAlias)

                    await oracledb.getPool(site.poolAlias).close()

                    console.log('Pool Released' + site.poolAlias)

                }

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

    console.log('Received SIGINT on Dev');

    shutdown()
});

process.on('uncaughtException', err => {
    console.log('Uncaught Exception', err)

    shutdownForce(err)
});