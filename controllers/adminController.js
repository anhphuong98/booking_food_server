model = require('../models');
bcrypt = require('bcrypt-nodejs');
var secretOrKey = require('../config/secretOrKey');
jwt = require('jsonwebtoken');

//login
const login = (req, res) => {
    console.log("Sign in");
    const { email, password } = req.body;

    model.admin.findOne({
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
        var token = jwt.sign({
            id: admin.id
        },
            secretOrKey,
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

    const token = req.header.token;
    model.admin.findOne({
        where: {

        }
    })
}


const adminController = {};
adminController.login = login;
adminController.getAdmin = getAdmin;

module.exports = adminController