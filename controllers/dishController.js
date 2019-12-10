db = require('../models');

//get all dish
const getAllDish = (req, res) => {
    console.log("get all dish");
    db.dish.findAll().then(function (data) {
        res.status(200).json({
            success: true,
            dishes: data
        })
    })
}
//get dish id
const getDishwithId = (req, res)=>{
    console.log("get Dish with Id");
    db.dish.findOne({
        where: {
            id: req.params.id
        }
    }).then(function (data) {
        if(data){
        res.status(200).json({
            success: true,
            dish: data
        })}
        else if(!data){
            res.status(500).json({
                success: false,
                message: "Invalid dishes id"
            })
        }
    })
}
//get dish with store id
const getDishofStore = (req, res)=>{
    console.log("get all dishes of a store");
    db.dish.findAll({
        where: {
            store_id: req.params.id
        }
    }).then(function(data){
        if(data.length){
            res.status(200).json({
                success: true,
                dishes: data
            })
        }
        else if(!data.length) {
            res.status(500).json({
                success: false,
                message: "Invalid store id"
            })
        }
    })
}
//add new dish
const addNewDish = (req, res)=>{
    console.log("add new dish");
   
        db.dish.create({
            store_id: req.user.id,
            name: req.body.name,
            category_id: req.body.category_id,
            url_image: req.body.url_image,
            price: req.body.price,
            sale: req.body.sale,       
        }).then(function(result){
            res.json({
                success: true,
                dish: result
            })
        })
}


const dishController = {};
dishController.getAllDish = getAllDish;
dishController.getDishwithId = getDishwithId;
dishController.getDishofStore = getDishofStore;
dishController.addNewDish = addNewDish

module.exports = dishController;