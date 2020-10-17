const multer = require("multer");
const imagemin = require('imagemin');
var path = require('path');
var config=require('../config/config');
var USERID=config.getUSERID;
var POSTID=config.getPOSTID;




// User Images
var multerStorageUSER = multer.diskStorage({
	destination: function(req, file, callback) {		
		callback(null, "./images/users");						
	},
	filename: function(req, file, callback) {	
       
        if(req.query.id){            
            if(file.originalname){                
                var ext = path.extname(file.originalname);
                req.IMAGENAME=("00000"+req.query.id).slice(-5)+ext;                
                callback(null,req.IMAGENAME); 
            }            
        }else if(req.body.id ){            
            if(file.originalname){                
                var ext = path.extname(file.originalname);
                req.IMAGENAME=("00000"+req.body.id).slice(-5)+ext;                
                callback(null,req.IMAGENAME); 
            }            
        }
        else{                
            var ext = path.extname(file.originalname);          
            callback(null,USERID()+ext);
        }

	},
	
});

const multerFilterUSER = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const uploadUSER = multer({
  storage: multerStorageUSER,
  fileFilter: function (req, file, callback) {
    
      if( file && file.originalname){        
        var ext = path.extname(file.originalname);       
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg'&& ext !== '.HEIC' && ext !== '.JPG' && ext !== '.PNG' && ext !== '.JPEG') {           
            return callback(new Error({"mgs":'Only images are allowed'}))
        }else{            
            callback(null, true)
        }
      }else{
        return callback(null,false);
      }
    
    
}
});
const uploadFilesUSER = uploadUSER.array("img", 2);
exports.uploadImagesUSER = (req, res, next) => {        
        uploadFilesUSER(req, res, err => {
            if (err instanceof multer.MulterError) { // A Multer error occurred when uploading.
                if (err.code === "LIMIT_UNEXPECTED_FILE") { // Too many images exceeding the allowed limit
                        res.send({status:403,msg:"LIMIT_UNEXPECTED_FILE"})
                }
            } else if (err) {                
                res.send({status:403,msg:"Only Images are allowed","err":err})
            }else{
                next();
            }

            
        });

};


// post Images
var multerStoragePost = multer.diskStorage({
	destination: function(req, file, callback) {		
		callback(null, "./images/posts");						
	},
	filename: function(req, file, callback) {
        // update	//          
        if(req.body.post_id ){            
            if(file.originalname){                
                var ext = path.extname(file.originalname);
                req.IMAGENAME=("0000000000"+req.body.post_id).slice(-10)+ext;                               
                callback(null,req.IMAGENAME); 
            }            
        }
        // Insert
        else{            
            var ext = path.extname(file.originalname);
            callback(null,POSTID()+ext);
        }

	},
	
});

const multerFilterPost = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const uploadPost = multer({
  storage: multerStoragePost,
  fileFilter: function (req, file, callback) {
      if( file && file.originalname){
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg'&& ext !== '.HEIC' && ext !== '.JPG' && ext !== '.PNG' && ext !== '.JPEG') {           
            return callback(new Error({"mgs":'Only images are allowed'}))
        }else{
            callback(null, true)
        }
      }else{
        return callback(null,false);
      }
    
    
}
});
const uploadFilesPost = uploadPost.array("img", 2);
exports.uploadImagesPost = (req, res, next) => {    
        uploadFilesPost(req, res, err => {
            if (err instanceof multer.MulterError) { // A Multer error occurred when uploading.
                if (err.code === "LIMIT_UNEXPECTED_FILE") { // Too many images exceeding the allowed limit
                        res.send({status:403,msg:"LIMIT_UNEXPECTED_FILE"})
                }
            } else if (err) {                
                res.send({status:403,msg:"Only Images are allowed","err":err})
            }else{
                next();
            }

            
        });

};








  
