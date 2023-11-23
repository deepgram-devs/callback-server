const express = require("express");
const app = express();
app.use(express.json());

let transcription = "";

// Route handler for webhook
app.post("/hook", (req, res) => {
  console.log("File sent to server.");
  console.log("req.body", req.body);
  console.log("req.body.results", req.body.results);
  if (
    req.body &&
    req.body.results &&
    req.body.results.channels &&
    req.body.results.channels[0].alternatives
  ) {
    transcription += req.body.results.channels[0].alternatives[0].transcript;
    console.log(transcription);
  }

  res.send(req.body);
});

app.get("/transcription", (req, res) => {
  console.log("getting transcription", transcription);
  res.json(transcription);
  transcription = "";
});

// Start express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
