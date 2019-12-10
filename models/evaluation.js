'use strict'

module.exports = function(sequelize, DataTypes){
    const Evaluation = sequelize.define('evaluation', {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        user_id : {
            type : DataTypes.INTEGER
        },
        store_id : {
            type : DataTypes.INTEGER
        },
        rate : {
            type : DataTypes.INTEGER
        }
    }, {
        timestamps : false
    });
    Evaluation.associate = function(models){
        //
        Evaluation.belongsTo(models.user, {
            foreignKey : 'user_id'
        });
        Evaluation.belongsTo(models.store, {
            foreignKey : 'store_id'
        });
    }
    return Evaluation;
}
