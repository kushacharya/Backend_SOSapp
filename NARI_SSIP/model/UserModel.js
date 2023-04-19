
import mongoose from 'mongoose';

const Schema = mongoose.Schema

// eslint-disable-next-line no-unused-vars
const userSchema = new Schema({
  name: {
    type: String,
    required: true

  },
  gender:{
    type:String,
    required:true
  },
  phonenumber: {
    type : Number,
    required: true,
  },
 guardians:{
    type: Array,
    phonenumbers: [],
 },
  address:{
    type: String,
    required: true
  },
  country:{
    type: String,
    required: true
  },
  State:{
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  bloodgroup:{
    type: String,
    required: true
  },
  dateofbirth:{
    type: String,
    required: true
  },
  maritalstatus:{
    type:String,
    required: true
  },
  ImageString:{
    type:String,
    required: true
  }
})

export default mongoose.model("User", userSchema); 
