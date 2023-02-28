import express from 'express';
import {signup, login } from '../controllers/UserController.js';

const router = express.Router();

//TODO exposing all users is a big privacy concern. Not required unless it has a significant business impact.
//router.get('/',getAllUser);
router.post('/signup', signup);
router.post('/login', login);
export default router;
