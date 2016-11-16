// ES6
'use strict';

// Modules
const Configstore = require('configstore');
const pkg = require('../package.json');
const conf = new Configstore(pkg.name);
const fs = require('fs');
const wallpaper = require('wallpaper');
const request = require('request');
const notie = require('notie');

// DOM Setup
var rootDiv = document.getElementById('root');
var cardsDiv = document.getElementById('cards');

// Alert
notie.alert('success', 'Simply select any picture to change your wallpaper', 4)

// Logic
function fetchAndDisplay(subreddit) {
  if (subreddit) {
    fetch(subreddit).then(function(response) {
      return response.json();
  }).then(function(json) {
    var newArray = [];
    for (var x = 0; x < json.data.children.length; x++) {
      if (json.data.children[x].is_self !== "true") {
        cardsDiv.innerHTML+='<a href="javascript:void(0)"><img id="'+x+'" class="card" src="'+/*json.data.children[x].data.url*/json.data.children[x].data.preview.images[0].source.url+'" width="375" height="250" onclick="setWallpaper(this);" /></a>';
        console.log(json.data.children[x].data.preview.images[0].source.url)
      }
    }
  }).catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  } else {
    console.log("No subreddit was entered...");
  }
}

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

var setWallpaper = function(image) {
  download(image.src, "wallpaper"+image.id+".jpg", function() {
    console.log("Image has been downloaded. URL: " + image.src);
    wallpaper.set('wallpaper'+image.id+'.jpg').then(() => {
      console.log('Wallpaper has been changed!');
    });
  })
};

// Listeners
var backgroundSwitch = false;
document.getElementById('switch-mode').addEventListener("click", function() {
  if (!backgroundSwitch) {
    document.getElementsByTagName('body')[0].style = "-webkit-app-region: drag; background: #E0E0E0;";
    backgroundSwitch = true;
  } else if (backgroundSwitch) {
    document.getElementsByTagName('body')[0].style = "-webkit-app-region: drag; background: #424242;";
    backgroundSwitch = false;
  }
});

document.getElementById('switch-to-top').addEventListener("click", function() {
  cardsDiv.innerHTML = "";
  fetchAndDisplay('https://www.reddit.com/r/earthporn/top.json');
  fetchAndDisplay('https://www.reddit.com/r/naturepics/top.json');
});

document.getElementById('switch-to-home').addEventListener("click", function() {
  cardsDiv.innerHTML = "";
  fetchAndDisplay('https://www.reddit.com/r/earthporn.json');
  fetchAndDisplay('https://www.reddit.com/r/naturepics.json');
});


(function() {
  fetchAndDisplay('https://www.reddit.com/r/earthporn.json');
  fetchAndDisplay('https://www.reddit.com/r/naturepics.json');
})();
