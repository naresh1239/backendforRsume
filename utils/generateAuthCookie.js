const jwt = require("jsonwebtoken")

const generateAuthCookie = (res,user)=>{
    const jwtToken =  jwt.sign(
       { _id : user._id,
        _email : user.email 
       },
        process.env.JWT_SECRET_KEY,
        {expiresIn : '1d'}
    )
    res.cookie('token', jwtToken)
    .json({'data' : 'Cookie set'});
    // res.status(200).send('verification successfully');
}

module.exports = {generateAuthCookie}