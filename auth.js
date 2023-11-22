const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');

function authenticate(credentialsPath, tokenPath, scopes, callback) {
  // Attempt to read credentials from the provided file
  let credentials;
  try {
    credentials = require(credentialsPath);
  } catch (err) {
    console.error('Error reading credentials file:', err);
    return callback(err);
  }

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored tokens
  fs.readFile(tokenPath, (err, token) => {
    if (err) {
      getAccessToken(oAuth2Client, scopes, callback);
    } else {
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(null, oAuth2Client);
    }
  });
}

function getAccessToken(oAuth2Client, scopes, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });

  console.log('Authorize this app by visiting this url:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);

      // Store the token to 'token.json' for later use
      fs.writeFile('token.json', JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to token.json');
      });

      oAuth2Client.setCredentials(token);
      callback(null, oAuth2Client);
    });
  });
}

module.exports = authenticate;
