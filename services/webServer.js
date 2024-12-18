/*=============================================================================
 |       Author:  Gunadi Rismananda
 |         Dept:  IT - USTP
 |          
 |  Description:  Handling Express Webserver on node js 
 |
 | Dependencies:  express     --> webserver framework 
 |                body-parser --> parsing semua request http menjadi JSON
 |                morgan      --> Untuk Logging HTTP Traffic.                  
 |                
 |
 *===========================================================================*/

const http = require('http')
const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const _ = require('lodash')
const morgan = require('morgan')
const cors = require('cors')
const passport = require('passport')

const requireAuth = passport.authenticate('jwt', { session: false })
const router = require('./router')

var fs = require('fs');
const regexIso8601 = '/(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})[+-](\d{2})\:(\d{2})/'

let httpServer

if (!_.isUndefined(process.env.SSL_KEY_FILE)) {
    var privateKey = fs.readFileSync(process.env.SSL_KEY_FILE, 'utf8');
    // var privateKey  = fs.readFileSync('./ustp.co.id.key', 'utf8');
    var certificate = fs.readFileSync(process.env.SSL_CRT_FILE, 'utf8');
    var chain = fs.readFileSync(process.env.SSL_CA_FILE, 'utf8');

    // var certificate = fs.readFileSync('./star_ustp_co_id_cert.pem', 'utf8');
    var credentials = { key: privateKey, cert: certificate, ca: chain };
}

initialize = (site) => {
    return new Promise((resolve, reject) => {
        const app = express()
        if (_.isUndefined(process.env.SSL_CRT_FILE)) {
            httpServer = http.createServer(app)
        } else {
            httpServer = https.createServer(credentials, app)
        }
        app.use(express.json({ limit: '10mb' }));
        app.use(bodyParser.json({ reviver: reviveDates }))
        app.use(morgan('combined'))
        app.use(handleUnexpectedError)
        app.use(cors())
        app.use(express.json());
        app.use(express.urlencoded({
            extended: true
        }));


        app.use(cookieParser())
        app.use(passport.initialize());
        app.set('trust proxy', true);
        app.set('trust proxy', 'loopback') // specify a single subnet
        app.set('trust proxy', 'loopback, 123.123.123.123') // specify a subnet and an address
        app.set('trust proxy', 'loopback, linklocal, uniquelocal') // specify multiple subnets as CSV
        app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']) // specify multiple subnets as an array
        app.use('/api', router)

        app.use(requireAuth, express.static('uploads'))
        app.use(requireAuth, express.static('output'))


        httpServer.listen(site.port, '0.0.0.0')
            .on('listening', () => {
                console.log(`Web server listening on localhost PORT:${site.port}`);
                console.log(`Path : ${__dirname}`);

                resolve()
            })
            .on('error', err => {
                reject(err)
            })
    })
}



closed = () => {
    return new Promise((resolve, reject) => {

        /*      Object.keys(socketMap).forEach(function (socketKey) {
                 socketMap[socketKey].destroy();
             });
  */

        console.log('Closing Web Server')
        httpServer.close(function (err) {



            if (err) {
                console.log('error close', err)
                reject(err)
                return
            }
            console.log('Web Server Close')
            resolve()
        });
    });
}


handleUnexpectedError = (err, req, res, next) => {
    console.log('An Unexpected error happen', err)
    res.status(500).send({ result: 'error', message: `An errror has occrued contact your wizards  ${err}`, request: req.body })

}

reviveDates = (key, value) => {
    var match;
    if (typeof value === "string" && (match = value.match(regexIso8601))) {
        var milliseconds = Date.parse(match[0]);
        if (!isNaN(milliseconds)) {
            return new Date(milliseconds)
        }
    }
    return value
}

module.exports.initialize = initialize
module.exports.closed = closed