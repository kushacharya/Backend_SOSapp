/* eslint-disable no-unused-vars */
import 'dotenv/config';
import twilio from 'twilio'
import Post  from "../model/SOSModel.js";


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
    const reqbody = {
        user_id : req.body.user_id,
        primary_mobile : req.body.primary_mobile,
        lat : req.body.lat,
        lon : req.body.lon,
        time : req.body.time,
        guardians : req.body.guardians,
        battery_life : req.body.battery_life,
        count : req.body.count
    }

    const sosTrig = new Post({
      user_id : req.body.user_id,
      primary_mobile : req.body.primary_mobile,
      lat : req.body.lat,
      lon : req.body.lon,
      time : req.body.time,
      guardians : req.body.guardians,
      battery_life : req.body.battery_life,
      count : req.body.count
    });

    try {
      await sosTrig.save();
      } catch (err) {
      console.log(err);
    }
    // res.json({message: "SOS message saved in history"});  //optional: no need to send json

   const latitude = reqbody.lat;
   const longitude = reqbody.lon;
   const numbers = ['+91 87350 54157','+919427437463']
   const link = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
   
    const smsbody = `link : ${link}
                    User mobile number : ${reqbody.primary_mobile}
                    SOS trigger time : ${reqbody.time}
                    battery life of mobile : ${reqbody.battery_life}
                    SOS trigger count : ${reqbody.count}`                    

    try{                
  //  client.messages.create({
  //   body: "+919427437463",
  //   from : "+15074794666",
  //   to : numbers,
  //   // to : reqbody.guardians  //due to twilio policy I cant send testing messages other than registered number.
  //  }).then((message)  => {
  //    res.status(200).json({message : "SOS msg sent succesfully!"});
  //  })

  res.status(200).json({message:"SMS sent!"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message : "Can't send message"});
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
  const userId = req.params.id;
  let sosHistory;
  try {
    sosHistory = await Post.findById(userId);
    console.log(sosHistory);

    const historyBody = `SOS triggered from: ${sosHistory.primary_mobile},
                         location link: https://www.google.com/maps/search/?api=1&query=${sosHistory.lat},${sosHistory.lon} ,
                         Time when SOS triggered ${sosHistory.time},
                         SOS messages set to: ${sosHistory.guardians},
                         Battery life: ${sosHistory.battery_life},
                         Total count of SOS: ${sosHistory.count}`

    res.status(200).json({historyBody});
  }
  catch(err){
    console.log(err);
  }
}