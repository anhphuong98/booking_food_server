'use strict'

module.exports = function(sequelize, DataTypes){
    const Catest = sequelize.define(
        'catest',
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
    Catest.associate = function (models) {

        Catest.belongsTo(models.catest, {
            foreignKey: 'parent_id',
            onDelete: "CASCADE"
        });
        Catest.hasMany(models.catest, {
            foreignKey : 'parent_id',
            onDelete: "CASCADE"
        })
    }
    return Catest;
}