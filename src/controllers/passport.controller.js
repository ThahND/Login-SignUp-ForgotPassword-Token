const config = require('../config/fb-gg.config');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const serviceUsers = require('../services/users.service');


module.exports = (passport) => {
    passport.use(new FacebookStrategy({
        clientID: config.facebook_key,
        clientSecret: config.facebook_secret,
        callbackURL: config.callback_url,
        profileFields: ['id', 'displayName', 'name', 'email']
    },
        (accessToken, refreshToken, profile, cb) => {
            // console.log({ profile: profile });
            process.nextTick(async() => {
                let _email = `${profile.id}.10`;
                await serviceUsers.findOneOrCreate_FB_GG(_email)
                    .then(result => {
                        let _user = {
                            id: result[0].dataValues.id,
                            email: result[0].dataValues.email,
                            v: result[0].dataValues.accounttype,
                            avatar: result[0].dataValues.avatar
                        }
                        return cb(null, _user);
                    })
                    .catch(err => {
                        return cb(err);
                    })
                // return cb(null, profile);
            })
        }
    ));

    passport.use(new GoogleStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL
    },
        (accessToken, refreshToken, profile, cb) => {
            // console.log({ profile: profile });
            process.nextTick(async() => {
                let _email = `${profile.id}.11`;
                await serviceUsers.findOneOrCreate_FB_GG(_email)
                    .then(result => {
                        let _user = {
                            id: result[0].dataValues.id,
                            email: result[0].dataValues.email,
                            v: result[0].dataValues.accounttype,
                            avatar: result[0].dataValues.avatar
                        }
                        return cb(null, _user);
                    })
                    .catch(err => {
                        return cb(err);
                    })
                // return cb(null, profile);
            })
        }
    ));

    // (B2) // Thông tin trả về sẽ được lưu ở req.session.passport.user
    passport.serializeUser((user, cb) => {
        return cb(null, 'user');
    });
    // // (B3)
    // passport.deserializeUser((userObj, cb) => {
    //     return cb(null, userObj)
    // });
}
