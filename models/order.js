'use strict'

module.exports = (sequelize, DataTypes) => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
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
        name_recieve : {
            type : DataTypes.STRING
        },
        phone_recieve : {
            type : DataTypes.BIGINT
        },
        note :  {
            type : DataTypes.TEXT
        },
        ship_price : {
            type : DataTypes.FLOAT
        },
        time: {
            type: DataTypes.DATE,
            defaultValue: dateTime
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        shipper_id: {
            type: DataTypes.INTEGER
        },
        store_id: {
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
        Order.belongsTo(models.store, {
            foreignKey: 'store_id'
        })
    }
    return Order;
}