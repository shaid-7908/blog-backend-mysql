
const jwt = require("jsonwebtoken");

exports.BlogPost=BlogPost
exports.Deleteblog=Deleteblog
exports.Uploadphoto=Uploadphoto
exports.Editblog=Editblog


const cloudinary=require('cloudinary').v2
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
  });

 async function Uploadphoto(req,res){
    const bearerHeader = req.headers["authorization"]
    const token=jwt.verify(bearerHeader,process.env.PASS_SECRET)
    const file=req.files.photo
    await cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
        if(err) console.log(err)
        else{
            res.send({
                status:200,
                data:result.url,
                message:'Imgae uploaded'
            })
        }
    } )
  }


async function BlogPost(req,res){
    const bearerHeader = req.headers["authorization"]
    const token=jwt.verify(bearerHeader,process.env.PASS_SECRET)
    let {blogText,blogImage,userId,statusType,likes} =req.body
    const file=req.files.photo
    await cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
        if (err) console.log(err)
        else if(result){
            conn.query(`INSERT INTO blogs (blogText,blogImage,userId,statusType,likes) VALUES (?,?,?,?,?)`,
        [
            blogText,
            result.url,
            token.userId,
            "for review",
            10
        ],
         (err,result)=>{
            if(err) console.log(err)
            else{
                conn.query(`SELECT * FROM blogs WHERE blogId=?`,
                [result.insertId],
                (err,result)=>{
                    if(err) console.log(err)
                    else{
                        res.send({
                            status:200,
                            data:result,
                            message:'Blog Sent for review'
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

function Deleteblog(req,res){
    const bearerHeader=req.headers['authorization']
    const token=jwt.verify(bearerHeader,process.env.PASS_SECRET)
    let {blogId}=req.body

    conn.query(`SELECT *,count(blogId) as countt FROM blogs WHERE blogId=?`,
    [blogId],
    (err,result)=>{
        console.log(result)
        if(err) console.log(err)
       if(result[0].countt !== 0){
         if(result[0].userId === token.userId || token.isAdmin === 1){  
          conn.query(`DELETE FROM blogs WHERE blogId=?`,
          [blogId],
          (err,result)=>{
            if(err) console.log(err)
            else{
                res.send({
                    status:200,
                    data:{},
                    message:'Blog deleted'
                })
            }
          }
          )
         }else{
            res.send({
                status:403,
                data:{},
                message:'You are not allowed to do that'
            })
         }


       }
    }
    )
}



function Editblog(req,res){
const bearerHeader=req.headers['authorization']
const token=jwt.verify(bearerHeader,process.env.PASS_SECRET)

let {blogId,blogText,blogImage}=req.body

conn.query(`SELECT *,count(blogId) as countt FROM blogs WHERE blogId=?`,
[blogId],
(err,result)=>{
    if(err) console.log(err)
    else if(result[0].countt !==0){
        if(result[0].userId === token.userId){
            if(!!blogText){
                blogText=blogText
            }else{
                blogText=result[0].blogText
            }
            if(!!blogImage){
                blogImage=blogImage
            }else{
                blogImage=result[0].blogImage
            }
            conn.query(`UPDATE blogs SET blogText=? , blogImage=? WHERE blogId=?`,
            [blogText,
            blogImage,
             blogId 
            ],
            (err,result)=>{
                if(err) console.log(err)
                else{
                    res.send({
                        status:200,
                        data:result,
                        message:'Blog updated'
                    })
                }
            }
            )
        }else{
            res.send({
                status:403,
                data:{},
                message:'You are not allowed to do that'
            })
        }
    }
}
)


}

