'use strict';
let Alexa = require('alexa-sdk');
let firebase = require('firebase');
let config = require('./config');

let APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
let SKILL_NAME = 'Space Facts';

// Initialize Firebase
// let config = {
//   apiKey: "AIzaSyBYgd7-JPPqhAZT8udAC7BbcXqVXZ-nyJ8",
//   authDomain: "echo-smarts.firebaseapp.com",
//   databaseURL: "https://echo-smarts.firebaseio.com",
//   storageBucket: "echo-smarts.appspot.com",
//   messagingSenderId: "671614526969"
// };
// firebase.initializeApp(config);

firebase.initializeApp({
  serviceAccount: config,
  databaseURL: "https://echo-smarts.firebaseio.com"
});

let database = firebase.database();

/**
* Array containing space facts.
*/
let FACTS = [
  "A year on Mercury is just 88 days long.",
  "Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.",
  "Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid."
];

exports.handler = function(event, context, callback) {
  let alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

let handlers = {
  'LaunchRequest': function () {
    this.emit('GetFact');
  },
  'GetNewFactIntent': function () {
    this.emit('GetFact');
  },
  'GetFact': function () {
    // Get a random space fact from the space facts list
    let factIndex = Math.floor(Math.random() * FACTS.length);
    let randomFact = FACTS[factIndex];
    
    // Create speech output
    let speechOutput = "Here's your fact: " + randomFact;
    
    let today = new Date();
    let time = today.toLocaleString(); 
    
    database.ref('facts').push({
      fact: randomFact,
      timestamp: time
    }, () => {
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact)      
    });  
            
    // database.ref().push('hello there');
    
    // database.ref('facts').on('value', function(snapshot) {
    //   this.emit(':tellWithCard', 'snapshot.val().fact', SKILL_NAME, randomFact)      
    // });
    
    // let adaRef = firebase.database().ref('facts');
    // let path = adaRef.root.toString();
    // path is now 'https://sample-app.firebaseio.com'
    
    // setTimeout(function() {
    // this.emit(':tellWithCard', path, SKILL_NAME, randomFact)
    // this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact)      
    // }, 2000);
    
  },
  'AMAZON.HelpIntent': function () {
    let speechOutput = "You can say tell me a space fact, or, you can say exit... What can I help you with?";
    let reprompt = "What can I help you with?";
    this.emit(':ask', speechOutput, reprompt);
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', 'Goodbye!');
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', 'Goodbye!');
  }
};