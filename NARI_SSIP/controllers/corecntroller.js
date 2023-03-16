import 'dotenv/config';
import twilio from 'twilio'


const geoAPI = process.env.GEO_API;
const sid = process.env.ACCOUNT_SID;
const Auth = process.env.AUTH_TOKEN;
const client = new twilio(sid,Auth,{
    lazyLoading:true,
  });

export const sosbody = async(req,res,next) => {
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
   const latitude = reqbody.lat;
   const longitude = reqbody.lon;
   const link = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
   
    const smsbody = `link : ${link}
                    User mobile number : ${reqbody.primary_mobile}
                    SOS trigger time : ${reqbody.time}
                    battery life of mobile : ${reqbody.battery_life}
                    SOS trigger count : ${reqbody.count}`                    

    try{                
   client.messages.create({
    body: smsbody,
    from : "+15074794666",
    to : "+919427437463"
    // to : reqbody.guardians  //due to twilio policy I cant send testing messages other than registered number.
   }).then((message)  => {
     res.status(200).json({message : "SOS msg sent succesfully!"});
   })
    }
    catch(err){
        console.log(err);
        res.status(500).json({message : "Can't send message"});
    }
}