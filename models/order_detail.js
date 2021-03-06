'use strict';

module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define('order_detail',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dish_id: {
            type: DataTypes.INTEGER,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        current_price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        name_dish : {
            type : DataTypes.STRING
        },
        sale_dish : {
            type : DataTypes.FLOAT

        },
        url_image_dish : {
            type : DataTypes.STRING
        }

    }, {
        timestamps: false
    });
    OrderDetail.associate = (models)=>{
        OrderDetail.belongsTo(models.dish, {
            foreignKey: 'dish_id',
            onDelete : 'SET NULL',
        })
        OrderDetail.belongsTo(models.order, {
            foreignKey: 'order_id'
        })
    };
    return OrderDetail
}