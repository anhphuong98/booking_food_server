db = require("../models");
bcrypt = require("bcrypt-nodejs");
Sequelize = require('sequelize')
//get category
const getCategory = (req, res) => {
    console.log("getting category");
    db.categories.findAll().then(function (data) {
        res.status(200).json({
            success: true,
            category: data
        })
    })
}
//create category
const createCategory = async function (req, res) {
    console.log("create category");
    if (!req.body.parent_id);
    else {
        try {
            const parent = await db.categories.findOne({
                where: {
                    id: req.body.parent_id
                }
            })

            if (!parent) {
                res.status(401).json({
                    success: false,
                    message: "parent category is not existed"
                })
                return;
            }
        } catch (err) {
            console.log("createCategory-checkParent", err);
            return;
        }
    }

    try {
        const category = await db.categories.create({
            name: req.body.name,
            status: req.body.status,
            parent_id: req.body.parent_id,
        })

        if (!category) {
            res.status(402).json({
                success: false,
                message: "category is null"
            })
        } else {
            res.json(category)
        }
    } catch (err) {
        console.log("createCategory-createNew", err)
    }
}


//update category
const updateCategory = (req, res) => {
    console.log("update category");
    db.categories.update({
        name: req.body.name,
        status: req.body.status,
        parent_id: req.body.parent_id
    }, {
        where: {
            id: req.params.id
        }
    }).then(result => {
        res.json({
            success: true,
            message: "Updated category",
            data: result
        })
    })
}

//delete category
const deleteCategory = (req, res) => {
    console.log("deleting category");

    db.categories.destroy({
        where: {
            id: req.params.id
        }
    }).then(function () {
        res.json({
            success: true,
            message: "Da xoa thanh cong",
        })
    })

}

const category = {};
category.getCategory = getCategory;
category.createCategory = createCategory;
category.updateCategory = updateCategory;
category.deleteCategory = deleteCategory;

module.exports = category