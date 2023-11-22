const express = require("express");
const app = express();
app.use(express.json());

const { google } = require('googleapis');
const fs = require('fs');
const authenticate = require('./auth');

// Your file-specific configurations
const credentialsPath = 'credentials.json';
const tokenPath = 'token.json';
const scopes = ['https://www.googleapis.com/auth/drive'];

// Route handler for webhook
app.post("/hook", (req, res) => {
  console.log("File sent to server.");
  console.log(req.body); // See the data

  // Authenticate and execute Google Drive API functions
  authenticate(credentialsPath, tokenPath, scopes, (err, oAuth2Client) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).send("Error authenticating");
    }

    const drive = google.drive({ version: 'v3', auth: oAuth2Client });

    // Specify the file ID of the file you want to share
    const fileId = req.body.fileId;

    if (!fileId) {
      console.error("File ID not found in the payload.");
      return res.status(400).send("File ID not found in the payload.");
    }

    // Set the permission type to 'anyone' and the role to 'reader' (adjust as needed)
    const permission = {
      type: 'anyone',
      role: 'reader',
    };

    // Create a shareable link
    drive.permissions.create({
      fileId: fileId,
      requestBody: permission,
      fields: 'id',
    })
      .then(response => {
        const link = `https://drive.google.com/uc?id=${fileId}`;
        console.log(`Shareable link: ${link}`);
        res.status(200).send(link); // Return empty response to Deepgram
      })
      .catch(error => {
        console.error(error.message);
        res.status(500).send("Error processing the file");
      });
  });
});

// Start express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
