import express from 'express';
import { getAllUser, signup, login } from '../controllers/UserController.js';

const router = express.Router();

//TODO exposing all users is a big privacy concern. Not required unless it has a significant business impact.
//router.get('/',getAllUser);
router.post('/signup', signup);
router.get('/login', login);
export default router;
