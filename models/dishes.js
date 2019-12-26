'use strict'

module.exports = (sequelize, DataTypes)=>{
    const Dish = sequelize.define('dish',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        store_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        url_image: {
            type: DataTypes.STRING,
        }, 
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        sale: {
            type: DataTypes.DOUBLE,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    Dish.associate = function (models) {
        Dish.belongsTo(models.store, {
            foreignKey: 'store_id'
        });
        Dish.belongsTo(models.categories, {
            foreignKey: 'category_id'
        })
        Dish.hasMany(models.order_detail, {
            foreignKey: 'dish_id',
            onDelete : 'SET NULL'
        })
    }
    return Dish;
}