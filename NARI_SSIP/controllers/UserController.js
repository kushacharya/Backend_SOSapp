/* eslint-disable no-unused-vars */
import User from '../model/UserModel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

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


// SignUp
export const signup = async (req, res, next) => {
  const {
    name,
    email,
    phonenumber,
    phonenumber2,
    phonenumber3,
    phonenumber4,
    address,
    country,
    State,
    district,
    city,
    password,
    bloodgroup,
    dateofbirth,
    maritalstatus,
  } = req.body;

  let existUser;
  try {
    existUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (existUser) {
    return res.status(400).json({
      message: 'Email is alreay used in exist account! Login instead.',
    });
  }
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hashSync(unique, salt);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phonenumber: req.body.phonenumber,
    phonenumber2: req.body.phonenumber2,
    phonenumber3: req.body.phonenumber3,
    phonenumber4: req.body.phonenumber4,
    address: req.body.address,
    country: req.body.country,
    State: req.body.State,
    district: req.body.district,
    city: req.body.city,
    password: hashedPassword,
    bloodgroup: req.body.bloodgroup,
    dateofbirth: req.body.dateofbirth,
    maritalstatus: req.body.maritalstatus,
  });

  const data = {
    user: {
      id: user.id,
    },
  };

  const AuthToken = jwt.sign(data, JWT_SECRET);

  //  res.json(AuthToken);

  try {
    await user.save();
  } catch (err) {
    return console.log(err);
  }
  return res.status(201).json({message:"Sign up successfully!"});
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email });
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
      .json({ message: "Couldn't find user with this email!" });
  }


  
const isPasswordCoreect = bcryptjs.compareSync(unique,user.password);

  

  // const isPasswordCoreect = bcryptjs.compareSync(password, unique);
  if (!isPasswordCoreect) {
    res.status(400).json({ message: 'Password is incorrect' });
  }
  return res.status(200).json({ message:"login Succesfully!"});
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