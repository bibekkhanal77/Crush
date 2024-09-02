// Set the radius of the carousel (how far the images are from the center)
var radius = 240; 

// Enable or disable auto-rotation of the carousel
var autoRotate = true; 

// Speed of rotation (negative value for reverse direction), time in seconds for a full rotation
var rotateSpeed = -60; 

// Width and height of the images in the carousel
var imgWidth = 120; 
var imgHeight = 170; 

// Path to the background music file (replace with your local file path)
var bgMusicURL = 'imgs/perfect.mp3';

// Create a single Audio instance for the background music
var audio = new Audio(bgMusicURL);
audio.loop = false; // Disable automatic looping

// Function to start playing the music
function playMusic() {
    audio.currentTime = 0; // Start from the beginning
    audio.play().then(() => {
        console.log("Background music is playing.");
    }).catch(error => {
        console.log("Autoplay was prevented or an error occurred: ", error);
    });
}

// Event listener to replay the audio when it ends
audio.addEventListener('ended', function() {
    console.log("Background music ended. Restarting...");
    playMusic(); // Replay the music from the beginning
});

// Start playing the music when the page loads
document.addEventListener('DOMContentLoaded', (event) => {
    console.log("Page loaded. Attempting to play music.");
    playMusic();
});

// If autoplay is blocked, start playback on the first click
document.addEventListener('click', () => {
    if (audio.paused) {
        console.log("User interacted. Attempting to play music.");
        playMusic();
    }
});

// Whether or not to display music controls (set to false to hide controls)
var bgMusicControls = false; 

// Start the initialization process after a delay of 1000 milliseconds (1 second)
setTimeout(init, 1000);

var odrag = document.getElementById('drag-container'); // The container that handles dragging
var ospin = document.getElementById('spin-container'); // The container that handles spinning
var aImg = ospin.getElementsByTagName('img'); // Get all image elements inside the spin container
var aEle = [...aImg]; // Create an array of image elements

// Set the dimensions of the spin container based on the image size
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// Set the dimensions of the ground element based on the radius
var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

// Function to initialize the carousel
function init(delayTime) {
  // Loop through each element (image) in the carousel
  for (var i = 0; i < aEle.length; i++) {
    // Set the position of each image in the carousel using a rotation transformation
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    // Apply a transition effect with a delay
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

// Function to apply rotation based on the drag motion
function applyTranform(obj) {
  // Constrain the Y rotation angle between 0 and 180 degrees
  if(tY > 180) tY = 180;
  if(tY < 0) tY = 0;

  // Apply the rotation transformation based on calculated angles
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

// Function to control the spinning of the carousel
function playSpin(yes) {
  // Pause or resume the spin animation based on the input parameter
  ospin.style.animationPlayState = (yes ? 'running' : 'paused');
}

// Variables for tracking drag motion
var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 10;

// Start auto-rotation if enabled
if (autoRotate) {
  // Choose the appropriate animation based on the rotation speed
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  // Apply the spin animation to the spin container
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

// Event listener for pointer down (mouse or touch)
document.onpointerdown = function (e) {
  // Clear any existing timer
  clearInterval(odrag.timer);
  e = e || window.event;
  // Record the starting position of the pointer
  sX = e.clientX;
  sY = e.clientY;

  // Event listener for pointer movement
  this.onpointermove = function (e) {
    e = e || window.event;
    // Calculate the new position of the pointer
    nX = e.clientX;
    nY = e.clientY;
    // Calculate the change in position
    desX = nX - sX;
    desY = nY - sY;
    // Update the rotation angles based on the change in position
    tX += desX * 0.1;
    tY += desY * 0.1;
    // Apply the transformation to the drag container
    applyTranform(odrag);
    // Update the starting position for the next move event
    sX = nX;
    sY = nY;
  };

  // Event listener for pointer up (end of drag)
  this.onpointerup = function (e) {
    // Start a timer to gradually slow down the spinning
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      // Stop the timer when the movement is minimal
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    // Remove the event listeners for move and up
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

// Event listener for mouse wheel (zoom in/out)
document.onmousewheel = function(e) {
  e = e || window.event;
  // Adjust the radius based on the wheel movement
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  // Reinitialize the carousel with the new radius
  init(1);
};

