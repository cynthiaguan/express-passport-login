const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const Config = require('./config');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


module.exports =  (passport)  => {
    
    // passport.serializeUser(function(user, cb) {
    //     cb(null, user.id); 
    // });
    
    // // used to deserialize the user
    // passport.deserializeUser(function(id, done) {
    //     User.findById(id, function(err, user) {
    //         cb(err, user);
    //     });
    // });
    passport.use(new LocalStrategy(
        {   usernameField: 'email',
            passwordField: 'password'
        }, 
        (email, password, cb) => {
            if(!email){
                return cb(null, false, {message: "Email not existing"});
            }

            email = email.toLowerCase();
            email = email.trim();

            if(!password){
                return cb(null, false, {message: "Password not existing"});
            }
            return User.findOne({email})
                .then(user => {
                    if(!user) {
                        return cb(null, false, {message: "User not existing"});
                    }
                    //return cb(null, user._id, {message: "User logins sucessfully"});
                    const token = jwt.sign({email:user.email}, Config.jwtKey);
                    return cb(null, token, {message: "User Login"})
                })
                .catch(err => {
                    return cb(err);
                })
        }
      ));
    
    passport.use(new JWTStrategy({
        jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: Config.jwtKey
    }, (jwt_payload, done) => {
        User.findOne({email: jwt_payload.email}, (err, user) => {
            if(err){
                return done(err, false);
            }
            if(user){
                return done(null, user)
            }else{
                return done(null, false);
            }
        })
    }))

    // Use the GoogleStrategy within Passport.
    passport.use(new GoogleStrategy({
        clientID: Config.googleID,
        clientSecret: Config.googleSecret,
        callbackURL: "/auth/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
            console.log('google login successfully');
            console.log(profile)
            User.findOne({ "google.id": profile.id }, function (err, user) {
                if(err) return done(err);
                if(user) return done(null, user);
                let newUser = new User();
                newUser.google.id = profile.id;
                newUser.google.token = accessToken;
                newUser.google.name = profile.displayName;
                if(typeof profile.emails != 'undefined' && profile.emails.length > 0)
                    newUser.google.email = profile.emails[0].value;
                //
                newUser.save(function(err){
                    if(err) return done(err);
                    return done(null, newUser)
                })
            });
      }
    ));
}

