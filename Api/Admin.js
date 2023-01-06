const jwt = require("jsonwebtoken");

exports.GetAllUsers=GetAllUsers
exports.ChangeBlogStatus=ChangeBlogStatus


async function GetAllUsers(req,res){
    let bearerHeader=req.headers['authorization']
    let token = jwt.verify(bearerHeader,process.env.PASS_SECRET)
    const lastResult=[]
    if(token.isAdmin === 1){
      conn.query(`SELECT * FROM users`,[],(err,result)=>{
        if(err) console.log(err)
        else{
            result.map((data)=>{
                const value={
                    userId:data.userId,
                    userName:data.userName,
                    userEmail:data.userEmail,
                    firstName:data.firstName,
                    lastName:data.lastName
                }
                lastResult.push(value)
            })
            res.send({
                status:200,
                data:lastResult,
            })
        }
      })
    }else{
        res.send({
            status:403,
            data:{},
            message:'You are not an Admin'
        })
    }
}

async function ChangeBlogStatus(req,res){
    let bearerHeader=req.headers['authorization']
    let token = jwt.verify(bearerHeader,process.env.PASS_SECRET)
    let {blogId,statusType}=req.body
    if(token.isAdmin === 1){
       conn.query(`SELECT * FROM blogs WHERE blogId=?`,[blogId],(err,result)=>{
        if(err) console.log(err)
        else if(result.length !== 0){
            conn.query(`UPDATE blogs SET statusType=? WHERE blogId=?`,[statusType,blogId],(err,result)=>{
                if(err) console.log(err)
                res.send({
                    status:200,
                    data:{},
                    message:'Status Updated'
                })
            })
        }else{
            console.log(blogId ,'dosent Exists')
        }
       })

    }else{
        res.send({
        status:403,
        data:{},
        message:'You are not an admin'
        })
    }
}