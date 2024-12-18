const mysql = require('mysql2');

const pool3 = mysql.createPool({
  host: '10.20.10.215',
  user: 'root',
  password: 'p@ssw0rd',
  database: 'jsonmap',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const pool = mysql.createPool({
  host: '10.20.10.216',
  user: 'fajar',
  password: 'p@ssw0rd',
  database: 'MAPS_2024',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000
});

/* function createPool() {
  return mysql.createPool({
    host: '10.20.10.216',
    user: 'fajar',
    password: 'p@ssw0rd',
    database: 'MAPS_2024',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000
  });
} */

module.exports = pool

/* const getPool = function getPool() {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

module.exports = getPool; */