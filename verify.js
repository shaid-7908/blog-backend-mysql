const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()

exports.Verifytoken=Verifytoken

function Verifytoken(req,res,next){
    const bearerToken=req.headers["authorization"]
    

    if(typeof bearerToken !== "undefined"){
        req.token =bearerToken.replace("Bearer ","")
        try{
          let token=jwt.verify(req.token,process.env.PASS_SECRET)
          conn.query(`SELECT count(*) FROM users WHERE userId=?`,
          [token.userId],
          (err,result)=>{
            if(err){
                res.send({
                    status:400,
                    data:{err},
                    message:'Something went wrong'
                })
            }else{
                (result == 0 ? (res.send({
                    status:400,
                    data:{},
                    message:'Bad Token'
                })) : next())
            }
          }
          )

        }catch(err){
          
          res.send({
            status:400,
            data:err,
            message:"Login again token not valid"
          })
        }
    }else{
        res.send({
            status:400,
            data:{},
            message:'Token undefined'
        })
    }
}