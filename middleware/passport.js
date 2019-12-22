var passport = require('passport');
var passportJWT = require('passport-jwt');
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var secretOrKey = require('../config/secretOrKey');
const db = require('../models');
var jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = secretOrKey


var strategyUser = new JwtStrategy(jwtOptions, function(jwt_payload, next){
    console.log(jwt_payload)
    db.user.findOne({
        where : {
            id : jwt_payload.id,
            email : jwt_payload.email,
            password : jwt_payload.password
        }
    }).then(function(user){
        if(user){
            return next(null, user);
        }else{
            return next(null, false);
        }
    });
});

var strategyShipper = new JwtStrategy(jwtOptions, function(jwt_payload, next){
    db.shipper.findOne({
        where : {
            id : jwt_payload.id,
            email : jwt_payload.email,
            password : jwt_payload.password
        }
    }).then(function(shipper){
        if(shipper){
            return next(null, shipper);
        }else{
            return next(null, false);
        }
    })
});

var strategyAdmin = new JwtStrategy(jwtOptions, function(jwt_payload, next){
    console.log("passport.js:47: Admin received payload:", jwt_payload)
    db.admin.findOne({
        where : {
            id : jwt_payload.id,
            name: jwt_payload.name,
            password: jwt_payload.password
        }
    }).then(function(admin){
        if(admin){
            return next(null, admin);
        }else{
            return next(null, false);
        }
    }).catch(function(err){
        if(err){
            return next(err, false)
        }
    })
});

passport.use('jwt-admin', strategyAdmin);
passport.use('jwt-user', strategyUser);
passport.use('jwt-shipper', strategyShipper);

module.exports = passport;
