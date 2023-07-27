/* eslint-disable no-undef */
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import router from './routers/user.js';

const PORT = process.env.PORT || 3000;
const MONGODB = process.env.MONGODB;

const app = express();
app.use(express.json({limit: '75mb'}));
app.use('/api/user', router);
app.use(express.static('public'));

mongoose.set('strictQuery', false);
mongoose
  .connect(MONGODB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to mongodb');
    app.listen(PORT, () => {
      console.log(`server is running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`error while connecting to mongodb ${err}`);
  });

// password: kta449269
// app.listen(3000);
