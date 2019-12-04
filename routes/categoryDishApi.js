const categoryController = require("../controllers/categoryController");
passport = require('passport');
const authenticate = require('../middleware/authenticate')

module.exports = function(app){
    //CATEGORIES
        //get category
        app.get('/api/category', categoryController.getCategory);
        //create new category
        app.post('/api/category', authenticate('store'), categoryController.createCategory);
        //update category
        app.put('/api/category/:id', categoryController.updateCategory);
        //delete category item
        app.delete('/api/category/:id', categoryController.deleteCategory);

}