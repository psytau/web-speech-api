var synth = window.speechSynthesis;

var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('.txt');
var voiceSelect = document.querySelector('select');
var langSelect = document.querySelector('.lang-select');

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');
var speakButton = document.querySelector('.speak-button');

var voices = [];
var languages = ['en-US', 'zh-TW', 'ko-KR'];

function populateVoiceList() {
  voices = synth.getVoices();

  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

function populateLangList() {

  for(i = 0; i < languages.length ; i++) {
    var option = document.createElement('option');
    option.textContent = languages[i];

    option.setAttribute('data-lang', languages[i]);
    langSelect.appendChild(option);
  }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = function (){
    populateVoiceList();
    if(voices.length > 0){
      langSelect.parentNode.removeChild(langSelect);
    }
  };
}

if(voices.length < 1) {
  populateLangList();
}

inputForm.onsubmit = function(event) {
  event.preventDefault();

  var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
  var selectedOption;
  if(voices.length > 0){
    if(voiceSelect.selectedOptions.length > 0){
      selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    }
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
      }
    }
  }
  else {
    selectedOption = langSelect.selectedOptions[0].getAttribute('data-lang');
    utterThis.lang = selectedOption;
  }
  utterThis.pitch = pitch.value;
  utterThis.rate = rate.value;
  synth.speak(utterThis);

  utterThis.onpause = function(event) {
    var char = event.utterance.text.charAt(event.charIndex);
    console.log('Speech paused at character ' + event.charIndex + ' of "' +
    event.utterance.text + '", which is "' + char + '".');
  }

  inputTxt.blur();
}

pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
}

rate.onchange = function() {
  rateValue.textContent = rate.value;
}
