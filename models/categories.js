'use strict'

module.exports = function(sequelize, DataTypes){
    const Category = sequelize.define(
        'categories',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            parent_id: {
                type: DataTypes.INTEGER,
            }
        },
        {
            timestamps: false
        }
    );
    Category.associate = function (models) {
        Category.hasMany(models.dish, {
            foreignKey: 'category_id'
        })
        Category.belongsTo(models.categories, {
            foreignKey: 'parent_id'
        })
    }
    return Category;
}