var passport = require('passport');
var passportJWT = require('passport-jwt');
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var secretOrKey = require('../config/secretOrKey');
const db = require('../models');
var jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = secretOrKey


var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next){
    db.user.findOne({
        where : {
            id : jwt_payload.id
        }
    }).then(function(user){
        if(user){
            return next(null, user);
        }else{
            return next(null, false);
        }
    });
});

var strategy1 = new JwtStrategy(jwtOptions, function(jwt_payload, next){
    db.shipper.findOne({
        where : {
            id : jwt_payload.id
        }
    }).then(function(shipper){
        if(shipper){
            return next(null, shipper);
        }else{
            return next(null, false);
        }
    })
});

passport.use('jwt-user', strategy);
passport.use('jwt-shipper', strategy1);
module.exports = passport;
