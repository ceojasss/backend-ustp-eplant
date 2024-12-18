const passport = require('passport')

const authentication_db = require('../app_modules/authentication/authentication_db')
const config = require('../config/web-config')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const LocalStrategy = require('passport-local')


const localOptions = {
    usernameField: 'loginid',
    passReqToCallback: true,
    ignoreExpiration: false
}

const localLogin = new LocalStrategy(localOptions, (req, loginid, password, done) => {
    // verifiy user & pass , call done
    // if true 

    //  console.log('lgin aja LOGIN', req.url)



    if (req.url === '/vsignin') {
        authentication_db.isValidPass(loginid, password, (err, user) => {
            if (err) {
                return done(err)
            }

            if (!user) {
                return done(null, false)
            }

            return done(null, user)
        })


    }
    else if (req.url === '/signkey') {

        //        console.log('masuk sini', req.body)

        authentication_db.authorizeKey(req.body.key, (err, company) => {
            if (err) { return done(err) }


            if (!company) {
                return done(null, false)
            }

            return done(null, company)
        })


    } else {


        authentication_db.findUser(loginid, (err, user) => {
            if (err) {
                return done(err)
            }

            if (!user) {
                return done(null, false)
            }

            authentication_db.checkAppsUserCompany(loginid, req.body.site, (err, company) => {
                if (err) { return done(err) }

                if (!company) {
                    return done(null, false)
                }

                authentication_db.checkPassword(loginid, password, (err, userMatch) => {
                    if (err) { return done(err) }

                    if (!userMatch) {
                        return done(null, false)
                    }

                    return done(null, user)

                })


            })
        })

    }



})


//setup jwt
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret,
    ignoreExpiration: false
}

//jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {

    if (payload.site === 'WEB') {
        done(null, payload)
    } else {

        //        console.log('payload', payload)

        authentication_db.checkUserCompany(payload.sub, payload.site, function (err, user) {

            if (err) {
                return done(err, false)
            }

            if (user) {
                done(null, user)
            } else {
                done(null, false)
            }
        })
    }
})



// tell passport to use this strategy
passport.use(localLogin)
passport.use(jwtLogin)