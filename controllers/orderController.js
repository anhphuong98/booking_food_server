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
    if(req.user.role == 'store') {
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
    
        const limit = pageSize ? pageSize : 20;
        const offset = page ? page * limit : 0;
        db.order.findAndCountAll({
            where: {
                store_id: req.user.id
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
        attributes: ['id', 'order_id', 'quantity', 'current_price', 'name_dish', 'sale_dish', 'url_image_dish'],
        include: [db.dish]
    }).then(function (result) {
        res.status(200).json({
            success: true,
            data: result
        })
    })
}
const order = (req, res) => {
    db.shipper.findAll({
        where : {
            isOnline : 1
        }
    }).then(function(shipper){
        if(shipper.length == 0){
            res.json({
                success : false,
                message : "Đặt hàng thất bại, không có shipper đang online"
            })
        }else{
            const indexShipper = Math.floor(Math.random()*(shipper.length));
            const shipper_id = shipper[indexShipper].id;
            db.order.create({
                user_id: req.user.id,
                address: req.body.address,
                name_recieve : req.body.name_recieve,
                phone_recieve : req.body.phone_recieve,
                note : req.body.note,
                ship_price : req.body.ship_price,
                store_id: req.body.store_id,
                shipper_id : shipper_id
            }).then(async function (order) {
                const dish = req.body.dish;
                order.dataValues.dish = [];
                for (var i in dish) {
                    await db.order_detail.create({
                        order_id: order.id,
                        dish_id: dish[i].dish_id,
                        quantity: dish[i].quantity,
                        current_price: dish[i].current_price,
                        name_dish : dish[i].name,
                        sale_dish : dish[i].sale,
                        url_image_dish : dish[i].url_image,
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
        
    })
    
}
const getOrderUser = (req, res) => {

}



const getOrderByStoreId = (req, res) => {
    db.order.findAll({
        where : {
            store_id : req.params.id
        }, 
        include : [{
            model : db.user,
            attributes : ['name', 'email']
        }, {
            model : db.shipper,
            attributes : ['name', 'email']
        }, {
            model : db.store,
            attributes : ['name', 'email', 'address']
        }]
    }).then(function(data){
        if(data.length == 0){
            res.json({
                success : false,
                message : "Store has no order"
            });
        }else{
            res.json({
                success : true,
                data
            })
        }
    })
}

const getNewOrderByShipperId = (req, res) => {
    db.order.findOne({
        attributes : ['id', 'address', 'time'],
        where : {
            shipper_id : req.user.id,
            status : req.body.status
        },
        include : [{
            attributes : ['name', 'phone'],
            model : db.user
        },{
            attributes : ['name', 'address', 'phone'],
            model : db.store
        }]
    }).then(function(order){
        if(!order){
            res.json({
                success : false,
                message : "Không tồn tại đơn hàng mới cho shipper"
            })
        }else{
            db.order_detail.findAll({
                where : {
                    order_id : order.id
                }
            }).then(function(order_details){
                var totalPrice = 0;
                order_details.forEach(function(order_detail){
                    totalPrice += order_detail.current_price;
                });
                order.dataValues.totalPrice = totalPrice;
                res.json({
                    success : true,
                    data : order
                });
            });
           
        }
    })
}


const update = (req, res) => {
    db.order.update({
        status : req.body.status
    }, {
        where : {
            id : req.params.id
        }
    }).then(function() {
        res.json({
            success : true,
            message : "Cap nhat status thanh cong"
        })
    })
    // db.order.findOne({
    //     where : {
    //         id : req.params.id
    //     }
    // }).then(function(order) {
    //     if(!order) {
    //         res.json({
    //             success : false,
    //             message : "Khong ton tai order"
    //         });
    //     }else{
    //         db.shipper.findOne({
    //             where : {
    //                 id : req.user.id
    //             }
    //         }).then(function(shipper) {
    //             if(shipper.id != order.shipper_id) {
    //                 res.json({
    //                     success : false,
    //                     message : "Đơn hàng này không phải của bạn"
    //                 })
    //             }else{
    //                 db.order.update({
    //                     status : req.body.status
    //                 }, {
    //                     where : {
    //                         id : req.params.id
    //                     }
    //                 }).then(() => {
    //                     res.json({
    //                         success : true,
    //                         message : "Cập nhật đơn hàng thành công"
    //                     });
    //                 });      
    //             }
    //         });
    //     }
    // })



    // db.order.findOne({
    //     where : {
    //         id : req.params.id
    //     }
    // }).then(function(order){
    //     if(!order){
    //         res.json({
    //             success : fasle,
    //             message : "Không tồn tại order"
    //         })
    //     }else{
    //         db.shipper.findOne({
    //             where : {
    //                 id : req.user.id
    //             }
    //         }).then(function(shipper){
    //             if(shipper.id != order.shipper_id){
    //                 res.json({
    //                     success : false,
    //                     message : "Đơn hàng này không phải của bạn"
    //                 })
    //             }
    //             else if(req.body.status == 0){
    //                 const Op = Sequelize.Op;
    //                 db.shipper.findAll({
    //                     where : {  
    //                         isOnline : 1,
    //                         id : {
    //                             [Op.ne] : shipper.id
    //                         }
    //                     }
    //                 }).then(function(result){
    //                     if(result.length == 0){
    //                         order.update({
    //                             status : 3,
    //                             shipper_id : null
    //                         });
    //                         res.json({
    //                             success : true,
    //                             message : "Hủy đơn hàng thành công, đơn hàng không được chuyển"
    //                         });
    //                     }else{
    //                         const indexShipper = Math.floor(Math.random()*(result.length));
    //                         order.update({
    //                             shipper_id : result[indexShipper].id
    //                         });
    //                         res.json({
    //                             success : true,
    //                             message : "Hủy đơn hàng thành công, đơn hàng được chuyển"
    //                         })
    //                     }
    //                 })
    //             }
    //             else if(req.body.status == 1){
    //                 order.update({
    //                     status : 1
    //                 });
    //                 shipper.update({
    //                     isOnline : 2
    //                 });
    //                 res.json({
    //                     success : true,
    //                     message : "Nhận đơn hàng thành công"
    //                 });
    //             }
    //             else if(req.body.status == 2){
    //                 order.update({
    //                     status :  2
    //                 });
    //                 shipper.update({
    //                     isOnline : 1
    //                 });
    //                 res.json({
    //                     success : true,
    //                     message : "Hoàn thành đơn hàng"
    //                 });
    //             }
    //             else if(req.body.status == 3){
    //                 order.update({
    //                     status :  3
    //                 });
    //                 shipper.update({
    //                     isOnline : 1
    //                 });
    //                 res.json({
    //                     success : true,
    //                     message : "Hủy đơn hàng thành công"
    //                 });
    //             }
    //         });            
    //     }
    // })
}

const getOrderByUserID = (req, res) => {
    db.user.findOne({
        where : {
            id : req.user.id
        }
    }).then(function(user) {
        if(!user) {
            res.json({
                success : false,
                message : "Khong ton tai user"
            });
        }else {
            db.order.findAll({
                where : {
                    user_id : user.id
                },
                include : [
                    {
                        model : db.store
                    }
                ]
            }).then(function(orders) {
                if(orders.length == 0) {
                    res.json({
                        success : false,
                        message : "Invalid order"
                    });
                }else {
                    res.json({
                        success : true,
                        data : orders
                    })
                }
            });
        }
    });
}

const getCurrentOrder = (req, res) => {
    db.user.findOne({
        where : {
            id : req.user.id
        }
    }).then(function(user){
        if(!user){
            res.json({
                success : false,
                data : []
            })
        }else{
            db.order.findAll({
                where : {
                    user_id : req.user.id,
                    status : 1
                },
                include : [ {
                    model : db.store
                }]
            }).then(function(orders){
                res.json({
                    success : true,
                    data : orders
                });
            })
        }
    })
}

const orderController = {};
orderController.getAllOrder = getAllOrder
orderController.getOrderShipper = getOrderShipper;
orderController.getDetailbyOrderId = getDetailbyOrderId;
orderController.getOrderByStoreId = getOrderByStoreId;
orderController.order = order;
orderController.getNewOrderByShipperId = getNewOrderByShipperId;
orderController.update = update;
orderController.getOrderByUserID = getOrderByUserID;
orderController.getCurrentOrder = getCurrentOrder;

module.exports = orderController;