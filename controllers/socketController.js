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
                    order_id: order.id
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
 // Khoi tao hashmap cac shipper da huy don hang nay
let arrayShipperCancle = {};
const handle = (socket_io, socket) => {
    // Log ra khi co nguoi ket noi
    console.log("hello ae vao")

    // lang nghe su kien client dat hang
    socket.on("client-send-order", function(order_id) {
        db.order.findOne({
            where : {
                id : order_id
            }
        }).then(function(order) {
            const shipper_id = order.shipper_id;
            console.log(shipper_id);
            socket_io.emit("server-send-order-" + shipper_id, {data : order.id});
        });
    });
    // lang nghe su kien shipper nhan hang
    socket.on("shipper-receive-order", (order_id) => {

            socket_io.emit("shipper-receive-order-" + order_id, {accept : 1});
        });
    // lang nghe su kien shipper huy don hang
    socket.on("shipper-cancel-order", (data) => {
        const object = JSON.parse(data);
        const shipper_cancel_id = object.shipper_id;
        const order_cancel_id = object.order_id;
        arrayShipperCancle[shipper_cancel_id] = order_cancel_id;
        console.log("in ra do dai cua mang oke la" + Object.keys(arrayShipperCancle).length)
        db.shipper.findAll({
            where : {  
                isOnline : 1
            }
        }).then(function(shippers){
            // Khai bao mang chua cac shipper da huy don hang
            let arrayIDShipper = Object.keys(arrayShipperCancle);
            console.log("do dai mang " + arrayIDShipper.length)
            if(shippers.length === arrayIDShipper.length){
                for(i = 0; i < arrayIDShipper.length; i++) {
                    let key = arrayIDShipper[i];
                    if(arrayShipperCancle[key] === order_cancel_id) {
                        delete(arrayShipperCancle[key]);
                    }
                }
                console.log("sau khi xoa " + Object.keys(arrayShipperCancle).length);
                socket_io.emit("server-cancel-order-" + order_cancel_id, {accept : 0});
                console.log("huy don hang roi nhe nhes")
                
            } else {
                let shipper_id;
                do {
                    console.log("id cua shipper trong mang " + arrayIDShipper[0]);
                    console.log("vao day day day nhe" + shippers.length)
                    let indexShipper = Math.floor(Math.random()*(shippers.length));
                    shipper_id = shippers[indexShipper].id;   
                    console.log("Trong khi khi random: " + shipper_id);
                } while (arrayIDShipper.includes(shipper_id.toString()));
                console.log("Sau khi random: " + shipper_id);
                socket_io.emit("server-send-order-" + shipper_id, {data : order_cancel_id});
            }

        });
    });
}

const socketController = {};

socketController.order = order;
socketController.handle = handle;
module.exports = socketController;