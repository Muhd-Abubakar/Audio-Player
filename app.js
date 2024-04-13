// Select the necessary DOM elements
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const songTitleElement = document.getElementById('song-title');
const artistElement = document.getElementById('song-artist');
const progressBar = document.getElementById('progress-bar');
const progressBarContainer = document.querySelector('.progress-container');
const searchInput = document.getElementById('search-input');

let currentSongIndex = 0;
let songs = null;
let currentSong = null;

// Function to fetch and play songs
async function playSongs() {
  try {
    const searchTerm = searchInput.value.split(' ').join('+');
    const apiUrl = `https://itunes.apple.com/search?term=${searchTerm}&entity=song`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      songs = data.results;
      playPauseSong(currentSongIndex);
    } else {
      console.log('No Results Found');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to play/pause the current song
function playPauseSong(index) {
  if (currentSong && !currentSong.paused) {
    // Pause the current song
    currentSong.pause();
    updatePlayPauseButton(false);
    return;
  }

  // Create or reuse the audio element
  if (!currentSong || currentSong.src !== songs[index].previewUrl) {
    currentSong = new Audio(songs[index].previewUrl);
    currentSong.addEventListener('ended', () => {
      // Play the next song automatically
      updateSong('next');
    });
  }

  // Play the song
  currentSong.play();
  currentSong.addEventListener('timeupdate', updateProgressBar);
  updatePlayPauseButton(true);
  updateSongInfo(songs[index].trackName, songs[index].artistName);
}

// Function to update the play/pause button
function updatePlayPauseButton(isPlaying) {
  if (isPlaying) {
    playButton.classList.remove('fa-play');
    playButton.classList.add('fa-pause');
    playButton.style.color = '#ffa500';
  } else {
    playButton.classList.remove('fa-pause');
    playButton.classList.add('fa-play');
    playButton.style.color = '#ff6b6b';
  }
}

// Function to update the song information
function updateSongInfo(trackName, artistName) {
  songTitleElement.textContent = trackName;
  artistElement.textContent = artistName;
  songTitleElement.style.display = 'block';
  artistElement.style.display = 'block';
}

// Function to update the progress bar
function updateProgressBar() {
  if (currentSong && currentSong.duration) {
    const currentTime = currentSong.currentTime;
    const duration = currentSong.duration;
    const progressPercentage = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercentage}%`;
  } else {
    progressBar.style.width = '0%';
  }
}

// Function to handle progress bar click
function handleProgressBarClick(event) {
  if (currentSong) {
    const progressBarRect = event.target.getBoundingClientRect();
    const clickX = event.clientX - progressBarRect.left;
    const totalWidth = progressBarRect.width;
    const progressPercentage = (clickX / totalWidth) * 100;
    const newTime = (progressPercentage / 100) * currentSong.duration;
    currentSong.currentTime = newTime;
    updateProgressBar();
  }
}

// Function to update the current song
function updateSong(action) {
  currentSong.currentTime = 0;
  if (action === 'next') {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
      currentSongIndex = 0;
    }
  } else {
    currentSongIndex--;
    if (currentSongIndex < 0) {
      currentSongIndex = songs.length - 1;
    }
  }

  console.log('Current song index:', currentSongIndex);
  playPauseSong(currentSongIndex);
}

// Event listeners
playButton.addEventListener('click', playSongs);
nextButton.addEventListener('click', () => updateSong('next'));
prevButton.addEventListener('click', () => updateSong('prev'));
progressBarContainer.addEventListener('click', handleProgressBarClick);