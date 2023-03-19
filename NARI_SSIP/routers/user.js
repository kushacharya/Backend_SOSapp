import express from 'express';
import {getAllUser, getuser} from '../controllers/UserController.js';
import { sosbody,getHistory } from "../controllers/CoreController.js";
import {signup, login, logout, OTPAuth, verifyOTP } from "../controllers/AuthController.js"
const router = express.Router();

//TODO exposing all users is a big privacy concern. Not required unless it has a significant business impact.
router.get('/',getAllUser);


router.get('/getuser/:id', getuser);
// router.get('/SOS', sendSOS);
// router.post('/testing/:id', testing)  // No use for now

// corecontroller
router.post('/sos',sosbody);
router.get('/sosHistory/:id',getHistory);

// AuthController
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout',logout);
router.post('/otp',OTPAuth);
router.post('/verifyotp',verifyOTP);

export default router;
