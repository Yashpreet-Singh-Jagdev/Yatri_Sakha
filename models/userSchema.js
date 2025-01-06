const mongoose = require("mongoose");
const { Number } = require("twilio/lib/twiml/VoiceResponse");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pnr_no: {
        type: Number,
        required: true
    },
    mob_no: {
        type: Number,
        required: true
    }
})



const user = mongoose.model("UserSchema", userSchema);

module.exports = user