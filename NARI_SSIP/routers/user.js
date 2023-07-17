import express from 'express';
import {getAllUser, getuser, upDateUser} from '../controllers/UserController.js';
import { sosbody,getHistory, /*getallHst*/ dynamiclink} from "../controllers/CoreController.js";
import {signup, login, logout, OTPAuth, verifyOTP } from "../controllers/AuthController.js"
const router = express.Router();

//TODO exposing all users is a big privacy concern. Not required unless it has a significant business impact.
router.get('/',getAllUser);

// router.get('/getallhist',getallHst);

// router.get('/SOS', sendSOS);
// router.post('/testing/:id', testing)  // No use for now

// USERcontroller
router.post('/getuser', getuser);
router.put('/updateuser/:id', upDateUser);

// corecontroller
router.post('/sos',sosbody);
router.post('/sosHistory',getHistory);
router.post('/dynamiclink',dynamiclink)

// AuthController
router.post('/signup', signup);  //also in user control as i merged post req to signup (It will send all user data in server at the time of signup)
router.post('/login', login);
router.post('/logout',logout);
router.post('/otp',OTPAuth);
router.post('/verifyotp',verifyOTP);

export default router;
