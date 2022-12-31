const express = require("express");
const router = express.Router();
const authentiaction=require('./Api/Authentication')

router.post('/register',authentiaction.Register)
router.post('/login',authentiaction.Login)

module.exports=router