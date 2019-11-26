const adminController = require('../controllers/adminController');

module.exports = function(app){

    //admin
app.post('/api/admin/login', adminController.login);
}

