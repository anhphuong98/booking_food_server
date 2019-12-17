db = require('../models');

//get all order 
const getAllOrder = (req, res) => {
        db.order.findAll().then(function(result){
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
    }).then(function(result){

    })
}

const orderController = {};
orderController.getAllOrder = getAllOrder
orderController.getOrderShipper = getOrderShipper;

module.exports = orderController;