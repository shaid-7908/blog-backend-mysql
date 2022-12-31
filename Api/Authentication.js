const CryptoJS=require("crypto-js")
const jwt = require("jsonwebtoken");
exports.Register=Register
function Register(req, res){
 let { userName,userEmail ,userPassword,isAdmin,userImage,firstName,lastName} = req.body

 conn.query(`SELECT *, count(userId) as countt FROM users WHERE userEmail=?`,[userEmail],(err,result)=>{

   if(err) console.log(err)
   if(result[0].countt === 0){

    conn.query(`SELECT *,count(userID) as countt1 FROM users WHERE userName=?`,[userName],(err,result)=>{
        if(err) console.log(err)
        if(result[0].countt1 === 0){

            conn.query(`INSERT INTO users (userName,userEmail,userpassword ,isAdmin ,userImage,firstName,lastName) 
            values(?,?,?,?,?,?,?)
            `,[
               userName,
               userEmail,
               CryptoJS.AES.encrypt(userPassword, process.env.PASS_SECRET).toString(),
               0,
               userImage,
               firstName,
               lastName,
            ],(err,result)=>{

                if(err) console.log(err)
                else{
                   conn.query(`SELECT * FROM users WHERE userId=? `,[result.insertId],(err,result)=>{
                    let token = jwt.sign(
                        { userId: result[0].userId, userName: result[0].userName },
                        process.env.PASS_SECRET
                      );
                    if(err) console.log(err)
                    else{
                        res.send({
                            status:200,
                            data:{token,userId:result[0].userId},
                            message:'Singup success'
                        })
                    }
                   })
                }
            }
            )
        }else{
            res.send({
                status:200,
                data:{},
                message:'User is taken'
            })
        }
    })
   }else{
    res.send({
        status:200,
        data:{},
        message:'Email is registered'
    })
   }
 })
}
