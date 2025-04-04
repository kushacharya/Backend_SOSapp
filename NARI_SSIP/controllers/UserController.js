/* eslint-disable no-unused-vars */
import 'dotenv/config';
import User from '../model/UserModel.js';
import ReportSchema from '../model/BugReportModel.js'
// import Post  from "../model/SOSModel.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';
import { validationResult } from "express-validator";
import {SignUpValidator} from './utils/Validators.js'


// eslint-disable-next-line no-undef
const sid = process.env.ACCOUNT_SID;
// eslint-disable-next-line no-undef
const Auth = process.env.AUTH_TOKEN;
const client = new twilio(sid,Auth,{
  lazyLoading:true,
});

const JWT_SECRET = 'nari2212';
const unique = 'password';
// for testing purpose
// eslint-disable-next-line no-unused-vars
export const getAllUser = async (req, res, next) => {
  //next will allow us to move available middlewear.
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: 'NO user found' });
  }
  return res.status(200).json({ users });
};

// get user when we need to show user data in profile(done)
export const getuser = async(req, res) =>{
  const phonenumber = req.body.userNumber
  let userDetails;
  try {
    userDetails = await User.findOne({phonenumber});
    res.status(200).send({ userDetails });
  } catch (err) {
    console.log(err);
  }

  if (!userDetails) {
     res.status(400).json({message:"Check UserId!"});
  }
}

// export const upDateUser = async(req,res) => {
//   const userId = req.params.id;
//   const {
//     name,
//     email,
//     phonenumber,
//     phonenumber2,
//     phonenumber3,
//     phonenumber4,
//     address,
//     country,
//     State,
//     district,
//     city,
//     password,
//     bloodgroup,
//     dateofbirth,
//     maritalstatus,
//   } = req.body;

//   let user = User.findOne({ userId })
//   if (!user) {
//     res.status(400).send({ message : "Bad request!" });
//   }
//  // res says user is updated by it is not updating in db.
//   try {
//   const userUpdate = User.updateOne({$set:{
//     name : req.body,
//     email : req.body,
//     phonenumber : req.body,
//     phonenumber2 : req.body,
//     phonenumber3 : req.body,
//     phonenumber4 : req.body,
//     address : req.body,
//     country : req.body,
//     State : req.body,
//     district : req.body,
//     city : req.body,
//     password : req.body,
//     bloodgroup :req.body,
//     dateofbirth : req.body,
//     maritalstatus :req.body,
//   } },req.params.id)

//   res.status(200).json({ message: "User updated succesfully!!"});
//              }
//        catch (err) {
//         res.status(500).send({message: "Server error!!"});
//   console.log(err);
//     }
  
// }

export const upDateUser = async (req, res) => {

  await Promise.all(SignUpValidator.validation?.map(validation => validation.run(req)) ?? []);
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({errors : errors.array()});
  }else{

  const userId = req.params.id;
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
    bloodgroup,
    dateofbirth,
    maritalstatus,
  } = req.body;

  let user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(400).send({ message: "Bad request!" });
  }

  try {
    await User.updateOne({ _id: userId }, {
      $set: {
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
        bloodgroup,
        dateofbirth,
        maritalstatus,
      }
    });

    res.status(200).json({ message: "User updated successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error!" });
   }
  }
};

// for testing purpose
// no need of validator
export const sendSOS = async(req,res,next) => {
  // const {
  //   to,
  //   live
  // } = req.body;
  // client.messages.create({
  //   body: "SMS testing for SOS from ${user}",
  //   from: "+15074794666",
  //   to: "+919427437463",
  // }).then((message) => {
  //   res.json({message : "SOS message sent!!"});
  // });

}

// for testing purpose
export const testing = async(req,res, next) =>{
    const{link, id} =req.body;
    const UserId = req.params.id;
    let userDetailsforSMS;
    try {
      userDetailsforSMS = await User.findById(UserId);
      res.status(200);
      console.log(userDetailsforSMS);
    } catch (err) {
      console.log(err);
    }

    if(!userDetailsforSMS){
       res.status(400).json({message:"Can't find User from this ID"});
    }

    client.messages.create({
      body:'link: ${req.link} and user details are ${userDetailsforSMS}',
      from:'+15074794666',
      to:'+919427437463'
    }).then((message) =>{
      res.status(200).json({message:"message sent succesfully!"});
    })

    const locationLink = req.body.link
    const userBody = {name :userDetailsforSMS.name,
                      emergencynumber : userDetailsforSMS.phonenumber,
                      address : userDetailsforSMS.address,
                      bloodgroup: userDetailsforSMS.bloodgroup,
                      maried: userDetailsforSMS.maritalstatus
    }
    const body = `link : ${locationLink} 
                  name : ${userBody.name}
                  emergency number : ${userBody.emergencynumber}
                  address : ${userBody.address}
                  blood group : ${userBody.bloodgroup}
                  marital status : ${userBody.maritalstatus}`

    const numbers = ["+918735054157","+919427437463"]

    // client.messages.create({
    //   body: body,
    //   from: "+15074794666",
    //   to: numbers,
    // }).then((message) => {
    //   res.json({message : "SOS message sent!!"});
    // });
}

export const reportBug = async(req,res, next) =>{
  const report = {
    phonenumber : req.body.phonenumber,
    bugreport : req.body.report
  }

  const newReport = new ReportSchema({
    phonenumber : req.body.phonenumber,
    bugreport : req.body.report
  })

   res.status(200).send({report});

  try {
    await newReport.save();
    console.log("saved in db");
  } catch (error) {
   console.log("something went wrong" + error);
  }
};
