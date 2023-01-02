const express = require("express");
const router = express.Router();
const authentiaction=require('./Api/Authentication')
const blogPost=require('./Api/Blog')
const checker=require('./verify')

router.post('/register',authentiaction.Register)
router.post('/login',authentiaction.Login)
router.post('/updateprofile',checker.Verifytoken,authentiaction.UpdateProfile)

router.post('/postblog',checker.Verifytoken,blogPost.BlogPost)

module.exports=router