'use strict';

module.exports = (sequelize, Datatypes) => {
    var Shipper = sequelize.define('shipper', {
        id : {
            type : Datatypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        name : {
            type : Datatypes.STRING,
            allowNull : false
        },
        email : {
            type : Datatypes.STRING,
            allowNull : false,
            unique  : true
        },
        password : {
            type : Datatypes.STRING,
            allowNull : false
        },
        phone : {
            type : Datatypes.BIGINT,
            allowNull : false,
        },
        identification : {
            type : Datatypes.STRING,
            unique : true
        },
        address : {
            type : Datatypes.TEXT
        },
        license_plates : {
            type : Datatypes.STRING
        },
        url_image : {
            type : Datatypes.STRING
        },
        status : {
            type : Datatypes.BOOLEAN,
            defaultValue : 0
        }
    }, {
        timestamps : false
    });
    Shipper.association = function(models){
        //
    }
    return Shipper;
}
