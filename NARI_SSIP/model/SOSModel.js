import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    link:{
        type: String
    }
})

export default mongoose.model("post",PostSchema)