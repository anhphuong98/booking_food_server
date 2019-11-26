const db = require('../models');
const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);

var jwt = require('jsonwebtoken');
var secretOrKey = require('../config/secretOrKey');

const index = function(req, res){
    db.user.findAll().then(function(data){
        res.status(200).json(data);
    })
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
        var payload = {id : user.id};
        var token = jwt.sign(payload, secretOrKey, {
            expiresIn : 3600
        });
        res.json({
            success : true,
            token : token
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
//  Lay thong tin cua nguoi hien dang dang nhap
const getUserInfo = function(req, res){
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
                data : {
                    name : user.name,
                    email : user.email,
                    phone : user.phone,
                    address : user.address,
                    url_image : user.url_image
                }
            });
        }
    });
}


// Lay thong tin cua nguoi theo id truyen vao

const show = function(req, res){
    db.user.findOne({
        id : req.params.id
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

const updateUserInfo = function(req, res){
    db.user.update({
        name : req.body.name,
        phone : req.body.phone,
        address : req.body.address,
        password :  bcrypt.hashSync(req.body.password, salt),
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

const destroy = function(req, res){
    db.user.destroy({
        where : {
            id : req.params.id
        }
    }).then(function(){
        res.json({
            success : true,
            message : "Xoa tai khoan thanh cong"
        })
    });
}

const adminUpdate = function(req, res){
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
}

var user = {}
user.index = index;
user.login = login;
user.register = register;
user.getUserInfo = getUserInfo;
user.show = show;
user.updateUserInfo = updateUserInfo;
user.destroy = destroy;
user.adminUpdate = adminUpdate;

module.exports = user;
