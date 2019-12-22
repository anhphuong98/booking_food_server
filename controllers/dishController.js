db = require('../models');

//get all dish
const getAllDish = (req, res) => {
    console.log("get all dish");
    const page = Number(req.query.page)
    const pageSize = Number(req.query.pageSize)

    const limit = pageSize ? pageSize : 20
    const offset = page ? page * limit : 0
    db.dish.findAndCountAll({ limit: limit, offset: offset }).then(function (data) {
        data.page = page? page : 0
        data.pageSize = limit
        res.status(200).json({
            success: true,
            dishes: data
        })
    })
}
//get dish id
const getDishwithId = (req, res) => {
    console.log("get Dish with Id");
    db.dish.findOne({
        where: {
            id: req.params.id
        }
    }).then(function (data) {
        if (data) {
            res.status(200).json({
                success: true,
                dish: data
            })
        } else if (!data) {
            res.status(500).json({
                success: false,
                message: "Invalid dishes id"
            })
        }
    })
}
//get dish with store id
const getDishofStore = (req, res) => {
    const page = Number(req.query.page)
    const pageSize = Number(req.query.pageSize)

    const limit = pageSize ? pageSize : 20
    const offset = page ? page * limit : 0
    console.log("get all dishes of a store");
    db.dish.findAndCountAll(
        {
        where: {
            store_id: req.params.id
        },
        offset: offset,
        limit: limit
    }).then(function (data) {
        data.page = page ? page : 0;
        data.pageSize = limit;
        if (data.count) {
            res.status(200).json({
                success: true,
                dishes: data
            })
        } else if (!data.count) {
            res.status(500).json({
                success: false,
                message: "Invalid store id",
                dishes: data
            })
        }
    })
}
//add new dish
const addNewDish = (req, res) => {
    console.log("add new dish");

    db.dish.create({
        store_id: req.user.id,
        name: req.body.name,
        category_id: req.body.category_id,
        url_image: req.body.url_image,
        price: req.body.price,
        sale: req.body.sale,
    }).then(function (result) {
        res.json({
            success: true,
            dish: result
        })
    })
}
//update dish
const updateDish = (req, res) => {
    console.log("update dish");

    db.dish.update({
        store_id: req.user.id,
        name: req.body.name,
        category_id: req.body.category_id,
        url_image: req.body.url_image,
        price: req.body.price,
        sale: req.body.sale,
    }, {
        where: {
            id: req.params.id
        }
    }).then(function (result) {
        if (result) {
            db.dish.findOne({
                where: {
                    id: req.params.id
                }
            }).then(resu => {
                res.json({
                    success: true,
                    dish: resu
                })
            })
        }
    })
}


const dishController = {};
dishController.getAllDish = getAllDish;
dishController.getDishwithId = getDishwithId;
dishController.getDishofStore = getDishofStore;
dishController.addNewDish = addNewDish;
dishController.updateDish = updateDish

module.exports = dishController;