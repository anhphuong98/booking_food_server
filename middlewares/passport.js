const {ExactJwt, Strategy} = require('passport-jwt');
const db = require('../models');
const config = require('../config.js');

const opts = {
    jwtFromRequest: ExactJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
}

const strategyAdmin = new Strategy(opts, (jwt_payload, done) => {
    db.admin.findOne({
        where: {
            id: jwt_payload.id
        }
    }).then(function(admin){
        if(!admin){
            return done(null, false); 
        }
        else {
            return done(null, admin);
        }
    })
});

passport.use('jwt-admin', strategyAdmin);

module.exports = passport;