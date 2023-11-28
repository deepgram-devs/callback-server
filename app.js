const express = require("express");
const app = express();
app.use(express.json());

let transcription = "";

// Route handler for webhook
app.post("/hook", (req, res) => {
  console.log("File sent to server.");
  console.log(req.body);
  transcription = "";

  if (
    req.body.results &&
    req.body.results.channels &&
    req.body.results.channels[0] &&
    req.body.results.channels[0].alternatives &&
    req.body.results.channels[0].alternatives[0] &&
    req.body.results.channels[0].alternatives[0].transcript
  ) {
    transcription = req.body.results.channels[0].alternatives[0].transcript;
    console.log("transcription", transcription);
  } else {
    transcription = "No transcription available.";
    console.log("No transcription available.");
  }
});

app.get("/transcription", (req, res) => {
  console.log("getting transcription", transcription);
  if (transcription.length > 0) {
    res.json(transcription);
    transcription = "";
  } else {
    res.json("No transcription available.");
  }
});

// Start express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
