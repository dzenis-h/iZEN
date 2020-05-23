const song = document.querySelector(".song");
const play = document.querySelector(".play");
const replay = document.querySelector(".replay");
const outline = document.querySelector(".moving-outline circle");
const video = document.querySelector(".vid-container video");
//Sounds
const sounds = document.querySelectorAll(".sound-picker button");
//Time Display
const timeDisplay = document.querySelector(".time-display");
const outlineLength = outline.getTotalLength();
//Duration
const timeSelect = document.querySelectorAll(".time-select button");
let fakeDuration = 600;

outline.style.strokeDashoffset = outlineLength;
outline.style.strokeDasharray = outlineLength;
timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${Math.floor(
  fakeDuration % 60
)}`;

sounds.forEach((sound) => {
  sound.addEventListener("click", function () {
    song.src = this.getAttribute("data-sound");
    video.src = this.getAttribute("data-video");
    checkPlaying(song);
  });
});

play.addEventListener("click", function () {
  checkPlaying(song);
});

replay.addEventListener("click", function () {
  restartSong(song);
});

const restartSong = (song) => {
  song.currentTime = 0;
};

timeSelect.forEach((option) => {
  option.addEventListener("click", function () {
    fakeDuration = this.getAttribute("data-time");
    timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${Math.floor(
      fakeDuration % 60
    )}`;
  });
});

const checkPlaying = (song) => {
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise
      .then((_) => {
        if (song.paused) {
          song.play();
          video.play(); // <-- This is asynchronous!
          play.src = "./assets/svg/pause.svg";
        } else {
          playPromise.then((_) => {
            song.pause();
            video.pause();
            play.src = "./assets/svg/play.svg";
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

song.ontimeupdate = () => {
  let currentTime = song.currentTime;
  let elapsed = fakeDuration - currentTime;
  let seconds = Math.floor(elapsed % 60);
  let minutes = Math.floor(elapsed / 60);
  timeDisplay.textContent = `${minutes}:${seconds}`;
  let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
  outline.style.strokeDashoffset = progress;

  if (currentTime >= fakeDuration) {
    song.pause();
    song.currentTime = 0;
    play.src = "./assets/svg/play.svg";
    video.pause();
  }
};
