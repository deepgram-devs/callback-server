// Require, initialize, and configure Express
const express = require("express");
const app = express();
app.use(express.json());

// This is the route handler our webhook will POST data to
app.post("/hook", (req, res) => {
    /*
        You could do anything here, such as:
        - Add data to a database
        - Trigger an email or SMS
        - Automatically schedule an event on your application's UI
    */

    console.log(req.body); // See the data
    res.status(200).end(); // Return empty response to Deepgram
});

// Start express server
app.listen(3000, () => {
    console.log("Webhook server is running on port 3000");
});
