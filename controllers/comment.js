const db = require('../models');

const index = function(req, res){
    db.comment.findAll({
        where : {
            store_id : req.params.id
        }
    }).then(function(data){
        res.status(200).json(data);
    });
}

const show = function(req, res){
    db.comment.findOne({
        where : {
            id : req.params.id
        }
    }).then(function(data){
        if(!data){
            res.status(400).json({
                success : false,
                message : 'Khong tim thay comment'
            })
        }
        res.status(200).json(data);
    })
}


const create = function(req, res){
    db.comment.create({
        user_id : req.user.id,
        content : req.body.content,
        store_id : req.body.store_id,
        time : Date.now()
    }).then(function(result){
        if(!result){
            res.status(500).json({
                success : false,
                message : "Them comment khong thanh cong"
            });
        }
        res.status(201).json({
            success : true,
            message : "Them comment thanh cong"
        })

    })
}


const destroy = function(req, res){
    db.comment.findOne({
        where : {
            id : req.params.id,
            user_id : req.user.id
        }
    }).then(function(comment){
        if(!comment){
            res.json({
                success : false,
                message : "comment khong ton tai"
            });
        }else{
            comment.destroy().then(function(){
                res.json({
                    success : true,
                    message : "Xoa comment thanh cong"
                   })
            });
        }
    });
}

const update = function(req, res){
    db.comment.findOne({
        where : {
            id : req.params.id,
            user_id : req.user.id
        }
    }).then(function(comment){
        if(!comment){
            res.json({
                success : false,
                message : "Khong tim thay comment"
            });
        }else{
            comment.update({
                content : req.body.content
            });
            res.json({
                success : true,
                message : "Sua comment thanh cong"
            });
        }
    });
}





var  comment = {}
comment.index = index;
comment.show = show;
comment.create = create;
comment.destroy = destroy;
comment.update = update;

module.exports = comment;

