const mongoose = require("mongoose");


const chatSchema = new mongoose.Schema({
    userResponse: [{
        type: String,
    }],
    botResponse: [{
        type: String,
    }],
    pnr_no: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchema"
    }
})



module.exports = mongoose.model("ChatSchema", chatSchema);