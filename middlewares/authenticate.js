
const jwt=require('jsonwebtoken');
var keys=require('../config/config');
var msg=keys.msg;
var db=keys.db;
var gentoken=keys.gentoken;
exports.authenticate = (req,res,next) =>{
    const header = req.headers['authorization'];
    
    if(typeof header !== 'undefined') {
        let check;
        try {
            check = jwt.verify(header,keys.privateKey);
        } catch (error) {
            check=false;
            // return res.status(401).send({msg:error.name});

        }
        if(check){                        
            db.query("select * from users where token  = ?",[header],(err,result)=>{
                if (err){
                    return res.status(403).send(err);
                }else {
                    if (result.length !== 0) {                        
                        if(result[0].token==header){
                            // res.header({tokens:null});
                            next();
                        }else{
                            return res.status(403).send("invalid user Token");
                        }
                    } else {
                        return res.status(403).send("invalid session");
                    }
                }
            });
        }
        else{
            
            refreshTokenOnetime(req,res,header,next);            
        }

    } else {
        res.status(401).send({msg:"No Header"});
    }
};



function refreshTokenOnetime(req,res,header,next){
    
    db.query("select id,email,token from users where token  = ?",[header],(err,result)=>{
        if(err){
            res.send(err);
        }else{
            if(result.length!=1){                
                return res.status(401).send({msg:"Unauthorized"});
            }else{                               
                if(result[0].token!=header){                    
                    return res.status(401).send({msg:"Unauthorized"});
                }else{
                let token=gentoken(result[0].email);
                
                db.query("update users set token=? where id=?",[token,result[0].id],(err,row)=>{
                    if(err){
                        
                        return res.status(401).send({msg:"Unauthorized"});
                    }else{                        
                        if(row.affectedRows>0){
                            
                            res.header({tokens:token});                            
                            next();
                        }else{
                             
                            return res.status(401).send({msg:"Unauthorized"});                           
                        }
                    }
                });
            }
        }
        }
    })
}
