console.log('Client-side code running');

function snack() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}


async function fetchWithTimeout(resource, options) {
  const { timeout = 3000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);

  return response;
}

const seedButton = document.getElementById('seedButton');
seedButton.addEventListener('click', function(e) {
  console.log('seedbutton was clicked');
  fetch('/seed', {method: 'POST'})
  .then(function () {

    window.open('/', '_self');
  })
 
    });



  const playButton = document.getElementById('playButton');
  playButton.addEventListener('click', async function(e) {
    console.log('Playbutton was clicked');
    
    try {
      const response = await fetchWithTimeout('/play', {
        timeout: 500
      });
      const data = await response.json();
      window.open(data.url, '_blank');
      console.log(data.url)
      return games;


    } catch (error) {
      // Timeouts if the request takes
      // longer than 6 seconds
      if(error.name =='AbortError'){
        snack()
      }
      

    }

    });

