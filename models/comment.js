'use strict'

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('comment', {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        user_id : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        store_id : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        content : {
            type : DataTypes.TEXT
        },
        time : {
            type : DataTypes.DATE
        }
    }, {
        timestamps : false
    });
    Comment.associate = function(models) {
        Comment.belongsTo(models.user, {
            foreignKey : 'user_id'
        });
        Comment.belongsTo(models.store, {
            foreignKey : 'store_id'
        })
    }
    return Comment;
}
