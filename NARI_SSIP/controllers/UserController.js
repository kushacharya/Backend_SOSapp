/* eslint-disable no-unused-vars */
import 'dotenv/config';
import User from '../model/UserModel.js';
// import Post  from "../model/SOSModel.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';


// eslint-disable-next-line no-undef
const sid = process.env.ACCOUNT_SID;
// eslint-disable-next-line no-undef
const Auth = process.env.AUTH_TOKEN;
const client = new twilio(sid,Auth,{
  lazyLoading:true,
});

const JWT_SECRET = 'nari2212';
const unique = 'password';

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


export const getuser = async(req, res) =>{
  const userId = req.params.id;
  let userDetails;
  try {
    userDetails = await User.findById(userId);
    res.status(200).json({userDetails});
  } catch (err) {
    console.log(err);
  }

  if (!userDetails) {
     res.status(400).json({message:"Check UserId!"});
  }
}


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

    // client.messages.create({
    //   body:'link: ${req.link} and user details are ${userDetailsforSMS}',
    //   from:'+15074794666',
    //   to:'+919427437463'
    // }).then((message) =>{
    //   res.status(200).json({message:"message sent succesfully!"});
    // })

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