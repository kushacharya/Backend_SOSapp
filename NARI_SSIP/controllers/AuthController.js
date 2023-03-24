/* eslint-disable no-unused-vars */
// import User from '../model/UserModel.js';
import session  from "express-session";
import User from '../model/UserModel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';
import 'dotenv/config';
import cookie from 'cookie-parser';
import { check, validationResult } from 'express-validator';




const JWT_SECRET = 'nari2212';
const unique = 'password';
const {
    ACCOUNT_SID,AUTH_TOKEN,OTP_SERVICE_SID
  // eslint-disable-next-line no-undef
} = process.env;

const client = new twilio(ACCOUNT_SID,AUTH_TOKEN,{
    lazyLoading:true,
});


export const OTPAuth = async(req,res) =>{
    // req => mobile number 
    // res => otp

    const {
        phonenumber
    } = req.body.phonenumber;

    // validator check ✅
    check('phonenumbe','Phone must be validate').isMobilePhone('en-IN')
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json({ errors : errors.array() });
    }else{

    try {
        
    const otpResponse = await client.verify.v2.services(OTP_SERVICE_SID)
    .verifications.create({
        to: '+919427437463',
        channel : 'sms'
    });
    res.status(200).json({message:"OTP send succesfully"});
        } catch (err) {
        console.log(err);
        res.status(err?.status || 400 ).json(err?.message || {message:"Something went wrong!!"});
    }

        }
};


export const verifyOTP = async(req,res) => {
  const {
    phonenumber,otp
  } = req.body;

  try {
    const verifyResponse = await client.verify.v2.services(OTP_SERVICE_SID)
    .verificationChecks.create({
      to: `${phonenumber}`,
      code: otp
    });
    res.status(200).json(`OTP verified Succesfuly!: ${JSON.stringify(verifyResponse)}`);
  } catch (err) {
    res.status(err?.status || 400).send(err?.message || 'Somthing went wrong!!');
    console.log(err);
  }
}


export const logout = async(req,res) => {
    //req => user.id
    //res => code
    const{
        phonenumber
    } = req.body.email;
    
    User.updateOne({ phonenumber }, {$set:{status: 'offline'}}, (err, result) => {
      if(err) {
        console.log(err);
        res.status(500).json({message:"Can't LogOut! Internal error!"});
      }else{
        res.status(200).json({message:"LogOut Succesfully!"});
        res.cleaCookie('jwtToken');
      }
    })
    
};

export const signup = async (req, res) => {
    const {
      name,
      // email,
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
      // email: req.body.email,
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
    res.cookie('jwtToken',AuthToken,{httpOnly:true});
  
    try {
      await user.save();
      User.updateOne({phonenumber},{$set: {status:'online'}});
    } catch (err) {
      return console.log(err);
    }
    return res.status(201).json({message:"Sign up successfully!"});
    
};


// TODO: change the formate of login // by using only otp
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
        .json({ message: "Couldn't find user with this phonenumber!" });
    }
  
  
    
    const isPasswordCoreect = bcryptjs.compareSync(unique,user.password);
  
    
  
    // const isPasswordCoreect = bcryptjs.compareSync(password, unique);
    if (!isPasswordCoreect) {
      res.status(400).json({ message: 'Password is incorrect' });
    }else{
    res.status(200).json({ message:"login Succesfully!"});
    User.updateOne({phonenumber},{$set: {status : 'online'}});
    }
};