var {secret} = require('../config/config.json');
const db = require('../models');
const expressJwt = require('express-jwt');

module.exports = (roles) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        expressJwt({secret}),
        (req, res, next) => {
            //console.log(req.user);
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(401).json({ message: 'Unauthorized111' });
            }
            if(req.user.role === 'user'){
                 db.user.findOne({
                    where : {
                        id : req.user.id,
                        email : req.user.email,
                        password : req.user.password
                    }
                }).then(function(user){
                    console.log("co user");
                    if(user){
                        next();
                    }
                    else{
                        return res.status(401).json({ message: 'Unauthorized222' });
                    }
                });
            }else if(req.user.role === 'shipper'){
                db.shipper.findOne({
                    where : {
                        id : req.user.id,
                        email : req.user.email,
                        password : req.user.password
                    }
                }).then(function(shipper){
                    if(shipper){
                        next();
                    }
                    else{
                        return res.status(401).json({ message: 'Unauthorized' });
                    }
                });
            }else if(req.user.role === 'admin'){
                db.admin.findOne({
                    where : {
                        id : req.user.id,
                        email : req.user.email,
                        password : req.user.password
                    }
                }).then(function(admin){
                    if(admin){
                        next();
                    }else{
                        return res.status(401).json({ message: 'Unauthorized' });
                    }
                });
            }else if(req.user.role === 'store'){
                db.store.findOne({
                    where : {
                        id : req.user.id,
                        email : req.user.email,
                        password : req.user.password
                    }
                }).then(function(store){
                    if(store){
                        next();
                    }else{
                        return res.status(401).json({ message : 'Unauthorized' });
                    }
                });
            }

        }
    ];
}

