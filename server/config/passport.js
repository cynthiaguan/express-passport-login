const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

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
                    const token = jwt.sign({email:user.email}, "LOGIN_DEMO_SECRET");
                    return cb(null, token, {message: "User Login"})
                })
                .catch(err => {
                    return cb(err);
                })
        }
      ));
    
    passport.use(new JWTStrategy({
        jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: "LOGIN_DEMO_SECRET"
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
}

