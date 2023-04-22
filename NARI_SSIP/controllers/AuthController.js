/* eslint-disable no-unused-vars */
// import User from '../model/UserModel.js';
import session  from "express-session";
import User from '../model/UserModel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';
import 'dotenv/config';
import cookie from 'cookie-parser';
import { body,check, validationResult } from 'express-validator';
import { PhoneValidatorRules, OTPValidationRules,SignUpValidator } from './utils/Validators.js'




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

  await Promise.all(PhoneValidatorRules.map(validation => validation.run(req)))

    // req => mobile number 
    // res => otp

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }else{
    const phonenumber = req.body.phonenumber;
    const checkString = req.body.checkString; // checkString will be set for new user.

    // validator check 
    // check('phonenumber','Phone must be validate').isMobilePhone('en-IN')
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }else{

       //404 not found
    let user;
    user = await User.findOne({ phonenumber })
    if (checkString != "new" && !user) {  
      res.status(203).json({message : 'User not found! try login instead'});
    }else
    if (checkString == "new" && user) {
      res.status(403).json({ message: 'User already available! login Instead!!'});
    }
    else{

        try {
              const otpResponse = await client.verify.v2.services(OTP_SERVICE_SID)
              .verifications.create({
                  to: `${phonenumber}`,
                  channel : 'sms'
              });
              res.status(200).json({message:"OTP send succesfully"});
        } catch (err) {
        console.log(err);
        res.status(err?.status || 400 ).json(err?.message || {message:"Something went wrong!!"});
        }
      }
    }
  }
};


export const verifyOTP = async(req,res) => {

  await Promise.all(PhoneValidatorRules.map(validation => validation.run(req)))
  await Promise.all(OTPValidationRules.map(validation => validation.run(req)))

  const {
    phonenumber,code
  } = req.body;

  //404 not found
  

  try {
    const verifyResponse = await client.verify.v2.services(OTP_SERVICE_SID)
    .verificationChecks.create({
      to: `${phonenumber}`,
      code: `${code}`
    });

    if (verifyResponse.status === 'approved') {
      const UserStatus = 'online'
      // res
      res.status(200).cookie('userStatus' ,UserStatus).json({otpVerified: true, message: 'OTP verified succesfully!', UserStatus});
      
    }else{
      res.status(200).json({otpVerified: false, message: 'Wrong OTP!'});
    }
    // res.status(200).json(`OTP verified Succesfuly!: ${JSON.stringify(verifyResponse)}`);
  } catch (err) {
    res.status(err?.status || 400).send(err?.message || 'Somthing went wrong!!');
    console.log(err);
  }
}


export const logout = async( req,res) => {

  // 404 data not found

  await Promise.all(PhoneValidatorRules.map(validation => validation.run(req)))

    //req => user.id
    //res => code
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors : errors.array() });
    }else{
      const{
        phonenumber
    } = req.body.phonenumber;

    User.updateOne({ phonenumber }, {$set:{status: 'offline'}}, (err, result) => {
      if(err) {
        console.log(err);
        res.status(500).json({message:"Can't LogOut! Internal error!"});
      }else{
        const UserStatus = 'offline'

        res.status(200).cookie('userStatus', UserStatus).json({message:"LogOut Succesfully!", UserStatus});
        // res.clearCookie('jwtToken');
        
        }
     })
    }
    
};

// will do validation after concern of @ashivyas
export const signup = async (req, res) => {

  await Promise.all(SignUpValidator.map(validation => validation.run(req)))
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors : errors.array() });
  }else{
  
    const {
      name,
      gender,
      maritalstatus,
      country,
      State,
      district,
      bloodgroup,
      ImageString,
      guardians,
      phonenumber
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
      phonenumber: req.body.phonenumber,
      guardians: req.body.guardians,
      country: req.body.country,
      State: req.body.State,
      district: req.body.district,
      bloodgroup: req.body.bloodgroup,
      maritalstatus: req.body.maritalstatus,
      gender: req.body.gender,
      ImageString: req.body.ImageString
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
    } catch (err) {
      return console.log(err);
    }
    const UserStatus = "online"
    return res.status(201).cookie('userStatus' ,UserStatus).json({message:"Sign up successfully!"});
  }
};


// TODO: change the formate of login // by using only otp
// Already done with OTP validation endpoints but it is here for plan B==> @ashivyas
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