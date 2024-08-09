require('dotenv').config();

var config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    connectionTimeout: 60000,
    requestTimeout: 60000,
    port: 1433,
    parseJSON: true,
    options: {
        encrypt: false,
        enableArithAbort: true
    },
    pool: {
        max: 100,
        min: 1,
        idleTimeoutMillis: 30000
    }
};

module.exports.config = config;