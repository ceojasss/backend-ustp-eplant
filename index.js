const webServer = require('./services/webServer')
const db = require('./oradb/dbCredentials')
const _ = require('lodash')
// const { fetchDatas } = require('./app_modules/businessintelligence/agronomi/query/dbhandler')
// const fetchDatas  = require('./app_modules/businessintelligence/agronomi/query/dbhandler')

const oracledb = require('oracledb');
const { POOL_STATUS_CLOSED } = require('oracledb');
const dbCredentials = require('./oradb/dbCredentials');


// mysql non active sementara
const pool = require('./mysql/dbCredentials');


// const mysql = require('mysql2/promise');
const mysql = require('mysql2');


const startupx = async () => {
    // do something
    console.log('Starting application');
    console.log('Initializing database modules')


    console.log('params', process.argv[2])
    try {
        _.mapValues(dbCredentials, async function (x) {
            if (!_.isUndefined(x)) {
                await oracledb.createPool(x, async (error, pool) => {
                    if (error) {
                        console.log(error);
                    }
                    console.log(`Connection Pool ${x.poolAlias} Initialized`)

                    await pool.reconfigure({ enableStatistics: true });


                    const poolstatistics = pool.getStatistics();

                    //console.log(`GCM Open Connection : ${pool.connectionsOpen}`);   // how big the pool actually is
                    //  console.log(`GCM Used Connection : ${pool.connectionsInUse}`);  // how many of those connections are held by the application
                    // console.log(`GCM Queue Connection : ${poolstatistics.currentQueueLength}`);  // print one attribute */
                    //     poolstatistics.logStatistics();                  // print all statistics to the console

                })
            }
        })

        console.log('Initializing web server modules')
        await webServer.initialize()


    } catch (err) {
        console.error(err);
        process.exit(1); // Non-zero failure code
    }

    console.log('Application Started.....')
}

const startup = async () => {
    // do something
    console.log('Starting application');
    console.log('Initializing database modules')


    console.log('params', process.argv[2])

    try {

        const site = _.find(dbCredentials, ['poolAlias', process.argv[2]])
        console.log(site)



        // console.log(db)

        if (_.isUndefined(site)) {
            console.error(`site is not Found`);
            process.exit(1); // Non-zero failure code
        } else {
            await oracledb.createPool(site, async (error, pool) => {
                if (error) {
                    console.log(error);
                }
                console.log(`Connection Oracle Pool ${site.poolAlias} Initialized`)

                await pool.reconfigure({ enableStatistics: true });


                const poolstatistics = pool.getStatistics();


            })


            console.log('Initializing web server modules')
            await webServer.initialize(site)
        }

    } catch (err) {
        console.error(err);
        process.exit(1); // Non-zero failure code
    }


    console.log('Application Started.....')

}


//  async function executeQuery(query) {
//     const connection = await pool.promise().getConnection();
//     if(!connection) {
//         console.log("belum konek")
//     } else {
//         console.log(`Connection Mysql Pool Initialized`)
//     }

//     try {
//         const [rows, fields] = await connection.execute(query);
//         return rows;
//       } catch (error) {
//         throw error;
//       } finally {
//         connection.release();
//       }
//   }

//  async function MysqlConnectwithQuery() {
//     try {
//       const query = "SELECT * FROM MST_ALL_MAP WHERE BLOK = 'A006'";
//       const result = await executeQuery(query);
//       console.log(result);
//     } catch (error) {
//       console.error(error);
//     }
//   }


// eplant oracle connection
startup()


// mysql connection with query
// MysqlConnectwithQuery();





const sqlConnect = async () => {
    try {
        const connection = await pool.promise().getConnection();
        if (!connection) {
            console.log("Gagal terhubung ke database");
        } else {
            console.log("Connection Mysql Pool Initialized");
        }
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
    }
};


// // only mysql connection 
sqlConnect()


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


        console.log(`Closing ${process.argv[2]} Connection Pool`)
        await oracledb.getPool(process.argv[2]).close(10);

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

process.on('SIGTERM', () => {
    console.log('Received SIGTERM');

    shutdown()
});

process.on('SIGINT', () => {

    console.log('Received SIGINT IDX');

    shutdown()
});

process.on('uncaughtException', err => {
    console.log('Uncaught exception')
    console.error(err)

    shutdown(err)
});

