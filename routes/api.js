const user = require('../controllers/user');
const shipper = require('../controllers/shipper');
const adminController = require('../controllers/adminController');
const store = require('../controllers/store');
const comment = require('../controllers/comment');
const evaluation = require('../controllers/evaluation');
const orderController = require('../controllers/orderController');
const categoryController = require('../controllers/categoryController');
var authenticate = require('../middleware/authenticate');


module.exports = (app) => {

    // user
    //  get all user for admin
    app.get('/api/user', authenticate('admin'), user.index);
    // get info user for admin, user
    app.get('/api/user/:id', authenticate(['admin', 'user']), user.show);
    // delete account for admin
    app.delete('/api/user/:id', authenticate('admin'), user.destroy);
    // update account user for admin, user
    app.put('/api/user/:id', authenticate(['admin', 'user']), user.update);
    // user login
    app.post('/api/user/login', user.login);
    // user register
    app.post('/api/user/register', user.register);

    // shipper
    // get all shipper for admin
    app.get('/api/shipper', authenticate('admin'), shipper.index);
    // get info shipper for admin, shipper
    app.get('/api/shipper/:id', authenticate(['admin', 'shipper']), shipper.show);
    // add shiper for admin
    app.post('/api/shipper', authenticate('admin'), shipper.store);
    // delete shipper for admin
    app.delete('/api/shipper/:id', authenticate('admin'), shipper.destroy);
    // admin sua thong tin shipper
    app.put('/api/shipper/:id', authenticate(['admin', 'shipper']), shipper.update);
    // shipper login
    app.post('/api/shipper/login', shipper.login);


    // admin
    //login for admin
    app.post('/api/admin/login', adminController.login);
    //get information of admin
    app.get('/api/admin/getAdminInfo', authenticate('admin'), adminController.getAdmin);
    // change admin information: password/name
    app.put('/api/admin/update', authenticate('admin'), adminController.updateAdminInfo);
    // route test
    app.get('/api/test', user.test);

    // store
    // store login
    app.post('/api/store/login', store.login);
    // add store for admin
    app.post('/api/store', authenticate('admin'), store.register);
    // get all store for admin
    app.get('/api/store', store.index);
    // get info store for admin, store
    app.get('/api/store/:id', store.show);
    // delete store for admin
    app.delete('/api/store/:id', authenticate('admin'), store.destroy);
    // update store for store and admin
    app.put('/api/store/:id', authenticate(['admin', 'store']), store.update);


    // Comment
    // get all comment of a store
    app.get('/api/allComment/:id', authenticate(['admin', 'store', 'user']), comment.index);
    // get one comment
    app.get('/api/comment/:id', authenticate(['admin', 'store', 'user']), comment.show);
    // add comment
    app.post('/api/comment', authenticate(['admin', 'store', 'user']), comment.create);
    // delete comment
    app.delete('/api/comment/:id', authenticate(['admin', 'user']), comment.destroy);
    // put comment
    app.put('/api/comment/:id', authenticate('user'), comment.update);


    // Evaluation
    // Add evaluation
    app.post('/api/evaluation', authenticate('user'), evaluation.create);
    // User update evaluation
    app.put('/api/evaluation/:id', authenticate('user'), evaluation.update);
    // Get average Evaluation of store'
    app.get('/api/storeEvaluation/:id', evaluation.getAverageEvaluation);

    // shipper_Store_Order
    // get order with id of store
    app.get('/api/order/store/:id', authenticate(['admin', 'store']), orderController.getOrderByStoreId);


    // get category by store_id
    app.get('/api/category/store/:id', categoryController.getCategoryByStoreId);

}