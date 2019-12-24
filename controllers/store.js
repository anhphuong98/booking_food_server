const db = require('../models');
const bcrypt  = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);
var config = require('../config/config.json');

const login = function(req, res){
    db.store.findOne({
        where : {
            email : req.body.email
        }
    }).then(store => {
        if(!store){
            res.json({
                success : false,
                message : "Tai khoan khong ton tai"
            });
        }
        var passwordIsValid = bcrypt.compareSync(req.body.password, store.password);
        if(!passwordIsValid){
            res.json({
                success : false,
                message : "Mat khau khong chinh xac"
            });
        }
        var accountActive = (store.status == 1);
        if(accountActive){
            res.json({
                success : false,
                message : "Tai khoan bi khoa"
            });
        }
        var payload = {
            id : store.id,
            email : store.email,
            role : 'store'
        }
        var token = jwt.sign(payload, config.secret, {
            expiresIn : 3600
        });
        res.json({
            success : true,
            token : token,
            data : {
                id : store.id,
                email : store.email,
                name : store.name,
                url_image : store.url_image
            }
        });
    });
}

const register = function(req, res){
    db.store.findOne({
        where : {
            email : req.body.email
        }
    }).then(function(store){
        if(store){
            res.json({
                success : false,
                message : "Tai khoan da ton tai"
            });
        }else{
            db.store.create({
                name : req.body.name,
                email : req.body.email,
                password : bcrypt.hashSync(req.body.password, salt),
                phone : req.body.phone,
                address : req.body.address,
                url_image : req.body.url_image,
                open_time : req.body.open_time,
                close_time : req.body.close_time
            }).then(function(account){
                res.json({
                    success : true,
                    message : "Tao tai khoan thanh cong",
                    data : account
                });
            });
        }
    });
}

const index = function(req, res){
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);

    const limit = pageSize ? pageSize : 20;
    const offset = page ? page*limit : 0;
    db.store.findAndCountAll({limit: limit, offset: offset}).then(function(data){
        data.page = page ? page : 0;
        data.pageSize = limit;
        res.status(200).json(data);
    })
}


const show = function(req, res){
    db.store.findOne({
        where : {
            id : req.params.id
        }
    }).then(function(store){
        if(!store){
            res.json({
                success : false,
                message : "Lay thong tin that bai"
            });
        }else{
            res.json({
                success : true,
                data : {
                    id: store.id,
                    email: store.email, 
                    name: store.name,
                    phone: store.phone, 
                    address: store.address,
                    url_image: store.url_image,
                    open_time: store.open_time, 
                    close_time: store.close_time
                }
            })
        }
    });
}

const destroy = function(req, res){
    db.store.findOne({
        where : {
            id : req.params.id
        }
    }).then(function(store){
        if(!store){
            res.json({
                success : false,
                message : "Tai khoan khong ton tai"
            });
        }else{
            store.destroy().then(function(){
                res.json({
                    success : true,
                    message : "Xoa tai khoan thanh cong"
                })
            });
        }
    });
}


const update = function(req, res){
     if(req.user.role === 'admin'){
        db.store.update({
            name : req.body.name,
            phone : req.body.phone,
            address : req.body.address,
            password :  bcrypt.hashSync(req.body.password, salt),
            url_image : req.body.url_image,
            close_time : req.body.close_time,
            open_time : req.body.open_time,
            status : req.body.status
        },{
            where : {
                id : req.params.id
            }
        }).then(user => {
            res.json({
                success : true,
                message : "Cap nhat thong tin thanh cong"
            });
        });
    }else{
        if(req.user.id != req.params.id){
            res.json({
                success : false,
                message : "Cap nhat thong tin that bai"
            })
        }
        if(req.body.password){
            db.store.update({
                password : bcrypt.hashSync(req.body.password, salt)
            }, {
                where : {
                    id : req.user.id
                }
            });
        }
        db.store.update({
            name : req.body.name,
            phone : req.body.phone,
            address : req.body.address,
            url_image : req.body.url_image,
            close_time : req.body.close_time,
            open_time : req.body.open_time,
        },{
            where : {
                id : req.user.id
            }
        }).then(store => {
            res.json({
                success : true,
                message : "Cap nhat thong tin thanh cong"
            });
        });
    }
}
var store = {}
store.login = login;
store.register = register;
store.index = index;
store.show = show;
store.destroy = destroy;
store.update = update;

module.exports = store;
