/*
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function startSpeechRecognition(callback) {
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            callback(transcript);
        };

        recognition.start();

        recognition.onspeechend = () => {
            recognition.stop();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error: ', event.error);
        };
    } else {
        console.error('Speech Recognition is not supported in this browser.');
    }
}


// Export the function to be used in app.js
//export { startSpeechRecognition };
*/
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function startSpeechRecognition(callback, options = {}) {
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = options.lang || 'en-US';
        recognition.interimResults = options.interimResults || false;
        recognition.maxAlternatives = options.maxAlternatives || 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            callback(transcript);
        };

        recognition.start();

        recognition.onspeechend = () => {
            recognition.stop();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error: ', event.error);
        };
    } else {
        console.error('Speech Recognition is not supported in this browser.');
    }
}

// Export the function to be used in app.js
export { startSpeechRecognition };