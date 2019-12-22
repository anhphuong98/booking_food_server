'use strict'

module.exports = (sequelize, DataTypes) => {
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
    Store.association = function(models){
        Store.hasMany(models.comment, {
            foreignKey : 'store_id'
        });

        Store.hasMany(models.evaluation, {
            foreignKey : 'store_id'
        });
        Store.hasMany(models.dishes, {
            foreignKey: 'store_id'
        });
        Store.hasMany(models.order, {
            foreignKey: 'store_id'
        })
    }
    return Store;
}
