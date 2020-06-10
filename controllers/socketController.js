db = require('../models');

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
                });
               
            })

        }
        
    })
    // res.io.emit("server-send-order", {
    //     data : "orders"
    // });
    // res.json({
    //     success : "OKOK"
    // });
    
}
const handle = (socket_io, socket) => {
    console.log("hello ae vao")
    socket.on("client-send-order", function(order_id) {
        db.order.findOne({
            where : {
                id : order_id
            }
        }).then(function(order) {
            const shipper_id = order.shipper_id;
            console.log(shipper_id);
            socket_io.emit("server-send-order-" + shipper_id, order.id);
        });
    });
    socket.on("shipper-receive-order", () => {
        socket_io.emit("shipper-receive-order",)
    })
    socket.on("shipper-cancel-order", () => {
        socket_io.emit("shipper-cancel-order", () => {

        });
    });
}

const socketController = {};

socketController.order = order;
socketController.handle = handle;
module.exports = socketController;