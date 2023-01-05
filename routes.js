const express = require("express");
const router = express.Router();
const authentiaction=require('./Api/Authentication')
const blogPost=require('./Api/Blog')
const checker=require('./verify')
const admin_=require('./Api/Admin')
router.post('/register',authentiaction.Register)
router.post('/login',authentiaction.Login)
router.post('/updateprofile',checker.Verifytoken,authentiaction.UpdateProfile)

router.post('/postblog',checker.Verifytoken,blogPost.BlogPost)
router.post('/deleteblog',checker.Verifytoken,blogPost.Deleteblog)
router.post('/uploadphoto',checker.Verifytoken,blogPost.Uploadphoto)
router.post('/editblog',checker.Verifytoken,blogPost.Editblog)

router.get('/getAllUser',checker.Verifytoken,admin_.GetAllUsers)

module.exports=router