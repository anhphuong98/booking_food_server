db = require('../models');

//get all order 
const getAllOrder = (req, res) => {
     const page = Number(req.query.page);
     const pageSize = Number(req.query.pageSize);

     const limit = pageSize? pageSize : 20;
     const offset = page? page*limit : 0
    db.order.findAndCountAll({limit: limit, offset: offset}).then(function (result) {
        result.page = page? page: 0;
        result.pageSize = pageSize? pageSize : 20
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
            shipper_id: req.params.id
        }
    }).then(function (result) { 
            if (result) {
                res.status(200).json({
                    success: true,
                    data: result
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