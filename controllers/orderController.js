db = require('../models');

//get all order 
const getAllOrder = (req, res) => {
   
    if (req.user.role == 'admin') {
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
    
        const limit = pageSize ? pageSize : 20;
        const offset = page ? page * limit : 0;
        db.order.findAndCountAll({ limit: limit, offset: offset }).then(function (result) {
            result.page = page ? page : 0;
            result.pageSize = pageSize ? pageSize : 20
            res.status(200).json({
                success: true,
                data: result
            })
        })
    }
    if (req.user.role == 'user') {
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
    
        const limit = pageSize ? pageSize : 20;
        const offset = page ? page * limit : 0;
        db.order.findAndCountAll({
            where: {
                user_id: req.user.id
            }, 
            limit: limit,
            offset: offset
        }).then(function (order) {
            order.page = page ? page : 0;
            order.pageSize = pageSize ? pageSize : 20
            res.json({
                success: true,
                data: order
            })
        })
    }
}
//get order with shipper id
const getOrderShipper = (req, res) => {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);

    const limit = pageSize ? pageSize : 20;
    const offset = page ? page * limit : 0;
    db.order.findAll({
        where: {
            shipper_id: req.params.id
        },
        attributes: ['id', 'address', 'time', 'status', 'shipper_id'],
        limit: limit,
        offset: offset,
        include: [
            {
                model: db.user,
                attributes: ['id', 'name']
            },
            {
                model: db.store,
                attributes: ['id', 'name', 'address']
            }
        ]
    }).then(function (result) {
        result.page = page ? page : 0;
        result.pageSize = limit;
        var check = 1;
        if (req.user.role == 'shipper') {
            check = req.user.id == req.params.id;
        }
        if (result && check) {
            res.status(200).json({
                success: true,
                data: result
            })
        } else {
            res.status(500).json({
                success: false,
                message: "cannot get order by admin id"
            })
        }
    })
}
const getDetailbyOrderId = (req, res) => {
    db.order_detail.findAll({
        where: {
            order_id: req.params.id
        },
        attributes: ['id', 'order_id', 'quantity', 'current_price'],
        include: [db.dish]
    }).then(function (result) {
        res.status(200).json({
            success: true,
            data: result
        })
    })
}
const order = (req, res) => {
    db.order.create({
        user_id: req.user.id,
        address: req.body.address,
        time: req.body.time,
        store_id: req.body.store_id
    }).then(async function (order) {
        const dish = req.body.dish;
        order.dataValues.dish = []
        for (var i in dish) {
            await db.order_detail.create({
                order_id: order.id,
                dish_id: dish[i].dish_id,
                quantity: dish[i].quantity,
                current_price: dish[i].current_price
            }).then(function (dish) {
                order.dataValues.dish.push(dish);
            })
        }
        res.json({
            success: true,
            order: order
        })
    })
}
const getOrderUser = (req, res) => {

}

const orderController = {};
orderController.getAllOrder = getAllOrder
orderController.getOrderShipper = getOrderShipper;
orderController.getDetailbyOrderId = getDetailbyOrderId;
orderController.order = order;

module.exports = orderController;