const _ = require('lodash')
const jwt = require('jsonwebtoken')
const config = require('../../config/web-config')
const moment = require('moment-timezone')
const authentication_db = require('./authentication_db')



const tokenForUser = (user) => {
    const date = Date.parse(moment.utc().tz("Asia/Jakarta").hours(25).startOf('hour').format())
    // console.log(date);
    const timeStamp = Math.floor(Date.now() / 1000)
    const exp = Math.floor(date / 1000)
    // console.log(exp)
    // console.log(user)
    //    return jwt.encode({ sub: user.loginid, site: user.site, iat: timeStamp }, config.secret)

    return jwt.sign({
        sub: user.loginid,
        site: user.site,
        location: user.location,
        usersite: user.paramcode,
        department: user.department,
        iat: timeStamp,
        openperiod: user.currentdate,
        sitename: user.sitename,
        empcode: user.empcode,
        exp: exp,
        companyname: user.companyname,
    }, config.secret)
}

exports.checkUserExists = async (req, res, next) => {
    let userMatch = {}, users, err = ''


    await authentication_db.checkUser(req.body.loginid, (err, v) => {

        //console.log(v)

        if (err)
            error = err

        userMatch = _.isUndefined(v) ? 'not found' : 'exist'

    });


    if (err) {
        res.json(err)
    }
    else {
        res.send(userMatch)
    }

}

exports.authSite = async (req, res, next) => {
    let userMatch = {}, result, err = ''

    //console.log(req)

    await authentication_db.AuthorizedSite(req.query.loginid, (err, v) => {


        if (err)
            error = err

        result = v

    });


    if (err) {
        res.json(err)
    }
    else {
        res.send(result)
    }

}

exports.signin = async (req, res, next) => {
    // user already in database 
    // return token

    let userMatch, users = ''

    await authentication_db.checkPassword(req.body.loginid, req.body.password, (err, v) => {
        userMatch = v
    });

    await authentication_db.checkAppsUserCompany(userMatch.LOGINID, req.body.site, (err, v) => {
        users = v
    })

    if (!res.headersSent) // if doesn't sent yet
        res.json({ token: tokenForUser(users) })


}

exports.signKey = async (req, res, next) => {
    // user already in database 
    // return token

    console.log('run signin on')

    let userMatch, users = ''

    //    await authentication_db.checkPassword(req.body.loginid, req.body.password, (err, v) => { userMatch = v });

    //  await authentication_db.checkAppsUserCompany(userMatch.LOGINID, req.body.site, (err, v) => { users = v })

    await authentication_db.authorizeKey(req.body.key, (err, v) => { users = v })



    if (!res.headersSent) // if doesn't sent yet
        res.json({ token: tokenForUser(users) })


}


exports.signinv2 = async (req, res, next) => {
    // user already in database 
    // return token

    let userMatch, users = ''

    //console.log('run')
    await authentication_db.checkPassword(req.body.loginid, req.body.password, (err, v) => {
        userMatch = v
    });


    //    console.log('1', userMatch)

    await authentication_db.checkAppsUserCompany(userMatch.LOGINID, req.body.site, (err, v) => {
        users = v
    })

    // console.log('2', users)


    if (!res.headersSent) // if doesn't sent yet
        res.json({ token: tokenForUser(users) })


}


exports.vendorSignIn = async (req, res, next) => {
    // user already in database 
    // return token

    let userMatch, users = ''


    // console.log('run')

    await authentication_db.isValidPass(req.body.loginid, req.body.password, (err, v) => {
        users = v
    });



    //  console.log(users)

    if (!res.headersSent) // if doesn't sent yet
        res.json({ token: tokenForUser(users) })


}

exports.swap = async (req, res, next) => {
    // run when token is valid, 
    // swap site in object and re-create token
    let userMatch, exists, users

    users = _.clone(req.user);

    await authentication_db.checkUserAccess(req.user, req.body.site, (err, v) => { exists = v })


    if (exists.exists === 0) {
        res.json({ status: 'invalid site' })
    } else {

        _.set(users, 'site', req.body.site)

        if (!res.headersSent) // if doesn't sent yet
            res.json({ status: 'success', token: tokenForUser(users) })
    }
}