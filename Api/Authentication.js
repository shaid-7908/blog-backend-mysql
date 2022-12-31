const CryptoJS=require("crypto-js")
const jwt = require("jsonwebtoken");


exports.Register=Register
exports.Login=Login
exports.UpdateProfile=UpdateProfile


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


function Login(req,res){
 let {userName,userEmail,userPassword}=req.body
if(userName){

conn.query(`SELECT *,count(userId) as countt FROM users where userName=?`,[userName],(err,result)=>{
    if(err) console.log(err)
    if(result[0].countt != 0){
        const haspass= CryptoJS.AES.decrypt(result[0].userpassword, process.env.PASS_SECRET)
        const Orpassword=haspass.toString(CryptoJS.enc.Utf8)
        if(userPassword != Orpassword) {
            res.send({
                status:400,
                data:{},
                message:'Wrong password'
            })
        }else{
            let token = jwt.sign(
                { userId: result[0].userId, userName: result[0].userName,isAdmin:result[0].isAdmin },
                process.env.PASS_SECRET
              );
              res.send({
                status:200,
                data:{
                    token,
                    userId:result[0].userId,
                    isAdmin:result[0].isAdmin,
                    userName:result[0].userName,
                    firstName:result[0].firstName,
                    lastName:result[0].lastName
                },
                message:'Login success full'
              })
        }
    }else{
        res.send({
            status:400,
            data:{},
            message:'Invalid user name'
        })
    }
})

}

if(userEmail){
    conn.query(`SELECT *,count(userId) as countt FROM users where userEmail=?`,[userEmail],(err,result)=>{
        if(err) console.log(err)
        if(result[0].countt != 0){
            const haspass= CryptoJS.AES.decrypt(result[0].userpassword, process.env.PASS_SECRET)
            const Orpassword=haspass.toString(CryptoJS.enc.Utf8)
            if(userPassword != Orpassword) {
                res.send({
                    status:400,
                    data:{},
                    message:'Wrong password'
                })
            }else{
                let token = jwt.sign(
                    { userId: result[0].userId, userName: result[0].userName,isAdmin:result[0].isAdmin },
                    process.env.PASS_SECRET
                  );
                  res.send({
                    status:200,
                    data:{
                        token,
                        userId:result[0].userId,
                        isAdmin:result[0].isAdmin,
                        userName:result[0].userName,
                        firstName:result[0].firstName,
                        lastName:result[0].lastName
                    },
                    message:'Login success full'
                  })
            }
        }else{
            res.send({
                status:400,
                data:{},
                message:'Email not registered'
            })
        }
    })


}

}


function UpdateProfile(req,res){
    const bearerHeader = req.headers["authorization"]
    let {firstName,lastName,userImage}=req.body
    let token=jwt.verify(bearerHeader,process.env.PASS_SECRET)
    conn.query(`SELECT * FROM users WHERE userId=?`,[token.userId],
    (err,result)=>{
        if(err) console.log(err)
        else{

       
        if(!!firstName){
            firstName = firstName
        }else{
            firstName = result[0].firstName
        }
        if(!!lastName){
            lastName =lastName
        }else{
            lastName = result[0].lastName
        }
        if(!!userImage){
            userImage=userImage
        }else{
            userImage =result[0].userImage
        }
        conn.query(`UPDATE users SET firstName =? , lastName =?, userImage =? WHERE userId=?`,
        [
            firstName,
            lastName,
            userImage,
            token.userId
        ],(err,result)=>{
            if(err) console.log(err)

            else{
                  conn.query(`SELECT * FROM users WHERE userId=?`,
                  [token.userId],
                  (err,result)=>{
                    if(err) console.log(err)

                    else{
                        let updatedResult={
                            firstName:result[0].firstName,
                            lastName:result[0].lastName,
                            userImage:result[0].userImage,
                            userName:result[0].userName
                        }
                        res.send({
                            status:200,
                            data:updatedResult,
                            message:'User Profile updated'
                        })
                    }

                  }
                  )

            }
        }
        )
    }
    })
}