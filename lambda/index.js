const Alexa = require("ask-sdk-core");
const axios = require("axios");
require("dotenv").config();

const LaunchRequestHandler = {
  async canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  async handle(handlerInput) {
    const chatID = handlerInput.requestEnvelope.session.user.userId;
    let iaWelcoming = async () => {
      const apiUrl = `https://general-runtime.voiceflow.com/state/user/${chatID}/interact`;
      const authToken = process.env.AUTH_TOKEN;
      const rawData = `{
      "action": {
        "type": "text",
        "payload": "hi there"
      },
      "config": {
        "tts": false,
        "stripSSML": true,
        "stopAll": true,
        "excludeTypes": [
          "block",
          "debug",
          "flow"
        ]
      },
      "state": {
        "variables": {
          "x_var": "hello"
        }
      }
    }`;
      return await axios.post(apiUrl, rawData, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    };
    await iaWelcoming();
    const speakOutput = "hola gordos, que onda!?";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "HelloWorldIntent"
    );
  },
  async handle(handlerInput) {
    const slotValue =
      handlerInput.requestEnvelope.request.intent.slots.pregunta.value;
    const chatID = handlerInput.requestEnvelope.session.user.userId;
    const authToken = process.env.AUTH_TOKEN;
    let iaCall = async () => {
      const apiUrl = `https://general-runtime.voiceflow.com/state/user/${chatID}/interact`;
      const rawData = `{
        "action": {
          "type": "text",
          "payload": "${slotValue}"
        },
        "config": {
          "tts": false,
          "stripSSML": true,
          "stopAll": true,
          "excludeTypes": [
            "block",
            "debug",
            "flow"
          ]
        },
        "state": {
          "variables": {
            "x_var": "hello"
          }
        }
      }`;
      return await axios.post(apiUrl, rawData, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    };
    let iaRes = await iaCall();
    let msgResponse;

    if (iaRes?.data) {
      iaRes.data.map((msg) => {
        if (msg.type === "text") {
          // for now this works
          msgResponse = msg.payload.message;
          return;
        }
      });
      axios.delete(
        `https://general-runtime.voiceflow.com/state/user/${chatID}`,
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
    }
    return handlerInput.responseBuilder.speak(msgResponse).getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = "You can say hello to me! How can I help?";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speakOutput = "Goodbye!";

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = "Sorry, I don't know about that. Please try again.";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "SessionEndedRequest"
    );
  },
  handle(handlerInput) {
    console.log(
      `~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`
    );
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
  },
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents
 * by defining them above, then also adding them to the request handler chain below
 * */
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
    );
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    return (
      handlerInput.responseBuilder
        .speak(speakOutput)
        //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse()
    );
  },
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.error(error, handlerInput, "ASFJBKASFBHJKASFBKJHAFS");
    const speakOutput =
      "Sorry, I had trouble doing what you asked. Please try again.";
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent("sample/hello-world/v1.2")
  .lambda();
