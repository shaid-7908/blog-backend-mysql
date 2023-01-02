
const jwt = require("jsonwebtoken");

const cloudinary=require('cloudinary').v2
cloudinary.config({ 
    cloud_name: 'dnszaem4s', 
    api_key: '311811788413783', 
    api_secret: '3TnMD0KhGMwxd7HBJsRNhlYGDag',
    secure: true
  });

  exports.BlogPost=BlogPost

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