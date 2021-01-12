console.log('Client-side code running');

const button = document.getElementById('myButton');
button.addEventListener('click', function(e) {
  console.log('button was clicked');

  fetch('/clicked', {method: 'POST'})
  .then(function(response) {
    if(response.ok) return response.json();
    throw new Error('Request failed.');
  })
  .then(function(data) {
    document.getElementById('counter').innerHTML = data.title ;
  })
  .catch(function(error) {
    console.log(error);
  });
});




const playButton = document.getElementById('playButton');
playButton.addEventListener('click', function(e) {
  console.log('play button was clicked');

  fetch('/play', {method: 'GET'})
  .then(function(response) {
   console.log("song is playing")  
  })
  
  .catch(function(error) {
    console.log(error);
  });
});





