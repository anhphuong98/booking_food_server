db = require('../models');
bcrypt = require('bcrypt-nodejs');
var secretOrKey = require('../config/secretOrKey');
jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);

//login
const login = (req, res) => {
    console.log("Sign in");
    const { email, password } = req.body;

    db.admin.findOne({
        where: {
            email: email
        }
    }).then(admin => {
        if (!admin) {
            return res.status(404).json({
                success: false,
                status: "Cannot find admin"
            })
        }
    
    //login without default password
        if (admin.password != '123456') {
            var validPassword = bcrypt.compareSync(password, admin.password);
            if(!validPassword){
            return res.status(400).json({
                success: false,
                token: null,
                status: "Wrong password"
            })}
        } 
        else    //login with default password 
        {
            if(password != '123456'){
                return res.status(400).json({
                    success: false,
                    token: null,
                    status: "Wrong password"
                })
            }
        }

    //successful login
    var payload = {
        id: admin.id, 
        name: admin.name, 
        password: admin.password
    }
        var token = jwt.sign(payload,secretOrKey,
            {
                expiresIn: 86400 //valid in 24hours
            })

            res.status(200).json({
                success: true,
                token: token,
            });
        }).catch(err => {
            res.status(500).json('Error -> '+ err );
        });
}

//get admin
const getAdmin = (req, res)=>{
    console.log("get Admin");
    db.admin.findOne({
        where: {
            id: req.user.id
        }
    }).then(function(admin){
        if(admin){
            res.json({
                success: true,
                data: admin
            })
        } else {
            res.json({
                success: false,
                message: "Cannot get admin, please check your password again"
            })
        }
    })
}

//update information
const updateAdminInfo = (req, res) => {
    db.admin.update({
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, salt)
    }, {
        where: {
            id: req.user.id 
        }
    }).then(function(admin) {
        res.json({
            success: true,
            message: "account updated"
        })
    }
       
    )
}

const adminController = {};
adminController.login = login;
adminController.getAdmin = getAdmin;
adminController.updateAdminInfo = updateAdminInfo;

module.exports = adminController