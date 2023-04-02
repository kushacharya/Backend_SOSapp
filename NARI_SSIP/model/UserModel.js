
import mongoose from 'mongoose';

const Schema = mongoose.Schema

// eslint-disable-next-line no-unused-vars
const userSchema = new Schema({
  name: {
    type: String,
    required: true

  },
  phonenumber: {
    type : Number,
    required: true,
  },
  phonenumber2:{
    type: Number,
    required: true,
  },
  phonenumber3:{
    type: Number,
    required : true,
  },
  phonenumber4:{
    type: Number,
    required: true
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
  city:{
    type: String,
    required: true
  },
  bloodgroup:{
    type: String,
    required: true
  },
  dateofbirth:{
    type: Date,
    required: true
  },
  maritalstatus:{
    type:Boolean,
    required: true
  }
})

export default mongoose.model("User", userSchema); 
