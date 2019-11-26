'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false
        },
        phone : {
            type : DataTypes.BIGINT,
        },
        address : {
            type : DataTypes.TEXT,
        },
        url_image : {
            type : DataTypes.STRING
        },
        status : {
            type : DataTypes.BOOLEAN,
            defaultValue : 0
        }
    }, {
        timestamps : false
    });
    User.association = function(models){
        //
    }
    return User;
}
