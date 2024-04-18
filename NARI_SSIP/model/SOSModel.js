import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
   

   primary_mobile:{
    type: String,
   },

   name:{
      type: String,
   
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
   },

   bloodgroup : {
      type :String
   },

   gender : {
      type : String
   },
   
})

export default mongoose.model("Post",PostSchema)