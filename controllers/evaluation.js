const db = require('../models');


const create = function(req, res){
    db.evaluation.create({
        user_id : req.user.id,
        store_id : req.body.store_id,
        rate : req.body.rate
    }).then(function(result){
        if(!result){
            res.status(500).json({
                success : false,
                message : "Them danh gia that bai"
            });
        }else{
            res.status(201).json({
                success : true,
                data : result
            });
        }
    });
}

const update = function(req, res){
    db.evaluation.findOne({
        where : {
            id : req.params.id,
            user_id : req.user.id,
        }
    }).then(function(result){
        if(!result){
            res.json({
                success : false,
                message : "Khong tim thay danh gia"
            });
        }else{
            result.update({
                rate : req.body.rate
            });
            res.json({
                success : true,
                message : "Cap nhat danh gia thanh cong"
            });
        }
    });
}

const getAverageEvaluation = function(req, res){
    db.evaluation.findAll({
        where : {
            store_id : req.params.id
        }
    }).then(function(result){
        if(result.length == 0){
            res.json({
                success : true,
                evalutionPoint : 0
            });
        }
        else if(result.length != 0){
            var total = 0;
            for(var i = 0; i < result.length; i++){
                total += result[i].rate;
            }
            var evalutionPoint = Math.round(total/result.length);
            res.json({
                success : true,
                evalutionPoint : evalutionPoint
            });
        }
    });
}
const evaluation = {}

evaluation.create = create;
evaluation.update = update;
evaluation.getAverageEvaluation = getAverageEvaluation;
module.exports = evaluation;
