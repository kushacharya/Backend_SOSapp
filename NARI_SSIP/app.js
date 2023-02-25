import express from 'express'
import mongoose from 'mongoose'
import router from "./routers/user-routs.js";


const app = express()
app.use(express.json());
app.use("/api/user",router);
mongoose.connect('mongodb+srv://kushacharya:kta449269@cluster0.5m03efq.mongodb.net/nari?retryWrites=true&w=majority')
  .then(() => app.listen(3000))
  .then(() => console.log('connected and listening to localhost on 3000'))
// eslint-disable-next-line no-undef
  .catch(() => console.log(err))

// password: kta449269
// app.listen(3000);
