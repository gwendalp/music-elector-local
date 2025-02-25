
let router = require('express').Router();

let Poll = require('./../models/poll');

var tools = require('./../seedTool')

const SpotifyWebApi = require('../src/server');


router.get('/', (req, res, next) => {
    Poll.find().exec((err, polls) => {
        res.render('index', { polls });
    });
});

 router.post('/:pollId/vote', (req, res, next) => {
    const choice = req.body.choice;
    const identifier = `choices.${choice}.votes`;
    Poll.update({_id: req.params.pollId}, {$inc: {[identifier]: 1}}, {}, (err, numberAffected) => {
        let Pusher = require('pusher');
        let pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.PUSHER_APP_KEY,
            secret: process.env.PUSHER_APP_SECRET,
            cluster: 'eu'
        });

        let payload = { pollId: req.params.pollId, choice: choice };
        pusher.trigger('poll-events', 'vote', payload, req.body.socketId);

        res.send('');
    });

}); 

let dbo;
// const MongoClient = require('mongodb').MongoClient;
const { seed } = require('./../seedTool');
const { response } = require('express');
// const url = 'mongodb://localhost:27017/';


/* // DATABASE  

MongoClient.connect(url, (err, database) => {
  if(err) {
    return console.log(err);
  }
  dbo = database.db("pollser");
  console.log("Connected to the database")
});
 */

const mongoose = require('mongoose')


const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: 30, // Retry up to 30 times
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
}
const connectWithRetry = () => {
  console.log('MongoDB connection with retry')
  mongoose.connect("mongodb://mongo:27017/pollser", options).then(()=>{
  //var connection = mongoose.connection;
  console.log('MongoDB is connected')
    
  }).catch(err=>{
    console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
    setTimeout(connectWithRetry, 5000)
  })
  }

connectWithRetry()


var callback = function(res)
  {
    var n = res[0].choices.length;
    var i;
    var dict = {};
    for (i = 0; i < n; i++)
    {
      key = res[0].choices[i].value;
      value = res[0].choices[i].votes;
      dict[key] = value;
    }
    var highestVal = Math.max.apply(null, Object.values(dict)),
    val = Object.keys(dict).find(function(a) {
      return dict[a] === highestVal;
    });
    return val; 
    //console.log(dict);
  }

  const spotifyApi = new SpotifyWebApi({
    clientId: 'a15f73a09ad54958bf7bc6c669dabecd',
    clientSecret: '4c1bd3aab43d46edbcd9345ed30fa99d',
    redirectUri: 'https://api-university.com/'
  });
  

router.post('/clicked', (req, res) => {
    


  dbo.collection('polls').find({topic: 'Which music should be played next?'}).toArray((err, result) => {
    if (err) return console.log(err);
    
    val = callback(result);

    res.send({title : val});
    console.log(val);


  });
  });
  

  async function processQuery(song, response)
  {
    try {

        const res = await querytest(song)
        console.log("The song you choose is " + song);
        var myquery = {topic: "Which music should be played next?" };
        var newvalues = { $push: {choices: {value: song, votes: 0}}};
        mongoose.connection.collection("polls").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        response.redirect('/');
        }); 

    } catch (err) {
      console.log(err)
      response.send("Please Provide the right song and band! Format is song-band !")
      
    }
  }

  router.get("/getsong", function (request, response){
    var song = request.query.song;

    if (song != "") {
        
        processQuery(song,response)
        }
     
     else {
        console.log("Please provide us a song");
    }
});






router.post('/seed', (req, res) => {
    console.log('server received the click');
    tools= require('./../seedTool');
    tools.seed();
    res.redirect('/')
  

    


  });


  router.get('/play', (req, res) => {

    mongoose.connection.collection('polls').find({topic: 'Which music should be played next?'}).toArray((err, result) => {
      if (err) return console.log(err);
      
      val = callback(result);
  
      
  
  
    });
  // test
  
  spotifyApi
  .clientCredentialsGrant()
  .then(function(data) {
    
    spotifyApi.setAccessToken(data.body['access_token']);
  
    // Use the access token to retrieve information about the user connected to it
    
    return spotifyApi.searchTracks(val);
  })
  .then(function(data) {
    // Print some information about the results
  
    // Go through the first page of results
    var firstPage = data.body.tracks.items;
    if (firstPage[0].preview_url != null)
      {res.send({url :firstPage[0].preview_url})}
      else{res.send({url:'https://open.spotify.com/embed/track/' + firstPage[0].id})}
    //res.redirect(firstPage[0].preview_url)
    
  }).catch(function(err) {
    console.log('Something went wrong:', err.message);
  });
  
  
  })


  
function querytest(song)
{
  return new Promise((resolve, reject) => {
  spotifyApi
  .clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    return spotifyApi.searchTracks(song);
  })
.then(function(data) {
  var firstPage = data.body.tracks.items;
  if(firstPage[0] == null)
  {
     reject('song not in the database')
  }
  else {resolve('song is in the database')}
})})

}

module.exports = router;
