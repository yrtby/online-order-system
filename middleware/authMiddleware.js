const User = require('../model/User');
const jwt = require("jsonwebtoken");

const { ENV_JWT_ACCESS_TOKEN_SECRET } = process.env;

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    try{
        if (!token) {
            return res.status(401).json({
                status:"fail",
                message:"a token is required for authentication"
            });
        }   

        const decode = jwt.verify(token, ENV_JWT_ACCESS_TOKEN_SECRET);

        if(!decode){
            return res.status(400).json({
                status: "fail",
                message: "tokenmoken"
            })
        }
        const user = await User.findById(decode._id);
        let userArr = {
            "id": user._id,
            "email": user.email,
            "role": user.role
        };
        req.user = userArr;
    }catch(error){
        return res.status(500).json({
            status: "fail",
            message: "invalid token"
        });
    }

    return next();
}
