/*
	***************
	**	Elements **
	***************
*/
const micStatus = ['mic', 'settings_value', 'mic_off'];
const recordButton = document.getElementById('recordButton');



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
		const recognition = new webkitSpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onresult = function(event) {
		  let interim_transcript = '';
		  let final_transcript = '';

		  for (let i = event.resultIndex; i < event.results.length; ++i) {
		    if (event.results[i].isFinal) {
		      final_transcript += event.results[i][0].transcript;
		    } else {
		      interim_transcript += event.results[i][0].transcript;
		    }
		  }
		  // final_transcript = capitalize(final_transcript);
		  // final_span.innerHTML = linebreak(final_transcript);
		  // interim_span.innerHTML = linebreak(interim_transcript);

		  console.log('Interim Transcript:', interim_transcript);
		  console.log('Final Transcript:', final_transcript);
		};

		recognition.start();
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
	}
});