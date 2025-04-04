import express from 'express';
import {getAllUser, getuser, upDateUser,reportBug} from '../controllers/UserController.js';
import { sosbody,getHistory, /*getallHst*/ dynamiclink, } from "../controllers/CoreController.js";
import {signup, login, logout, OTPAuth, verifyOTP } from "../controllers/AuthController.js"
import {locationTracker} from '../controllers/WebsiteController.js'
const router = express.Router();
router.use(express.static('public'))

//TODO exposing all users is a big privacy concern. Not required unless it has a significant business impact.
router.get('/',getAllUser);

// USERcontroller
router.post('/getuser', getuser);
router.put('/updateuser/:id', upDateUser);

// corecontroller
router.post('/sos',sosbody);
router.post('/sosHistory',getHistory);
router.put('/dynamiclink',dynamiclink)
router.post('/report',reportBug)

// AuthController
router.post('/signup', signup);  //also in user control as i merged post req to signup (It will send all user data in server at the time of signup)
router.post('/login', login); // not in use
router.post('/logout',logout);
router.post('/otp',OTPAuth);
router.post('/verifyotp',verifyOTP);

//website controller
router.post('/locationtrack',locationTracker);

export default router;
