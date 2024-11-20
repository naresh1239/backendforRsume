const express = require('express');
const {hashPassword,comparePassword} = require("../lib/hashpass")
const router = express.Router();
const {signUpCheckValidation,signinCheckValidation,VerificationToekn,ResetPassCheckValidation} = require("../middleware/AuthCheck")
const jwt = require('jsonwebtoken')
const userModle = require('../userShcema.js')
const {generateToken} = require("../utils/generateToken")
const cors = require('cors')
const {sendverificationMail,sendResetPasswordMail} = require("../controller/Mail.js")
const {generateAuthCookie} = require("../utils/generateAuthCookie");
// const { session } = require('passport');

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
  };
  
  // Apply CORS to the router specifically
  router.use(cors(corsOptions));

router.post('/signup', signUpCheckValidation,async(req, res) => {


    const { name, email,password } = req.body;

    console.log({ name, email,password })
    if(!name,!email,!password){
     return res.end('error all fields missing')
    }

     const hashedPassword = await hashPassword(password);
  
     const user = await userModle.findOne({ email })

    if(user){
        return res.status(500).json({"massage" :'user with this email already exits'})
    }

       if(!hashedPassword){
         return res.status(500).json({"massage" : "someting wend worgn"})
       }

     const tokan = generateToken()
     const tokan_expire_date = Date.now() + 24 * 60 * 60 * 1000;
     const now = new Date();

     const formatCurrentDate = (date) => {
         return date.toISOString().replace('T', ' ').slice(0, 19);
     };

      const newUser = new userModle({
            name,
            email,
            passwordHash : password,
            verification_token : tokan,
            token_expire_date : tokan_expire_date, 
            last_login: null,
            is_verified : false,
        });

        await newUser.save();
       return sendverificationMail(email,tokan,res)
});


router.post('/verifiyToken', VerificationToekn,async(req, res) => {
    const token = req.body.token;
    const email = req.body.email

    const user = await userModle.findOne({ email})
    if(user){
        if(user.verification_token == token){
          return  generateAuthCookie(res,user)
        }else{
            return res.status(201).json({ message: 'Wrogn Token or not valid' }); 
        }
    }
    console.log(user)
})

// router.post('/signin', signinCheckValidation,async(req, res) => {

//     const query = 'SELECT * FROM USERS WHERE email = ?';

//     const {email,password} = req.body;

//     if(!email,!password){
//      return res.end('error all fields missing')
//     }

//     DBconnection.query(query, [email],async (err,result)=>{
//      if(err){
//        console.log(err)
//      }
//      if(result?.length  < 1){
//         return res.status(400).send('you are not verifed yet or email of password wrong')
//      }
     
//      const isValidUser = await comparePassword(password,result[0].password_hash)
//      if(!isValidUser){
//         return res.status(400).send('you are not verifed yet or email of password wrong')
//      }
//      if(result){
//       if(!result[0].is_verified){
//         return res.status(400).send('you are not verifed yet or email of password wrong')
//       }
//       const jwtToken =  jwt.sign(
//         { _id : result[0].id,},
//          process.env.JWT_SECRET_KEY,
//          {expiresIn : '1d'}
//      )
 
//          res.cookie("token", jwtToken,{
//          httpOnly : true,
//          sameSite : "strict",
//          masAge : 24 * 60 * 60 * 1000
//        })

//         return res.status(200).json({
//             massage : 'login successfully',
//             success : true,
//             email : email,
//             name : result[0].name
//         })
//      }
//     })
// });


// router.get('/logout',(req,res)=>{
//   res.clearCookie('token')
//   res.status(200).json({'massage' : "you have been logout successfully"})
// })


// router.post('/ResetPassword',(req,res)=>{
//   // res.clearCookie('token')

//   if(!req.body.email){
//    return res.status(400).json({"massage" : 'email not valid'})
//   }
//   const query = 'SELECT * FROM USERS WHERE email = ?';

//   DBconnection.query(query, [req.body.email],async (err,result)=>{
//     if(err){
//       console.log(err)
//     }
//     if(result?.length  < 1){
//        return res.status(400).send('email is not valid')
//     }
    
//     if(result){

//      if(!result[0].is_verified){
//        return res.status(400).send('you are not verifed yet')
//      }

//      if(result){
//       const tokan = generateToken()
//       const update_query = 'UPDATE USERS SET reset_token = ? WHERE email = ?';

//         DBconnection.query(update_query, [tokan,result[0].email],async (err,resp)=>{
//           if(err){
//          console.log(err)
//           }
//         if(resp?.affectedRows == 1){

//           sendResetPasswordMail(result[0].email,tokan)
//          return  res.status(200).json({'massage' : "you have been reset successfully"})    
//           //  sendverificationMail(result[0].email,tokan)
//         }
//          })
//     }
//     }
//    })

// })


// router.post('/ResetPasswordTokenVerfiy',ResetPassCheckValidation,(req,res)=>{

//   const {email,otp,newpassword} = req.body;

//   if(!email){
//    return res.status(400).json({"massage" : 'email not valid'})
//   }
//   const query = 'SELECT * FROM USERS WHERE email = ? AND reset_token = ?';

//   DBconnection.query(query, [email,otp],async (err,result)=>{
//     if(err){
//       console.log(err)
//     }
//     if(result?.length  < 1){
//        return res.status(400).send('not a vaild user')
//     }
    
//     if(result){

//      if(!result[0].is_verified){
//        return res.status(400).send('you are not verifed yet')
//      }

//      if(result){
//       const hashedPassword = await hashPassword(newpassword);
//       const update_query = 'UPDATE USERS SET reset_token = ?, password_hash = ? WHERE email = ? AND reset_token = ?';

//         DBconnection.query(update_query, [null,hashedPassword,email,otp],async (err,resp)=>{
//           if(err){
//          console.log(err)
//           }
//         if(resp?.affectedRows == 1){
//          return  res.status(200).json({'massage' : "password successfully"})    
//         }
//          })
//     }
//     }
//    })

// })
module.exports = router;
  