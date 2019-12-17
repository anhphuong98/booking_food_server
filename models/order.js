'use strict'

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING
        },
        time: {
            type: DataTypes.DATE
        },
        status: {
            type: DataTypes.INTEGER
        },
        shipper_id: {
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false
    });
    Order.associate = (models)=>{
        Order.belongsTo(models.user, {
            foreignKey: 'user_id'
        })
        Order.belongsTo(models.shipper,{
            foreignKey: 'shipper_id'
        })
        Order.hasMany(models.order_detail, {
            foreignKey: 'order_id'
        })
    }
    return Order;
}