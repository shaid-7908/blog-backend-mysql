const express = require("express");
const router = express.Router();
const authentiaction=require('./Api/Authentication')
const checker=require('./verify')

router.post('/register',authentiaction.Register)
router.post('/login',authentiaction.Login)
router.post('/updateprofile',checker.Verifytoken,authentiaction.UpdateProfile)

module.exports=router