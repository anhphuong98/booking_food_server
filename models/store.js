'use strict'

module.exports = function(sequelize, DataTypes){
    var Store = sequelize.define('store', {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false
        },
        name : {
            type : DataTypes.STRING
        },
        phone : {
            type : DataTypes.BIGINT
        },
        address : {
            type : DataTypes.STRING
        },
        url_image : {
            type : DataTypes.STRING
        },
        open_time : {
            type : DataTypes.TIME
        },
        close_time : {
            type : DataTypes.TIME
        },
        status : {
            type : DataTypes.BOOLEAN,
            defaultValue : 0
        }
    },{
        timestamps : false
    });
    Store.association = function(modules){
        //
    }
    return Store;
}
