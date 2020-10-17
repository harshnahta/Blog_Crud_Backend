"use strict";
var bcrypt = require('bcryptjs');
var key=require('../config/config');
var path = require('path');
var msg=key.msg;
var datamsg=key.datamsg;
var dtmsgkey=key.dtmsgkey;
var db=key.db;
var url=key.urls;
var gentoken=key.gentoken;
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)


exports.registerUser=(req,res)=>{          
    var insertQuery="insert into users (name,email,mobile,password,images,status) VALUES (?,?,?,?,?,?)";

    db.query("select email from users where email=?",[req.body.email],(err,result)=>{
        if(err){
            res.status(403).send(msg(403,"Something went wrong"));
        }else{
            if(result.length>0){
                res.status(409).send(msg("409","Email Already Exist"));
            }else{
                var img='';
                if(req.files==undefined || req.files=="undefined" || req.files.length==0 )
                {               
                    img='';
                  }
                else if(req.files[0].originalname)
                {                            
                     img = url +'users_Blog/' + key.getUSERID()+path.extname(req.files[0].originalname);
               }
               bcrypt.genSalt(10,(err,salt)=> {
                if (err) {
                    return res.status(403).send(err);
                }
                bcrypt.hash(`${req.body.password}`, salt, (err, hash) => {
                    if (err) {
                        return res.status(403).send(err);
                    }else{
                        db.query(insertQuery,[req.body.name,req.body.email,req.body.mobile,hash,img,1],(err,entryResult)=>{
                            if(err){
                                return res.status(403).send(err);
                            }else{
                                if (entryResult.affectedRows > 0) {
                                    key.increaseUSERID();
                                    return res.status(200).send(msg("200","Register Succesfull"));
                                }else{
                                    return res.status(403).send(msg("403","Something went wrong"));
                                }
                            }
                        })
                    }
                });
            });
            }
        }
    })
}

exports.loginUser=(req,res)=>{
    db.query("select id,email,password from users where email=?",[req.body.email],(err,result)=>{
        if(err){
            return res.status(403).send(err);
        }else{
            if(result.length==0){
                res.status(401).send(msg("401","Email Not Fount"));
            }else{
                bcrypt.compare(req.body.password, result[0].password, (err, resul) => {
                    if (err) {
                        res.status(401).send(msg("401", "Password Mismatch"));
                    } else if(resul){                                                    
                        let token = gentoken(result[0].email);
                        db.query("update users set token=? where email=?",[token,req.body.email],(err,upresult)=>{
                            if(err){
                                return res.status(403).send(err);
                            }else{
                                if(upresult.affectedRows>0){
                                    return res.status(200).header({tokens:token}).send(datamsg(200,{id:result[0].id}));
                                }else{
                                    return res.status(403).send(msg(403,"Something went wrong Please Retry"));
                                }
                            }
                        })
                    }else{
                        res.status(401).send(msg("401", "Password Mismatch"));
                    }
                });
            }
        }
    })
}



exports.addPost=(req,res)=>{
    var insertQuery="insert into post(user_id,title,content,images,create_date,update_date,status) VALUES(?,?,?,?,?,?,?)";

                var img='';
                if(req.files==undefined || req.files=="undefined" || req.files.length==0 )
                {               
                    img='';
                  }
                else if(req.files[0].originalname)
                {                            
                     img = url +'post_Blog/' + key.getPOSTID()+path.extname(req.files[0].originalname);
               }
                   
               db.query("select id from users where id=?",[req.body.user_id],(err,findresult)=>{
                if(err){
                    return res.status(403).send(err);
                }else{
                    if(findresult.length==0){
                        return res.status(404).send(msg(404,"Invalid User"));
                    }else{
                        db.query(insertQuery,[req.body.user_id,req.body.title,req.body.content,img,new Date(),new Date(),1],(err,result)=>{
                            if(err){
                                return res.status(403).send(err);
                            }else{
                                // console.log(result.insertId);
                                if(result.affectedRows>0){                                    
                                    key.increasePOSTID();
                                    return res.status(200).send(msg(200,"Blog Added Succesfully"));
                                }else{
                                    return res.status(403).send(msg(200,"Someting went Wrong"));
                                }
                            }
                        }) ;
                    }
                }
               })
            }



exports.updatePost=(req,res)=>{           
        db.query("select id from post where id=?",[req.body.post_id],(err,postresult)=>{
            if(err){
                return res.status(403).send(err);
            }else{
                if(postresult.length==0){
                    return res.status(404).send(msg(404,"Invalid Post"));
                }else{                    
                    var img='';
                    if(req.IMAGENAME){
                    img=url +'post_Blog/' +req.IMAGENAME;
                    }else{
                        img=req.body.img;
                    }
                    db.query("update post set title=?,content=?,images=?,update_date=? where id=?",[req.body.title,req.body.content,img,new Date(),req.body.post_id],(err,row)=>{
                        if(err){
                            return res.status(403).send(err);
                        }else{
                            if(row.affectedRows>0){
                                return res.status(200).send(msg(200,"Updated Succesfully"));
                            }else{
                                return res.status(403).send(msg(403,"Something went wrong"));
                            }
                        }
                    })
                }
            }
        })
}


exports.deletePost=async (req,res)=>{
    db.query("delete from post where id=?",[req.body.postId],(err,result)=>{
        if(err){
            return res.status(403).send(err);
        }else{
            if(result.affectedRows>0){
                if(!req.body.images || req.body.images.length==0){
                    key.postID();
                    return res.status(200).send(msg(200,"Deleted Succesfully"));
                }else{   
                    key.postID();                 
                    deleteFile(req,res);
                }
                
            }else{
                return res.status(403).send(msg(403,"Somethingwent Wrong"));
            }
        }
    })
    
    
}

 var deleteFile=async (req,res)=>{    
    try{
        await unlinkAsync('images/posts/'+(("0000000000"+req.body.postId).slice(-10))+path.extname(req.body.images));
        return res.status(200).send(msg(200,"Deleted Succesfully"));
    }
catch(err){
    return res.status(200).send(msg(200,"Deleted Succesfully"));
    }
}

exports.getPostBloguser=(req,res)=>{ 
    db.query("select id from users where id=?",[req.query.id],(err,findresult)=>{
        if(err){
            return res.status(403).send(err);
        }else{
            if(findresult.length==0){
                return res.status(404).send(msg(403,"Invalid User ID"));
            }else{            
            db.query("select * from post where user_id=?",[req.query.id],(err,result)=>{
                if(err){
                    return res.status(403).send(err);
                }else{  
                    return res.status(200).send(datamsg(200,result));
                }
            })
            }
            }
        });
    }


    exports.getAllActivePost=(req,res)=>{
        db.query("select p.*,u.name,u.email from post as p join users as u on u.id=p.user_id where p.status=?",[1],(err,result)=>{
            if(err){
                return res.status(403).send(err);
            }else{  
                return res.status(200).send(datamsg(200,result));
            }
        });
    }



    exports.sendComment=(req,res)=>{
        var inserQuery="insert into comment(user_id,post_id,content,status,create_time,update_time) VALUES(?,?,?,?,?,?)";
        db.query(inserQuery,[req.body.user_id,req.body.post_id,req.body.comment,1,new Date(),new Date()],(err,result)=>{
            if(err){
                return res.status(403).send(err);
            }else{
                if(result.affectedRows>0){
                    return res.status(200).send(msg(200,"Comment Submitted"));
                }else{
                    return res.status(403).send(msg(403,"Something Went Wrong"));
                }
            }
        });
    }

    exports.getComment=(req,res)=>{
        db.query("select c.*,u.name,u.email from comment as c join users as u on u.id=c.user_id where post_id=?",[req.query.post_id],(err,result)=>{
            if(err){                
                return res.status(403).send(err);
            }else{
                return res.status(200).send(datamsg(200,result));
            }
        });
    }


    exports.deleteComment=(req,res)=>{        
        db.query("delete from comment where id=?",[req.body.id],(err,result)=>{
            if(err){
                return res.status(403).send(err);
            }else{                
                if(result.affectedRows>0){
                    return res.status(200).send(msg(200,"Deleted Succesfully"));
                }else{
                    return res.status(403).send(msg(403,"Something went wrong"));
                }
            }
        })
    }

             
