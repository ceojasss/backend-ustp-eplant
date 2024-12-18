module.exports = {
    appsPool: {
        user: 'EPMSAPPS',
        password: 'EPMSAPPS',
        connectString: process.env.CONNECTIONSTRING,
        poolAlias: 'APPS',
        poolMin: Number(process.env.ORACLE_POOL_MIN),
        poolMax: Number(process.env.ORACLE_POOL_MAX),
        queueTimeout: 120000,
        port: 3000
    },
    gcmPool: {
        user: 'EPMS_GCM',
        password: 'EPMS',
        connectString: process.env.CONNECTIONSTRING,
        poolAlias: 'GCM',
        poolMin: Number(process.env.ORACLE_POOL_MIN),
        poolMax: Number(process.env.ORACLE_POOL_MAX),
        queueTimeout: 120000,
        port: 3100
        /*   queueMax: 0,
          poolMax: 1,
          poolTimeout: 1,
          queueTimeout: 1 */
    },
    smgPool: {
        user: 'EPMS_SMG',
        password: 'EPMS',
        connectString: process.env.CONNECTIONSTRING,
        poolAlias: 'SMG',
        poolMin: Number(process.env.ORACLE_POOL_MIN),
        poolMax: Number(process.env.ORACLE_POOL_MAX),
        queueTimeout: 120000,
        port: 3200
    },
    sbePool: {
        user: 'EPMS_SBE',
        password: 'EPMS',
        connectString: process.env.CONNECTIONSTRING,
        poolAlias: 'SBE',
        poolMin: Number(process.env.ORACLE_POOL_MIN),
        poolMax: Number(process.env.ORACLE_POOL_MAX),
        queueTimeout: 120000,
        port: 3300
    },
    slmPool: {
        user: 'EPMS_SLM',
        password: 'EPMS',
        connectString: process.env.CONNECTIONSTRING,
        poolAlias: 'SLM',
        poolMin: Number(process.env.ORACLE_POOL_MIN),
        poolMax: Number(process.env.ORACLE_POOL_MAX),
        queueTimeout: 120000,
        port: 3400
    },
    sjePool: {
        user: 'EPMS_SJE',
        password: 'EPMS',
        connectString: process.env.CONNECTIONSTRING,
        poolAlias: 'SJE',
        poolMin: Number(process.env.ORACLE_POOL_MIN),
        poolMax: Number(process.env.ORACLE_POOL_MAX),
        queueTimeout: 120000,
        port: 3500
    },
    usPool: {
        user: 'EPMS_USTP',
        password: 'EPMS',
        connectString: process.env.CONNECTIONSTRING,
        poolAlias: 'USTP',
        poolMin: Number(process.env.ORACLE_POOL_MIN),
        poolMax: Number(process.env.ORACLE_POOL_MAX),
        port: 3600
    },
    webPool: {
        user: 'EPMS_WEB',
        password: 'EPMS',
        connectString: process.env.CONNECTIONSTRING,
        poolAlias: 'WEB',
        poolMin: Number(process.env.ORACLE_POOL_MIN),
        poolMax: Number(process.env.ORACLE_POOL_MAX),
        port: 3700
    },
    tstPool: {
        user: 'EPMS_TST',
        password: 'EPMS',
        connectString: process.env.CONNECTIONSTRING,
        poolAlias: 'TST',
        poolMin: Number(process.env.ORACLE_POOL_MIN),
        poolMax: Number(process.env.ORACLE_POOL_MAX),
        port: 3800
    },
    jwtSecretKey: process.env.JWT_KEY
};