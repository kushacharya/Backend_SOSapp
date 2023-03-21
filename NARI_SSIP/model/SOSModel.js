import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
   user_id:{
    type: String,
   //  required:true
   },

   primary_mobile:{
    type: String,
   //  required: true
   },

   lat:{
    type: String,
   //  required: true
   },

   lon:{
    type: String,
   //  required: true
   },

   time:{
    type: String,
   //  required : true
   },

   guardians:{
    type: Array,
    phonenumber: []
   //  required: true
   },

   battery_life:{
    type: String
   },

   count:{
    type: String
   }
})

export default mongoose.model("post",PostSchema)