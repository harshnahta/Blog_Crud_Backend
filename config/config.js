const jwt=require('jsonwebtoken');
const db = require('../db/db');
url="http://localhost:9003/";
exports.privateKey = '@#$%@#$%-=+';
var dtb=require('../db/db')
exports.db =dtb;
exports.urls=url;
exports.msg = function(status,msg){

    let a = {
        "status":status,
        "message":msg
    };
    //console.log(a);

    return a;
}

exports.datamsg = function(status,data){
    let a = {
        "status":status,
        "data":data
    };
    return a;
}
exports.dtmsgkey = function(status,msg,data){
    let a = {
        "status":status,
        "msg":msg,
        "data":data
    };    
    return a;
}

var privateKeys = '@#$%@#$%-=+';
exports.gentoken=function(data){   
    let token = jwt.sign({email:data},privateKeys,{ expiresIn: '1h' }).toString();
    return token;
}

var userID;
exports.UserID=function getUSERID(){
    dtb.query("select id from users ORDER BY id",(err,result)=>{
        if(err){
            console.log(err);
        }else{            
            if(result.length==0){
                userID=1;
                alterTableUserId(userID);
            }else{
                userID=result[result.length-1].id+1;
                alterTableUserId(userID);                
            }
            console.log("user added :"+(userID-1));
            
        }
    });
}

var alterTableUserId=(userId)=>{
    dtb.query("ALTER TABLE users AUTO_INCREMENT = ?",[userId],(err,result)=>{
        if(err){            
            // console.log(err);
        }else{
            // console.log(result);
        }
    })
}
exports.getUSERID=function(){
    return (("00000"+userID).slice(-5));    
};

exports.increaseUSERID=function(){
    userID=userID+1;
}



var postID;
exports.postID=function getPOSTID(){
    // dtb.query("SHOW TABLE STATUS WHERE name = ?",['post'],(err,result)=>{
        dtb.query("select id from post ORDER BY id",(err,result)=>{   
    if(err){
            console.log(err);
        }else{         
                  
            // console.log(result)         
            if(result.length==0){
                postID=1;
                alterTablePostId(postID);
            }else{                              
                postID=result[result.length-1].id+1;  
                alterTablePostId(postID);              
            }
            console.log("post added:"+(postID-1));
            
        }
    });
}

var alterTablePostId=(postId)=>{
    dtb.query("ALTER TABLE post AUTO_INCREMENT = ?",[postId],(err,result)=>{
        if(err){
            // console.log("here")
            // console.log(err);
        }else{
            // console.log(result);
        }
    })
}

exports.getPOSTID=function(){
    return (("0000000000"+postID).slice(-10));    
};

exports.increasePOSTID=function(){
    postID=postID+1;
    console.log(postID)
}
