const mysql  = require("mysql2");
const dbCreds = require('./dbCredentials')


const getdbCreds = (sites) => {

    switch (sites) {
        case 'GCM':
            return dbCreds.gcmPool.poolAlias;
        case 'SMG':
            return dbCreds.smgPool.poolAlias;
        case 'SBE':
            return dbCreds.sbePool.poolAlias;
        case 'SLM':
            return dbCreds.slmPool.poolAlias;
        case 'SJE':
            return dbCreds.sjePool.poolAlias;
        case 'EPMSAPPS':
            return dbCreds.usPool.poolAlias;
        case 'AGRO':
            return dbCreds.usPool.poolAlias;
        default:
            return dbCreds.appsPool.poolAlias;
    }

}

// const dbconfig
const siteWithAgroExecute = async (users, routes, statement) => {
    console.log('DBHANDLER Agronomi')
    return new Promise(async (resolve, reject) => {
        let conn;
        let dbConnection;

        /*         opts.outFormat = oracledb.OBJECT; */

        // console.log()


        binds = {}
        binds.route = routes.match('/') ? routes.substr(0, routes.indexOf('/')) : routes
        // console.log(binds)



        dbConnection = getdbCreds(users.site)

        try {
            conn = await oracledb.getConnection(dbConnection);

            const result1 = await conn.execute(statement, binds)
            console.log(result1)
            resolve({ data: result1.rows })//)}, { columndata: result2.rows }])
            // console.log('resolve' )
                    //    Object.assign(t[o.key] = t[o.key] || {}, o)

        } catch (err) {
            reject(err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close()
                } catch (err) {
                    // console.log('error db',err)
                }
            }
        }
    });
}
module.exports = {
    siteWithAgroExecute,
    getdbCreds,
    
}
