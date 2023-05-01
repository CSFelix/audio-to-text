/*
	***************
	**	Elements **
	***************
*/
const micStatus = ['mic', 'settings_voice', 'mic_off'];
const recordButton = document.getElementById('recordButton');
const cleanTextButton = document.getElementById('cleanTextButton');

const extractedTextField = document.getElementById('extractedTextField');
const languageSelector = document.getElementById('languageSelector');
const copyExtractedText = document.getElementById('copyExtractedText');

let recognizingFlag = false;
let finalTranscript = '';
let recognition;



/*
	*********************
	** Event Listeners **
	*********************
*/

recordButton.addEventListener('click', () => {
	// if 'Speech Recognition API' is supported by the browser,
	// the audio permission is requested and, if granted, the audio
	// recognition and convertion processes are started.
	if ('webkitSpeechRecognition' in window) {

		// If audio is not being recognized, kick off recognizition
		if (!recognizingFlag) {
			recognizingFlag = true;

			recognition = new webkitSpeechRecognition();
			recognition.continuous = true;
			recognition.interimResults = false;
			recognition.lang = languageSelector.value;

			
			recognition.onresult = (event) => {
				for (let index = event.resultIndex; index < event.results.length; ++index) {
					if (event.results[index].isFinal) {
						finalTranscript += event.results[index][0].transcript;
					}
				}

				extractedTextField.innerHTML = finalTranscript;
			};

			
			recognition.start();
			recordButton.innerHTML = micStatus[1];
			recordButton.classList.add('recordButtonRecordingStatus');
		}

		// If audio is being recognized, stop recognizition
		else {
			recognizingFlag = false;
			recognition.stop();

			recordButton.innerHTML = micStatus[0];
			recordButton.classList.remove('recordButtonRecordingStatus');
		}
	}

	// if 'Speech Recognition API' is not supported by the browser,
	// a toast message is thrown
	else {
		VanillaToasts.create({
      		title: "Speech Recognition API Not Supported",
      		text: "Your browser does not support the Speech Recognition API. Please, try with other browser such as Google Chrome!",
      		type: "warning", // warning, error, info, success
      		icon: "./assets/logo.avif",
      		timeout: 3500
    	});

    	recordButton.innerHTML = micStatus[2];
	}
});

copyExtractedText.addEventListener('click', () => {

	// If there are no extracted text, a toast message is thrown
	if (extractedTextField.innerHTML === '') {
		VanillaToasts.create({
      		title: "No Extracted Text To Copy",
      		text: "There are no extracted text to copy. Try to record an audio before trying to copy a text!",
      		type: "warning", // warning, error, info, success
      		icon: "./assets/logo.avif",
      		timeout: 3500
    	});
	}

	// If the audio is still being recognized, a toast message
	// is thrown
	else if (recognizingFlag) {
		VanillaToasts.create({
      		title: "Audio Is Still Being Recognized",
      		text: "Stop the audio recognition before trying to copy the result text!",
      		type: "warning", // warning, error, info, success
      		icon: "./assets/logo.avif",
      		timeout: 3500
    	});
	}

	// If there are extracted text, the text is copied
	// to the client clipboard
	else {
		navigator.clipboard.writeText(extractedTextField.innerHTML);

		VanillaToasts.create({
      		title: "Copied Text",
      		text: "Copied text to the clipboard!",
      		type: "success", // warning, error, info, success
      		icon: "./assets/logo.avif",
      		timeout: 3500
    	});
	}
});

cleanTextButton.addEventListener('click', () => {
	finalTranscript = '';
	extractedTextField.innerHTML = finalTranscript;
})