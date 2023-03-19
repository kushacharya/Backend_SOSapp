import express from 'express';
import {signup, login,getuser, testing } from '../controllers/UserController.js';
import { sosbody,getHistory } from "../controllers/corecntroller.js";

const router = express.Router();

//TODO exposing all users is a big privacy concern. Not required unless it has a significant business impact.
// router.get('/',getAllUser);
router.post('/signup', signup);
router.post('/login', login);
router.get('/getuser/:id', getuser);
// router.get('/SOS', sendSOS);
router.post('/testing/:id', testing)

// corecontroller
router.post('/sos',sosbody);
router.get('/sosHistory/:id',getHistory);

export default router;
