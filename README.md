# AlexaIA
Some files are not uploaded (sensitive credentials)

# Prerequisites
Voiceflow credentials are required for the Amazon code to function correctly. Ensure you have the necessary credentials before proceeding.

# Code Structure
The primary codebase is located in the lambda folder, and the package.json file inside this folder contains all the dependencies and configurations needed for the Lambda function.

# Setting up Local Debugging
To enable local debugging in VSCode, use the ask-sdk-local-debug and Alexa extension. This allows you to make real-time changes and debug your code effectively.

Note: The provided sample skill has not undergone extensive testing with different credentials or Amazon accounts.

# Interaction Models
Inside the Skill-package-interactionModels/custom directory, you will find a JSON file containing the intents and slots that the skill will listen to. The information gathered through speech-to-text is delivered to the Voiceflow IA model.

# Skill Invocation and Inference Procedure
The standard procedure for skill invocation and inference involves the following steps:

Wake word: Trigger Alexa by saying "Alexa."
Launch: Start the skill by saying "Tell [Invocation Skill Name]."
Invocation Name: State what you would like to know.
Utterance and Slot Value: Include your specific query, such as "Where was the 9/11."
This process follows the pattern:

Search Fact Intent: Comprising steps 3 and 4.
Example:
"Alexa, tell [Invocation Skill Name] that I would like to know where was the 9/11."

In this example, steps 3 and 4 trigger the searchFact intent, delivering the desired information to the Voiceflow IA model.

Source of knowledge: 
https://developer.voiceflow.com/reference/overview
https://xavidop.me/alexa/2023-11-21-voiceflow-alexa/#dialog-manager-api
https://github.com/velrino/alexa-with-chatgpt/
https://www.youtube.com/@Voiceflow
https://www.youtube.com/watch?v=Z558j935SrI&t=86s&ab_channel=DevVoiceassistant
https://www.youtube.com/watch?v=om5yYcg1lT4&ab_channel=antaine
