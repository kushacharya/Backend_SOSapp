/* eslint-disable no-unused-vars */
// import User from '../model/UserModel.js';
import session  from "express-session";
import User from '../model/UserModel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';
import 'dotenv/config'


const JWT_SECRET = 'nari2212';
const unique = 'password';
const {
    ACCOUNT_SID,AUTH_TOKEN,OTP_SERVICE_SID
// eslint-disable-next-line no-undef
} = process.env;

const client = new twilio(ACCOUNT_SID,AUTH_TOKEN,{
    lazyLoading:true,
  }).varify;

export const OTPAuth = async(req,res) =>{
    // req => mobile number 
    // res => otp

    const {
        phonenumber
    } = req.body.phonenumber;

    try {
        
        //  Cannot read properties of undefined (reading 'services')
    const otpResponse = await client.services(OTP_SERVICE_SID)
    .varification.create({
        to: "+919427437463",
        channel : "sms"
    });
    res.status(200).json({message:"OTP send succesfully"});
        } catch (err) {
        console.log(err);
        res.status(err?.status || 400 ).json(err?.message || {message:"Something went wrong!!"});
    }
};

export const logout = async(req,res) => {
    //req => user.id
    //res => code
    const{
        email
    } = req.body.email;
    try {
        const user = await User.findOne({ email });

        // destroy() can't be read / undefined
        req.session.destroy((err) =>{
            if (err) {
                console.log(err);
                res.status(500).json({message:"Can't logout! Internal server error!!"});
            }else{
                res.status(200).json({message:"Logged out succesfully!"});
            }
        })   
        if(!user){
             res.json(400).json({message:"User not exist!"});
             
        }
    } catch (err) {
        console.log(err);
    }
    
};

export const signup = async (req, res) => {
    const {
      name,
      email,
      phonenumber,
      phonenumber2,
      phonenumber3,
      phonenumber4,
      address,
      country,
      State,
      district,
      city,
      password,
      bloodgroup,
      dateofbirth,
      maritalstatus,
    } = req.body;
  
    let existUser;
    try {
      existUser = await User.findOne({ phonenumber });
    } catch (err) {
      return console.log(err);
    }
    if (existUser) {
      return res.status(400).json({
        message: 'Phone-number is alreay used in exist account! Login instead.',
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hashSync(unique, salt);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      phonenumber2: req.body.phonenumber2,
      phonenumber3: req.body.phonenumber3,
      phonenumber4: req.body.phonenumber4,
      address: req.body.address,
      country: req.body.country,
      State: req.body.State,
      district: req.body.district,
      city: req.body.city,
      password: hashedPassword,
      bloodgroup: req.body.bloodgroup,
      dateofbirth: req.body.dateofbirth,
      maritalstatus: req.body.maritalstatus,
    });
  
    const data = {
      user: {
        id: user.id,
      },
    };
  
    const AuthToken = jwt.sign(data, JWT_SECRET);
  
    //  res.json(AuthToken);
  
    try {
      await user.save();
    } catch (err) {
      return console.log(err);
    }
    return res.status(201).json({message:"Sign up successfully!"});
};

export const login = async (req, res, next) => {
    const { phonenumber, password } = req.body;
    let user;
    try {
      user = await User.findOne({ phonenumber });
    } catch (err) {
      return console.log(err);
    }
  
    const data = {
      user: {
        id: user.id,
      },
    };
  
    const AuthToken = jwt.sign(data, JWT_SECRET);
  
    if (!user) {
      return res
        .status(404)
        .json({ message: "Couldn't find user with this email!" });
    }
  
  
    
    const isPasswordCoreect = bcryptjs.compareSync(unique,user.password);
  
    
  
    // const isPasswordCoreect = bcryptjs.compareSync(password, unique);
    if (!isPasswordCoreect) {
      res.status(400).json({ message: 'Password is incorrect' });
    }
    return res.status(200).json({ message:"login Succesfully!"});
};