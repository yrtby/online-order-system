const User = require("../model/User");
const Token = require("../model/Token");
const Confirmation = require("../model/Confirmation");

const tokenCreator = require("../config/tokenCreator");
const mailSender = require("../config/mailer");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { ENV_JWT_ACCESS_TOKEN_SECRET, ENV_JWT_REFRESH_TOKEN_SECRET, ENV_JWT_EXPIRED_TIME, ENV_JWT_REFRESH_TIME } = process.env;

exports.createUser = async (req, res) => {
    const { email, password, address, business_name, business_address, role } = req.body;

    try{
        if(!(email && password && role)){
            return res.status(400).json({
                status: "fail",
                message: "all inputs are required"
            });
        }
    
        if(role == "seller" || role == "user"){
            if(role === "user"){
                if(!address){
                    return res.status(400).json({
                        status: "fail",
                        message: "address is required"
                    });
                }
            }
            if(role === "seller"){
                if(!(business_name && business_address)){
                    return res.status(400).json({
                        status: "fail",
                        message: "business_name and business_address are required"
                    });
                }
            }
        }else{
            return res.status(400).json({
                status: "fail",
                message: "role has not found"
            })
        }
    
        const existingUser = await User.findOne({email: email});
    
        if(existingUser){
            return res.status(409).json({
                status: "fail",
                message: "user already exists"
            });
        }
    
        encryptedPassword = await bcrypt.hash(password,10);
    
        const user = await User.create({
            email: email.toLowerCase(),
            password: encryptedPassword,
            address: address,
            business_name: business_name,
            business_address: business_address,
            role: role
        });
    
        let confirmationToken = tokenCreator.makeToken(90);
    
        await Confirmation.create({
            user: user._id,
            token: confirmationToken
        });
    
        mailSender.activationMailSender(email, confirmationToken);
    
        return res.status(201).json({
            status: "success",
            message: "user created, check your email for activation"
        });
    }catch(error){
        return res.status(500).json({
            status: "fail",
            message: error
        });
    }
}

exports.activateUser = async (req, res) => {
    const { token } = req.query;

    try{
        if(!token){
            return res.status(400).json({
                status: "fail",
                message: "all inputs are required"
            });
        }
    
        const activation = await Confirmation.findOne({token: token}).sort("-createdAt");
        const user = await User.findOne({_id:activation.user});
    
        if(user.enabled){
            return res.status(400).json({
                status: "fail",
                message: "this user already active"
            })
        }
    
        if(activation.confirmedAt){
            return res.status(409).json({
                status: "fail",
                message: "account already confirmed"
            });
        }
    
        if(!activation){
            return res.status(409).json({
                status: "fail",
                message: "token not found, please request token again"
            });
        }
    
        if(Date.now()>activation.expiredAt){
            return res.status(409).json({
                status: "fail",
                message: "token expired, please request token again"
            });
        }
    
        user.enabled = true;
        user.save();
        activation.confirmedAt = Date.now();
        activation.save();
    
        return res.status(200).json({
            status:'success',
            message:'activation success'
        });
    }catch(error){
        return res.status(500).json({
            status:'fail',
            message: error
        });
    }
}

exports.resendActivationUser = async (req, res) => {
    const { email } = req.body;

    try{
        if(!email){
            return res.status(400).json({
                status: "fail",
                message: "all inputs are required"
            });
        }
    
        const user = await User.findOne({email: email});
    
        if(!user){
            return res.status(400).json({
                status: "fail",
                message: "user not found"
            });
        }
    
        if(user.enabled){
            return res.status(400).json({
                status: "fail",
                message: "this user already active"
            });
        }
    
        await Confirmation.findOneAndRemove({user: user._id});
    
        let confirmationToken = extensions.makeToken(90);
    
        await Confirmation.create({
            user: user._id,
            token: confirmationToken
        });
    
        extensions.activationMailSender(user.first_name, user.last_name, email, confirmationToken);
    
        return res.status(200).json({
            status: "success",
            message: "activation email has been sent again, check your email for activation"
        });
    }catch(error){
        return res.status(400).json({
            status: "fail",
            message: error
        });
    }
}

exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    try{
        if(!(email && password)){
            return res.status(400).json({
                status: "fail",
                message: "all inputs are required"
            });
        }
    
        const existingUser = await User.findOne({email: email});
    
        if(!existingUser){
            return res.status(409).json({
                status: "fail",
                message: "user not found"
            });
        }
    
        const checkPassword = await bcrypt.compare(password, existingUser.password);
    
        if(!checkPassword){
            return res.status(400).json({
                status: "fail",
                message: "password not match"
            });
        }
    
        if(!existingUser.enabled){
            return res.status(400).json({
                status: "fail",
                message: "user need activation"
            });
        }
    
        const accessToken = jwt.sign(
            { _id: existingUser._id },
            ENV_JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: ENV_JWT_EXPIRED_TIME }
        );
        const refreshToken = jwt.sign(
            { _id: existingUser._id },
            ENV_JWT_REFRESH_TOKEN_SECRET,
            { expiresIn: ENV_JWT_REFRESH_TIME }
        );
    
        await Token.create({
            user: existingUser._id,
            token: refreshToken
        });
    
        return res.status(200).json({
            status: "success",
            message: "user logged in",
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
                email: existingUser.email,
                role: existingUser.role
            }
        });
    }catch(error){
        res.status(500).json({
            status: "fail",
            message: error
        });
    }
}

exports.logoutUser = async (req, res) => {
    const { refreshToken } = req.body;
    
    try{
        if(!token){
            return res.status(401).json({
                status: "fail",
                message: "Invalid token"
            });
        }
    
        const existingToken = await Token.findOne({token: token});
        
        if(!existingToken){
            return res.status(409).json({
                status: "fail",
                message: "token not found"
            });
        }
    
        await Token.findOneAndRemove({
            token: refreshToken
        });
    
        return res.status(200).json({
            status: "success",
            message: "logout successfull"
        });
    }catch(error){
        return res.status(500).json({
            status: "fail",
            message: error
        });
    }
}
