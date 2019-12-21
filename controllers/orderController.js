db = require('../models');

//get all order 
const getAllOrder = (req, res) => {
    db.order.findAll().then(function (result) {
        res.status(200).json({
            success: true,
            data: result
        })
    })
}
//get order with shipper id
const getOrderShipper = (req, res) => {
    db.order.findAll({
        where: {
            shipper_id: req.user.id
        }
    }).then(function (result) {
        if (req.user.id == req.params.id) {
            
            if (result) {
                res.status(200).json({
                    success: true,
                    data: result
                })
            }
        } else {
            res.status(500).json({
                success: false,
                message: "cannot get order by admin id"
            })
        }
    })
}
const getOrderShipperTest = (req, res) => {
    db.findAll({
       include: [{

       }]
    })
}
const getDetailbyOrderId = (req, res) => {
    db.order_detail.findAll({
        where: {
            id: req.params.id
        }
    }).then(function (result) {
        res.status(200).json({
            success: true,
            data: result
        })
    })
}
const orderController = {};
orderController.getAllOrder = getAllOrder
orderController.getOrderShipper = getOrderShipper;
orderController.getOrderShipperTest = getOrderShipperTest;
orderController.getDetailbyOrderId = getDetailbyOrderId;

module.exports = orderController;