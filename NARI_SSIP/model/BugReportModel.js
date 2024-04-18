import mongoose from 'mongoose'

const ReportSchema = new mongoose.Schema({
    phonenumber : {
        type : String
    },

    bugreport : {
        type: String
    }
})

export default mongoose.model("bugreport",ReportSchema);