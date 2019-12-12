const db = require('../models');
const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);

var jwt = require('jsonwebtoken');
var config = require('../config/config.json');

const index = function(req, res){
    db.user.findAll().then(function(data){
        res.status(200).json(data);
    });
}

const login = function(req, res){
    db.user.findOne({
        where : {
            email : req.body.email
        }
    }).then(user => {
        if(!user){
            res.json({
                success : false,
                message : "Email không tồn tại"
            });
        }
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if(!passwordIsValid){
            res.json({
                success : false,
                message : "Mật khẩu không chính xác"
            });
        }
        var accountIsActive = (user.status == 1);
        if(accountIsActive){
            res.json({
                success : false,
                message : "Tài khoản bị khóa"
            })
        }
        var payload = {
            id : user.id,
            email : user.email,
            role : 'user'
        };
        var token = jwt.sign(payload, config.secret, {
            expiresIn : 3600
        });
        res.json({
            success : true,
            token : token,
            data : {
                id : user.id,
                email : user.email,
                name : user.name,
                url_image : user.url_image
            }
        });
    });

}

const register = function(req, res){
    db.user.findOne({
        where : {
            email : req.body.email
        }
    }).then(function(user){
        if(user){
            res.json({
                success : false,
                message : "Tai khoan da ton tai"
            });
        }else{
            db.user.create({
                name : req.body.name,
                email : req.body.email,
                password : bcrypt.hashSync(req.body.password, salt),
                phone : req.body.phone,
                address : req.body.address
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
// Lay thong tin cua nguoi theo id truyen vao

const show = function(req, res){
    if(req.user.role === 'admin'){
        db.user.findOne({
            where : {
                id : req.params.id
            }
        }).then(function(user){
            if(!user){
                res.json({
                    success : false,
                    message : "Lay thong tin that bai"
                });
            }else{
                res.json({
                    success : true,
                    data : user
                })
            }
        });
    }else{
        if(req.user.id != req.params.id){
            res.json({
                success : false,
                message : "Lay thong tin that bai"
            })
        }
         db.user.findOne({
            where : {
                id : req.user.id
            }
        }).then(function(user){
            if(!user){
                res.json({
                    success : false,
                    message : "Lay thong tin that bai"
                });
            }else{
                res.json({
                    success : true,
                    data : user
                })
            }
        });
    }
}

const destroy = function(req, res){
    db.user.findOne({
        where : {
            id : req.params.id
        }
    }).then(function(user){
        if(!user){
            res.json({
                success : false,
                message : "Tai khoan khong ton tai"
            });
        }else{
            user.destroy().then(function(){
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
        db.user.update({
            name : req.body.name,
            phone : req.body.phone,
            address : req.body.address,
            password :  bcrypt.hashSync(req.body.password, salt),
            url_image : req.body.url_image,
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
            db.user.update({
                password : bcrypt.hashSync(req.body.password, salt)
            }, {
                where : {
                    id : req.user.id
                }
            });
        }
        db.user.update({
            name : req.body.name,
            phone : req.body.phone,
            address : req.body.address,
            url_image : req.body.url_image
        },{
            where : {
                id : req.user.id
            }
        }).then(user => {
            res.json({
                success : true,
                message : "Cap nhat thong tin thanh cong"
            });
        });
    }
}

const test = function(req, res){
    res.json({
        success : true,
        message : "Deploy heroku successfully!"
    })
}
var user = {}
user.index = index;
user.login = login;
user.register = register;
user.show = show;
user.destroy = destroy;
user.update = update;
user.test = test;
module.exports = user;
