var express = require('express');
var router = express.Router();
var controller = require('../controllers/UserController');
var uploadController = require('../middlewares/upload');
var auth=require('../middlewares/authenticate');

router.post('/register',uploadController.uploadImagesUSER,controller.registerUser);
router.post('/login', controller.loginUser);

router.post('/postBlog',auth.authenticate,uploadController.uploadImagesPost ,controller.addPost);
router.put('/updateBlog',auth.authenticate,uploadController.uploadImagesPost ,controller.updatePost);
router.delete('/deleteBlog',auth.authenticate,controller.deletePost);

router.get('/getUserBlog',auth.authenticate,controller.getPostBloguser);
router.get('/getAllBlogs',auth.authenticate,controller.getAllActivePost);


router.post('/sendComment',auth.authenticate ,controller.sendComment);
router.get('/getComment',auth.authenticate ,controller.getComment);
router.delete('/deleteComment',auth.authenticate ,controller.deleteComment);


module.exports=router;