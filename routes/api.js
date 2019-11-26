const user = require('../controllers/user');
const shipper = require('../controllers/shipper');
const adminController = require('../controllers/adminController');

const passport = require('passport');

module.exports = (app) => {

    // user
        //  get all user for admin
    app.get('/api/user' , user.index);
        // get info user for admin
    app.get('/api/user/:id', user.show);
        // delete account for admin
    app.delete('/api/user/:id', user.destroy);
        // admin sua tai khoan nguoi dung
    app.put('/api/user/:id', user.adminUpdate);
        //get info user cua nguoi dung hien dang dang nhap
    app.get('/api/user/getUserInfo', passport.authenticate('jwt-user', {session : false}), user.getUserInfo);
        // user login
    app.post('/api/user/login', user.login);
        // user register
    app.post('/api/user/register', user.register);
        // user update
    app.put('/api/user/updateUserInfo', passport.authenticate('jwt-user', {session : false}), user.updateUserInfo);



    // shipper
        // get all shipper for admin
    app.get('/api/shipper', shipper.index);
        // admin lay thong tin cua admin
    app.get('/api/shipper/:id', shipper.show);
        // admin them shipper
    app.post('/api/shipper', shipper.store);
        // admin xoa shipper
    app.delete('/api/shipper/:id', shipper.destroy);
        // admin sua thong tin shipper
    app.put('/api/shipper/:id', shipper.adminUpdate);
        // shipper login
    app.post('/api/shipper/login', shipper.login);
        // shipper lay thong tin cua shipper
    app.get('/api/shipper/getShipperInfo', passport.authenticate('jwt-shipper', {session : false}), shipper.getShipperInfo);
        // shipper update thong tn cua minh
    app.put('/api/shipper/updateShipperInfo', passport.authenticate('jwt-shipper', {session : false}), shipper.updateShipperInfo);


    // admin
        //login for admin
    app.post('/api/admin/login', adminController.login);
        //get admin
        
}

