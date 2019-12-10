db = require("../models");


//delete category
const deleteCatest = (req, res) => {
    console.log("deleting category");
    db.catest.findOne({
        where : {
            id : req.params.id,
        }
    }).then(function(result){
        if(!result){
            res.json({
                success : false,
                message : "category is not exist"
            });
        }else{
            result.destroy().then(function(){
                res.json({
                    success : true,
                    message : "Xoa thanh cong"
                })
            })
        }
    })
}

const catest = {};
catest.deleteCatest = deleteCatest;

module.exports = catest;