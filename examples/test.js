const express = require('express')
const app = express()
const port = 3000

const SpotifyWebApi = require('../src/server');



const spotifyApi = new SpotifyWebApi({
    clientId: 'a15f73a09ad54958bf7bc6c669dabecd',
    clientSecret: '4c1bd3aab43d46edbcd9345ed30fa99d',
    redirectUri: 'https://api-university.com/'
  });
  
  

app.get('/play', (req, res) => {



    spotifyApi
  .clientCredentialsGrant()
  .then(function(data) {
    
    spotifyApi.setAccessToken(data.body['access_token']);

    // Use the access token to retrieve information about the user connected to it
    return spotifyApi.searchTracks('Côte Ouest');
  })
  .then(function(data) {
    // Print some information about the results

    // Go through the first page of results
    var firstPage = data.body.tracks.items;

    res.redirect(firstPage[0].preview_url)
    
  }).catch(function(err) {
    console.log('Something went wrong:', err.message);
  });


})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})