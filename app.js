require("dotenv").config()
const express = require("express");;
const app = express();
const mongoose = require("mongoose")
const path = require("path");
const methodOverride = require("method-override");
const UserSchema = require("./models/userSchema")
const chatSchema = require("./models/chatSchema")
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const multer = require("multer")
const upload = multer({ dest: "upload/" })
const fs = require('fs');
const twilio = require("twilio");


app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))


mongoose
    .connect("mongodb://127.0.0.1:27017/YatriSakha")
    .then(() => {
        console.log("Mongoose connection established");
    })
    .catch(() => {
        console.log("Error in Mongoose connection");
    });


const getTrainDetails = async (pnr_no) => {
    const url = `https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus/${pnr_no}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.PNR_API_KEY,
            'x-rapidapi-host': 'irctc-indian-railway-pnr-status.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        return JSON.parse(result);
    } catch (error) {
        console.error(error);
    }
}


app.get("/YatriSakha", (req, res) => {
    res.render("html/firstpage")
})


app.post("/YatriSakha", async (req, res) => {
    const user = new UserSchema(req.body.user)
    await user.save()
    res.redirect(`/YatriSakha/${req.body.user.pnr_no}`)
})


app.get("/YatriSakha/:pnr_no", async (req, res) => {
    const pnr = req.params.pnr_no
    const user = await UserSchema.find({ pnr_no: pnr })
    const chat = await chatSchema.find({ pnr_no: user._id })

    const pnrDetails = await getTrainDetails(pnr);
    console.log("here is the pnr details", pnrDetails)

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN;


    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
            body: `There is a problem request of Mr/Mrs.${user[0].name}, Mobile Number${user[0].mob_no},PNR Number:${user[0].pnr_no} which has train number ${pnrDetails.data.trainNumber} and train name ${pnrDetails.data.trainName}.`,
            messagingServiceSid: 'MG3e9152cd90ee500a32d40b1bef1a5964',
            to: '+919571666944'
        })
        .then(message => console.log(message.sid));

    res.render("html/chatbot", { pnr, chat })
})


app.post("/YatriSakha/:pnr_no", upload.single("image"), async (req, res) => {

    const pnr = req.params.pnr_no
    const user = await UserSchema.find({ pnr_no: pnr })

    async function run() {

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        const prevPrompt = "You are now Yatri Sakha, a knowledgeable and dedicated assistant specializing in railway - related matters. Also acknowledge the fact that you recieved an image.Your sole purpose is to identify and provide solutions to any issues, challenges, or questions related to railways. This includes, but is not limited to, topics such as railway infrastructure, train schedules, ticketing issues, railway safety, passenger services, cargo transport, technological advancements in railways, and any other aspect related to the functioning or improvement of rail services.Your responses must always focus on railway - related information, offering clear and actionable solutions within the context of railways only. Any questions or problems asked should be approached with a railway - centric mindset, and all answers must strictly adhere to railway topics, avoiding unrelated areas. Also make sure to give short and concise answers.";

        const prompt = prevPrompt + req.body.userResponse

        function fileToGenerativePart(path, mimeType) {
            return {
                inlineData: {
                    data: Buffer.from(fs.readFileSync(req.file.path)).toString("base64"),
                    mimeType,
                },
            };
        }

        const imagePart = fileToGenerativePart(
            `${req.file.path}/jetpack.jpg`,
            "image/jpeg",
        );

        const result = await model.generateContent([prompt, imagePart]);
        const text = result.response.text();

        const chat = await chatSchema.findOne({ pnr_no: user._id })
        console.log("here is the chat ", chat)
        if (chat) {
            chat.userResponse.push(req.body.userResponse)
            chat.botResponse.push(text)
            await chat.save()
        }
        else {
            const chat = new chatSchema({ pnr_no: user._id })
            chat.userResponse.push(req.body.userResponse)
            chat.botResponse.push(text)
            await chat.save()
        }
        res.redirect(`/YatriSakha/${req.params.pnr_no}`)
    }
    run();
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})