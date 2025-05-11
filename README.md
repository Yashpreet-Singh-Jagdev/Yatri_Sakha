# Yatri Sakha

This project was developed for the **Smart India Hackathon 2024 Prelims** under problem statement **PS-1711**. The aim of the project was to
enhance the Rail Madad app by integrating an AI chatbot to filter complaints based on the sector they belong to such as healthcare, maintenance,
security, etc. and based on their priority level, such as Urgent, High Priority, or Low Priority.

This project was **ranked 2nd in the Hackathon**. It was built using **EJS & CSS** for the frontend, **Node.js and Express.js** for the backend, and **MongoDB** for data storage.

### Pre-requisites to run this project:

- Node.js

- MongoDB

### Steps to run the project:
  
1. Clone the codebase using the following command: `git clone https://github.com/Yashpreet-Singh-Jagdev/Yatri_Sakha.git`.

2. Open the folder in your terminal and install the required packages using: `npm install`.

3. Create a `.env` file in the root directory of the codebase and add the following keys: : 

```
GEMINI_API_KEY=  
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
PNR_API_KEY=
```

- Get your Google Gemini API key from: [GOOGLE AI STUDIO](https://aistudio.google.com/prompts/new_chat) 

- Get your Twilio API keys from: [TWILIO API](https://www.twilio.com/en-us)

- Get your PNR API key from:  [RAPID API](https://rapidapi.com/amiteshgupta/api/irctc-indian-railway-pnr-status/playground/apiendpoint_d04f49b2-77b3-4820-b689-d62472d60ad8)

4. Start the server by running: `node app.js`.
  
5. Open your browser and go to: `localhost:3000/YatriSakha`.

That’s it — the project should now be running! 😃
