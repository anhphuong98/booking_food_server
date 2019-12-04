const user = require('../controllers/user');
const shipper = require('../controllers/shipper');
const adminController = require('../controllers/adminController');
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
        // rout test
    app.get('/api/test', user.test);
}

