const db = require('../models');
const secretOrKey = require('../config/secretOrKey');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);

const index = function(req, res){
    db.shipper.findAll().then(function(data){
        res.json(data);
    })
}

const login = function(req, res){
    db.shipper.findOne({
        where : {
            email : req.body.email
        }
    }).then(shipper => {
        if(!shipper){
            res.json({
                success : false,
                message : "Email không tồn tại"
            });
        }
        var passwordIsValid = bcrypt.compareSync(req.body.password, shipper.password);

        if(!passwordIsValid){
            res.json({
                success : false,
                message : "Mật khẩu không chính xác"
            });
        }
        var accountIsActive = (shipper.status == 1);
        if(accountIsActive){
            res.json({
                success : false,
                message : "Tài khoản bị khóa"
            })
        }
        var payload = {id : shipper.id};
        var token = jwt.sign(payload, secretOrKey, {
            expiresIn : 3600
        });
        res.json({
            success : true,
            token : token
        });
    });
}

const getShipperInfo = function(req, res){
    db.shipper.findOne({
        where : {
            id : req.user.id
        }
    }).then(function(shipper){
        if(!shipper){
            res.json({
                success : false,
                message : "Lay thong tin that bai"
            });
        }else{
            res.json({
                success : true,
                data : {
                    name : shipper.name,
                    email : shipper.email,
                    phone : shipper.phone,
                    address : shipper.address,
                    url_image : shipper.url_image,
                    identification : shipper.identification,
                    license_plates : shipper.license_plates
                }
            });
        }
    });
}


const show = function(req, res){
    db.shipper.findOne({
        where : {
            id : req.params.id
        }
    }).then(function(shipper){
         if(!shipper){
            res.json({
                success : false,
                message : "Lay thong tin that bai"
            });
        }else{
            res.json({
                success : true,
                data : shipper
            })
        }
    })
}

const store = function(req, res){
    db.shipper.findOne({
        where : {
            email : req.body.email
        }
    }).then(function(shipper){
        if(shipper){
            res.json({
                success : false,
                message : "Tai khoan da ton tai"
            });
        }else{
            db.shipper.create({
                name : req.body.name,
                email : req.body.email,
                password : bcrypt.hashSync(req.body.password, salt),
                phone : req.body.phone,
                address : req.body.address,
                url_image : req.body.url_image,
                identification : req.body.identification,
                license_plates : req.body.license_plates
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


const destroy = function(req, res){
    db.shipper.destroy({
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
    db.shipper.update({
        name : req.body.name,
        phone : req.body.phone,
        address : req.body.address,
        password :  bcrypt.hashSync(req.body.password, salt),
        url_image : req.body.url_image,
        status : req.body.status,
        identification : req.body.identification,
        license_plates : req.body.license_plates
    },{
        where : {
            id : req.params.id
        }
    }).then(shipper => {
        res.json({
            success : true,
            message : "Cap nhat thong tin thanh cong"
        });
    });
}

const updateShipperInfo = function(req, res){
     db.shipper.update({
        name : req.body.name,
        phone : req.body.phone,
        address : req.body.address,
        password :  bcrypt.hashSync(req.body.password, salt),
        url_image : req.body.url_image,
        identification : req.body.identification,
        license_plates : req.body.license_plates
    },{
        where : {
            id : req.user.id
        }
    }).then(shipper => {
        res.json({
            success : true,
            message : "Cap nhat thong tin thanh cong"
        });
    });
}
var shipper = {}
shipper.index = index;
shipper.login = login;
shipper.getShipperInfo = getShipperInfo;
shipper.show = show;
shipper.store = store;
shipper.destroy = destroy;
shipper.updateShipperInfo = updateShipperInfo;
shipper.adminUpdate = adminUpdate;
module.exports = shipper;
