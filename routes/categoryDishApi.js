const categoryController = require("../controllers/categoryController");
const dishController = require("../controllers/dishController");
const orderController = require("../controllers/orderController")
const catest = require("../controllers/catest");
passport = require('passport');
const authenticate = require('../middleware/authenticate')

module.exports = function (app) {
    //CATEGORIES
    //get category
    app.get('/api/category', categoryController.getCategory);
    //create new category
    app.post('/api/category', authenticate(['store', "admin"]), categoryController.createCategory);
    //update category
    app.put('/api/category/:id', authenticate(['store', "admin"]), categoryController.updateCategory);
    //delete category item
    app.delete('/api/category/:id', authenticate(['store', "admin"]), categoryController.deleteCategory);

    //DISHES
    //get all dishes
    app.get('/api/getAllDish', dishController.getAllDish);
    //get dish with its id
    app.get('/api/getDish/:id', dishController.getDishwithId);
    //get all dishes of a store has id
    app.get('/api/getStoreDish/:id', dishController.getDishofStore);
    //add new dish
    app.post('/api/dish', authenticate(['store', 'admin']), dishController.addNewDish);
    //update dish
    app.put('/api/dish/:id', authenticate(['store', 'admin']), dishController.updateDish)
    //delete dish
    app.delete('/api/dish/:id', authenticate(['store', "admin"]), dishController.deleteDish);
    
    //ORDERS
    //admin gets all order existed
        app.get('/api/order', authenticate('admin'), orderController.getAllOrder);
        //get order of a shipper by his id
        app.get('/api/order/shipper/:id', authenticate(['shipper', 'admin']), orderController.getOrderShipper);
        //get order detail by order id
        app.get('/api/orderDetail/:id', authenticate(['admin', 'shipper', 'user', 'store']), orderController.getDetailbyOrderId)
}