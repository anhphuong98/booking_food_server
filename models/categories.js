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
                allowNull: true
            }
        },
        {
            timestamps: false
        }
    )
    return Category;
}