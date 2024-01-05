const express = require("express");
const app = express();
const axios = require("axios");
app.use(express.json({ limit: "2MB" }));

// Route handler for webhook
app.post("/hook", (req, res) => {
  console.log("File sent to server.");
  let transcription = "";

  const transcript =
    req.body?.results?.channels?.[0]?.alternatives?.[0]?.transcript;

  if (transcript) {
    transcription = req.body;
    console.log("transcription", transcription);
    sendTranscriptionToZapier(transcription);
  } else {
    transcription = "No transcription available.";
    console.log("No transcription available.");
  }
});

// Function to send transcription data to Zapier
function sendTranscriptionToZapier(transcription) {
  console.log("Sending transcription data to Zapier");
  axios
    .post("WEBHOOK_URL_HERE", transcription)
    .then((response) => {
      console.log("Successfully sent transcription data to Zapier");
      console.log("Zapier response:", response.data);
    })
    .catch((error) => {
      console.error(
        "Error sending transcription data to Zapier:",
        error.message
      );
    });
}

// Start express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
