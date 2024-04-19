/* eslint-disable no-unused-vars */
import 'dotenv/config';
import twilio from 'twilio'
import Post  from "../model/SOSModel.js"; //change
import { validationResult } from 'express-validator';
import { SOSvalidator } from './utils/Validators.js'
import { Types } from 'mongoose';


// eslint-disable-next-line no-undef
const geoAPI = process.env.GEO_API;
// eslint-disable-next-line no-undef
const sid = process.env.ACCOUNT_SID;
// eslint-disable-next-line no-undef
const Auth = process.env.AUTH_TOKEN;
const client = new twilio(sid,Auth,{
    lazyLoading:true,
  });

export const sosbody = async(req,res) => {

  let sosObjectId;

  // validaion in sos body req??
  await Promise.all(SOSvalidator.map(validation => validation.run(req)))
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors : errors.array() });
  }else{

    const reqbody = {
        checkString : req.body.checkString,
        // user_id : req.body.user_id,
        primary_mobile : req.body.primary_mobile,
        name : req.body.name,
        lat : req.body.lat,
        lon : req.body.lon,
        time : req.body.time,
        guardians : req.body.guardians,
        battery_life : req.body.battery_life,
        count : req.body.count,
        bloodgroup : req.body.bloodgroup,
        gender : req.body.gender,
    }

    //It will save User's SOS history
    const sosTrig = new Post({
      // user_id : req.body.user_id,
      name : req.body.name,
      primary_mobile : req.body.primary_mobile,
      lat : req.body.lat,
      lon : req.body.lon,
      time : req.body.time,
      guardians : req.body.guardians,
      battery_life : req.body.battery_life,
      count : req.body.count,
      bloodgroup : req.body.bloodgroup,
      gender : req.body.gender,

    });

    try {
      const savedSosTrig = await sosTrig.save();
      console.log("saved in db");

      sosObjectId = savedSosTrig._id;
      console.log("ObjectId",sosObjectId);

      } catch (err) {
      console.log(err);
    }

    
   
    // res.json({message: "SOS message saved in history"});  //optional: no need to send json
    if (reqbody.checkString == "sms") { 
      
    

   const latitude = reqbody.lat;
   const longitude = reqbody.lon;
   const numbers = ['+91 87350 54157','+919427437463']
   const link = `domainlink/${sosObjectId}`;
   
    const smsbody = `link : ${link}
                    SOS triggered by : ${reqbody.name}
                    gender : ${reqbody.gender}
                    bloodgroup : ${reqbody.bloodgroup}
                    User mobile number : ${reqbody.primary_mobile}
                    SOS trigger time : ${reqbody.time}
                    battery life of mobile : ${reqbody.battery_life}
                    SOS trigger count : ${reqbody.count}
                    mobile-numbers of guardians : ${reqbody.guardians}`
                    console.log(smsbody);

     try{       
   client.messages.create({
    body: "+919427437463",
    from : "+15074794666",
    to : '919427437463',
    // to : reqbody.guardians  //due to twilio policy I cant send testing messages other than registered number.
   }).then((message)  => {
     res.status(200).json({message : "SOS msg sent succesfully!"});
   })
  res.status(200).json({message : "SOS msg sent succesfully!"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message : "Can't send message"});
     }
    }
  if (reqbody.checkString == "update") {
    // will update the dynamic link!
  }
  if (reqbody.checkString == "safe") {
    //terminate the timer in frontend and end the sos location updation process
    
  }
  } 
}

export const dynamiclink = async(req,res) =>{
    const reqbody = {
      checkString : req.body.checkString,
      primary_mobile : req.body.primary_mobile,
      name : req.body.name,
      lat : req.body.lat,
      lon : req.body.lon,
      time : req.body.time,
      guardians : req.body.guardians,
      battery_life : req.body.battery_life,
      count : req.body.count,
      bloodgroup : req.body.bloodgroup,
      gender : req.body.gender,
    }

    

    const updateField ={
      lat : req.body.lat,
      lon: req.body.lon
      }

    try {
      const updateSOSTrig = await Post.findOneAndUpdate({primary_mobile:reqbody.primary_mobile},{$set : updateField},{new : true});

      if (!updateSOSTrig) {
        return res.status(404).json({ error : "Document not found!" });
      }

      console.log("Updated document:",updateSOSTrig);
      return res.status(200).json({ message : "Document updated!", updateSOSTrig });
    } catch(err){
      return res.status(500).json({ error: "Failed to update document" });
    }

}

export const getallHst = async(req,res) => {
  let hist;
  try {
    hist = await Post.find();
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({ hist });
}

export const getHistory = async(req,res) => {
  const {primary_mobile} = req.body;
  let sosHistory;
  try {
    sosHistory = await Post.find( {primary_mobile: primary_mobile});
    console.log(sosHistory);

    // const historyBody = `SOS triggered from: ${sosHistory.primary_mobile},
    //                      location link: https://www.google.com/maps/search/?api=1&query=${sosHistory.lat},${sosHistory.lon} ,
    //                      Time when SOS triggered ${sosHistory.time},
    //                      SOS messages set to: ${sosHistory.guardians},
    //                      Battery life: ${sosHistory.battery_life},
    //                      Total count of SOS: ${sosHistory.count}`


    let historyBody = '';
    for (let i = 0; i < sosHistory.length; i++) {
      const historyItem = sosHistory[i];
      historyBody += `SOS triggered from: ${historyItem.primary_mobile},
                       location link: 'domainlink' ,
                       Time when SOS triggered ${historyItem.time},
                       SOS messages set to: ${historyItem.guardians},
                       Battery life: ${historyItem.battery_life},
                       Total count of SOS: ${historyItem.count}\n`;
    }

    res.status(200).send({historyBody});
  }
  catch(err){
    console.log(err);
  }
}