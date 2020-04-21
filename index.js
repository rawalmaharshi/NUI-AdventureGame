// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
"use strict";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");
const { dialogflow, MediaObject, Image } = require("actions-on-google");
const app = dialogflow();
let boxOpen = false;
let gameStatus = "start";
let numberOfAttempts = 3;
let question1Attempts = 0;
let question2Attempts = 0;
let question3Attempts = 0;
let arr = [2, 3];
let gameOverFrom = 0;
let currentDirection = 1;

let thingsWeHave = {
  crowbar: false,
  wood: false,
  rope: false,
  axe: false,
  banana: false
};

function resetGameState() {
  gameStatus = "start";
  currentDirection = 1;
  question1Attempts = 0;
  question2Attempts = 0;
  question3Attempts = 0;
  numberOfAttempts = 3;
  arr = [2, 3];
  thingsWeHave.crowbar = false;
  thingsWeHave.wood = false;
  thingsWeHave.rope = false;
  thingsWeHave.axe = false;
  thingsWeHave.banana = false;
  boxOpen = false;
}

process.env.DEBUG = "dialogflow:debug";

app.intent("Default Welcome Intent", conv => {
  resetGameState();
  const ssml =
    `<speak>
    <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/WelcomeIntent.mp3?alt=media&amp;token=3c874054-31ba-4e68-b53c-3f66cd23f5cb" clipBegin="0s" clipEnd="5s">
    Welcome!!</audio> Hey, hi there! What is your name ?
    </speak>`;
  conv.ask(ssml);

});

app.intent("rollDie", conv => {
  console.log("IN the webhook" + JSON.stringify(conv));
  let number = arr[Math.floor(Math.random() * arr.length)];
  arr = arr.filter(item => item != number);

  number = 2;
  if (number === 3) {
    conv.followup("StartBeach");
  }

  if (number === 2) {
    conv.followup("startEscapeRoom");
  }
});

app.intent("islandNorth", conv => {
  currentDirection = 3;
  const ssml =
    "<speak>" +
    '<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/running_on_sand-%5BAudioTrimmer.com%5D.mp3?alt=media&amp;token=e5897db9-5527-4c41-8033-dc02521ab58f">running on sand</audio>' +
    "</speak>";
  conv.ask(ssml);

  if (boxOpen) {
    const ssml =
      "<speak>" +
      `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui6.mp3?alt=media&amp;token=7c635236-2a03-490a-8808-17e8f37fadb3">There is nothing but only the empty box. 
    Which direction should we go now?</audio>` +
      "</speak>";
    conv.ask(ssml);

  } else {
    const ssml =
      "<speak>" +
      `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui7.mp3?alt=media&amp;token=74c46c34-b59c-4c51-b599-c6e4900ccf88">Look there is a wooden box here. What should we do?</audio>` +
      "</speak>";
    conv.ask(ssml);
  }
});


app.intent("islandNorthOpenBox", conv => {
  if (thingsWeHave.crowbar) {
    boxOpen = true;
    thingsWeHave.axe = true;
    const ssml =
      "<speak>" +
      `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/wooden-box.mp3?alt=media&amp;token=5f0f1ef0-8b60-4593-92b0-ff2de8ea351f">foot steps on sand</audio>` +
      `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui8.mp3?alt=media&amp;token=13345792-492f-47ec-8533-47fffeb88748">Look. There is an axe inside. I'll pick it up. Where should we go now?</audio>` +
      "</speak>";
    conv.ask(ssml);
  } else {
    const ssml = `<speak>` +
      `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui9.mp3?alt=media&amp;token=fc51765b-84d2-420b-afb2-e511d43801cd">Ohh, it seems the box is not opening. 
     Maybe we should explore some other way. Which direction should we go to now?</audio>` +
      `</speak>`;
    conv.ask(ssml);
  }

  console.log("IN the islandNorthOpenBox webhook" + JSON.stringify(conv));
});


app.intent("islandEast", conv => {
  currentDirection = 2;
  const ssml =
    "<speak>" +
    '<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/running_on_sand-%5BAudioTrimmer.com%5D.mp3?alt=media&amp;token=e5897db9-5527-4c41-8033-dc02521ab58f">foot steps on sand</audio>' +
    "</speak>";
  conv.ask(ssml);

  if (!thingsWeHave.rope) {
    const ssml2 =
      "<speak>" +
      `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/moneky2.mp3?alt=media&amp;token=b4aa024c-e4b7-412e-894c-12559d7fc47e">monkey screaming</audio>` +
      `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui10.mp3?alt=media&amp;token=db6debfa-483e-4229-8e35-301833d30bf5">Oh there is nothing here apart from the monkey on the tree.  What should we do, Should we do something or go in some other direction?</audio>` +
      "</speak>";
    conv.ask(ssml2);
  } else {
    const ssml2 =
      "<speak>" +
      `<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/moneky2.mp3?alt=media&amp;token=b4aa024c-e4b7-412e-894c-12559d7fc47e">monkey screaming</audio>` +
      `<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui10b.mp3?alt=media&amp;token=a270ef6f-fbc8-4251-89ac-3d3b3476274c">Oh there is nothing here apart from the monkey on the tree.</audio>` +
      `<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui11.mp3?alt=media&amp;token=13c3afce-8766-4a04-a484-8c03734afdba">The monkey gave us the rope, there's nothing here to find, maybe we should explore other directions and scavange other things</audio>` +
      "</speak>";
    conv.ask(ssml2);
  }
});

app.intent("islandEast-pickUpCrowBar", conv => {
  thingsWeHave.crowbar = true;
  const ssml =
    "<speak>" +
    `<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/picking_crowbar.mp3?alt=media&amp;token=fc77180b-4175-46ab-90bf-524b2e8ee427">picking up crowbar </audio> ` +
    `<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui12.mp3?alt=media&amp;token=d8a59830-f480-4481-8670-09199d44611b">Here,  I got the crowbar, lets explore some other direction. Which direction should we go now?</audio> ` +
    "</speak>";
  conv.ask(ssml);

  console.log("IN the islandEast-pickUpCrowBar webhook" + JSON.stringify(conv));
});

app.intent("islandEast-Givebanana", conv => {
  if (thingsWeHave.banana) {
    thingsWeHave.rope = true;
    const ssml =
      "<speak>" +
      `<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/moneky2.mp3?alt=media&amp;token=b4aa024c-e4b7-412e-894c-12559d7fc47e">monkey screaming</audio> ` +
      `<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui13.mp3?alt=media&amp;token=2cfae69e-b875-46f9-8f67-1929e2654fe8">Hey, look what the monkey gave us, a rope, I bet this will come in handy on the boat, What should we do now?  Go back to the boat?</audio>` +
      "</speak>";
    conv.ask(ssml);
  } else {
    const ssml =
      "<speak>" +
      `<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/moneky2.mp3?alt=media&amp;token=b4aa024c-e4b7-412e-894c-12559d7fc47e">monkey screaming </audio> ` +
      `<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui14.mp3?alt=media&amp;token=17f10c3b-5267-485b-bb0a-252967ee22ba">But we dont have anything to offer the monkey with, What should we do? </audio> ` +
      "</speak>";
    conv.ask(ssml);
  }
  console.log("IN the islandEast-Givebanana webhook" + JSON.stringify(conv));
});



app.intent("islandWest", conv => {
  currentDirection = 4;
  if (thingsWeHave.crowbar) {

    const ssml =
      "<speak>" +
      `<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/running_on_sand-%5BAudioTrimmer.com%5D.mp3?alt=media&amp;token=e5897db9-5527-4c41-8033-dc02521ab58f">steps sound</audio>` +
      `<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui15.mp3?alt=media&amp;token=2b32e719-c18a-4e66-b982-a6a5ca9fd8f4">we just picked the crowbar from this spot, there is nothing here apart from the banana tree, what should we do?</audio>` +
      "</speak>";
    conv.ask(ssml);
  } else {
    const ssml =
      "<speak>" +
      `<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/running_on_sand-%5BAudioTrimmer.com%5D.mp3?alt=media&amp;token=e5897db9-5527-4c41-8033-dc02521ab58f">steps sound</audio>` +
      `<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui16.mp3?alt=media&amp;token=6db37fd2-dd3e-4456-af72-ec89d934c96a">Look, here is a crowbar lying under the banana tree I wonder if we can do something with this? Or should we go somewhere else?</audio>` +
      "</speak>";
    conv.ask(ssml);
  }

  console.log("IN the islandEast-pickUpCrowBar webhook" + JSON.stringify(conv));
});


app.intent("islandWest-shakeTree", conv => {
  thingsWeHave.banana = true;
  const ssml =
    "<speak>" +
    `<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/shaking_tree.mp3?alt=media&amp;token=9e2099b7-910a-4e67-a825-69cc44801848">shaking the tree </audio>` +
    `<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui17.mp3?alt=media&amp;token=97ceda14-d8e8-49b3-8452-1e619d064657">I got the banana, what should we do with this now ?</audio>` +
    "</speak>";
  conv.ask(ssml);

  console.log("IN the islandEast-pickUpCrowBar webhook" + JSON.stringify(conv));
});

app.intent("islandWest-cutTree", conv => {
  if (thingsWeHave.axe) {
    thingsWeHave.wood = true;
    const ssml =
      `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/tree-cutting.mp3?alt=media&amp;token=b7d8e46a-9086-4f96-9640-c3143df27e23">cutting the tree</audio>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/tree-falling-on-ground.mp3?alt=media&amp;token=06b269cb-5cde-4818-845f-12fe457773a8">tree fell down</audio> 
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui18.mp3?alt=media&amp;token=99ef592f-3138-4804-9b1b-e5deb21b6aa3">Good job cutting the tree down, this wood will come in handy to fix the holes in the boat.
     Where do we head next?</audio> 
       </speak>`;
    conv.ask(ssml);
  } else {
    const ssml =
      `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui19.mp3?alt=media&amp;token=5c6f4cf4-dc85-4a09-a569-80b64e7f7c7c">
     But we have nothing to cut the tree with, maybe we should find that first?</audio> 
       </speak>`;
    conv.ask(ssml);
  }


  console.log("IN the islandEast-pickUpCrowBar webhook" + JSON.stringify(conv));
});

app.intent('atBoat', (conv) => {
  currentDirection = 1;
  if (thingsWeHave.wood && thingsWeHave.rope && thingsWeHave.axe) {
    gameStatus = 'startIsland';
    conv.followup('shouldWePlayEvent');
  } else {
    const ssml =
      `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui20.mp3?alt=media&amp;token=6d5d9ea4-f2cb-4d59-8f19-17bc7047b13c">
     We  need some things to fix the boat. Lets explore the island and salvage some things. Which direction should we go?</audio> 
       </speak>`;
    conv.ask(ssml);
  }
});

app.intent('shouldWePlay', (conv) => {
  // if (arr.length === 0) {
  //   conv.followup('gameOverIntent');
  // }

  if (gameStatus === 'start') {
    const ssml =
      `<speak>I'll just assume you said Lola. Okay, <break time="0.1" /><break time="0.4" />Look what I found. It's a board game. Should we play? </speak>`;
    conv.ask(ssml);
  } else if (gameStatus === 'startIsland') {
    const ssml =
      `<speak>Hey, congratulations you have everything to fix the boat. Lets leave. Should we roll the die again?</speak>`;
    conv.ask(ssml);
  } else if (gameStatus === 'startEscapeRoom') {
    const ssml =
      `<speak>
          <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/contra.mp3?alt=media&amp;token=9526f7a2-8ce4-4772-ad46-62cba0971474" >Mario</audio>
         Hey, congratulations you were able to survive the room of doom. Should we roll the die again?</speak>`;
    conv.ask(ssml);
  }
});

app.intent('islandNorth - fallback', (conv) => {

  if (!boxOpen) {
    // If 'fallbackCount' doesn't exist, create it and set the value to 0.
    if (!conv.data.fallbackCount) {
      conv.data.fallbackCount = 0;
    }
    // Increment the value of 'fallbackCount'.
    conv.data.fallbackCount++;
    // Adjust the fallback response according to the error count.
    if (conv.data.fallbackCount === 1) {
      const ssml =
        `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui21.mp3?alt=media&amp;token=853099a6-d75c-4d05-a767-a982058d6b65">
     Sorry, I am not sure this is working, What should we do with this box, or do you want to explore some other direction?</audio> 
       </speak>`;
      return conv.ask(ssml);
    } else if (conv.data.fallbackCount === 2) {
      const ssml =
        `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui22.mp3?alt=media&amp;token=7f9d3520-0a8d-46b8-9d02-cb7f3fdc1af3">
     Sorry, I didn't get it. What do you wanna do?</audio> 
       </speak>`;
      return conv.ask(ssml);
    } else if (conv.data.fallbackCount === 3) {
      // If 'fallbackCount' is greater than 2, send out the final message and terminate the conversation.
      const ssml =
        `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui23.mp3?alt=media&amp;token=73391125-0c8c-47e4-8be8-e9454b90a3f1">
     Sorry, I didn't get it. maybe we should try and go back to the boat</audio> 
       </speak>`;
      return conv.ask(ssml);
    } else {
      const ssml =
        `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui24.mp3?alt=media&amp;token=c747190d-9657-4dbf-a9b3-58b584827880">
     This seems to be beyond our expertise. It seems it is game over</audio> 
       </speak>`;
      return conv.close(ssml);
    }
  } else {
    const ssml =
      `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui25.mp3?alt=media&amp;token=acc8c623-fefe-4730-bf55-de0fea762b37">
     There is nothing but only the empty box. 
  Which direction should we go now?</audio> 
       </speak>`;
    return conv.ask(ssml);
  }

});

app.intent('islandNorthOpenBox - fallback', (conv) => {
  const ssml =
    `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui26.mp3?alt=media&amp;token=39b98e38-d4c7-48e9-9b63-bbceac324d73">
     You already opened the box. Which direction should we go now?</audio> 
       </speak>`;
  return conv.ask(ssml);
});

app.intent('islandWest - fallback', (conv) => {
  if (!thingsWeHave.crowbar) {
    const ssml =
      `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui27.mp3?alt=media&amp;token=9203ee68-7991-46d8-9a27-56fd8ee38573">
     Hint: the crowbar might be useful</audio> 
       </speak>`;
    return conv.ask(ssml);
  }

  if (!thingsWeHave.banana) {
    const ssml =
      `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui28.mp3?alt=media&amp;token=a238d097-3c57-43fc-a7e6-1d4575d76227">
     Hint: You might want to shake things up!</audio> 
       </speak>`;
    return conv.ask(ssml);
  }

  if (thingsWeHave.axe) {
    const ssml =
      `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui45.mp3?alt=media&amp;token=98193597-0b2b-48e6-898a-46adae7303e4">
     Hint: You might need some wood to repair the boat. Want to use your axe?</audio> 
       </speak>`;
    return conv.ask(ssml);
  }

  const ssml =
    `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui29.mp3?alt=media&amp;token=22bad442-02a6-42ca-9396-d262ebb6694f">
     I am sorry! I cannot help you. Which direction do you want to go?</audio> 
       </speak>`;
  return conv.ask(ssml);
});

app.intent('islandEast-pickUpCrowBar - fallback', (conv) => {

  if (!thingsWeHave.banana) {
    const ssml =
      `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui28.mp3?alt=media&amp;token=a238d097-3c57-43fc-a7e6-1d4575d76227">
     Hint: You might want to shake things up!</audio> 
       </speak>`;
    return conv.ask(ssml);
  }

  const ssml =
    `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui45.mp3?alt=media&amp;token=98193597-0b2b-48e6-898a-46adae7303e4">
     Hint: You might need some wood to repair the boat. Want to use your axe?</audio> 
       </speak>`;
  return conv.ask(ssml);
});

app.intent('islandWest-shakeTree - fallback', (conv) => {

  if (!thingsWeHave.crowbar) {
    const ssml =
      `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui27.mp3?alt=media&amp;token=9203ee68-7991-46d8-9a27-56fd8ee38573">
     Hint: the crowbar might be useful</audio> 
       </speak>`;
    return conv.ask(ssml);
  }

  if (thingsWeHave.axe) {
    const ssml =
      `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui45.mp3?alt=media&amp;token=98193597-0b2b-48e6-898a-46adae7303e4">
     Hint: You might need some wood to repair the boat. Want to use your axe?</audio> 
       </speak>`;
    return conv.ask(ssml);
  }

  const ssml =
    `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui29.mp3?alt=media&amp;token=22bad442-02a6-42ca-9396-d262ebb6694f">
     I am sorry! I cannot help you. Which direction do you want to go?</audio> 
       </speak>`;
  return conv.ask(ssml);
});

app.intent('islandWest-cutTree - fallback', (conv) => {

  if (!thingsWeHave.banana) {
    const ssml =
      `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui28.mp3?alt=media&amp;token=a238d097-3c57-43fc-a7e6-1d4575d76227">
     Hint: You might want to shake things up!</audio> 
       </speak>`;
    return conv.ask(ssml);
  }
  const ssml =
    `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui29.mp3?alt=media&amp;token=22bad442-02a6-42ca-9396-d262ebb6694f">
     I cannot help you. You should look elsewhere. Which direction do you want to go?</audio> 
       </speak>`;
  return conv.ask(ssml);
});

app.intent('islandEast - fallback', (conv) => {
  if (!thingsWeHave.banana) {
    const ssml =
      `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui30.mp3?alt=media&amp;token=fb9c0baa-f73d-4e0d-a6af-19118de4ee00">
     Hint: You might need something for the monkey</audio> 
       </speak>`;
    return conv.ask(ssml);
  } else {
    const ssml =
      `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui31.mp3?alt=media&amp;token=12e25439-869a-4f8e-835d-5484bfb988d2">
     Hint: You might want to trade stuffs with monkey</audio> 
       </speak>`;
    return conv.ask(ssml);
  }
});

app.intent('islandEast-Givebanana - fallback', (conv) => {
  if (thingsWeHave.rope) {
    const ssml =
      `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui29.mp3?alt=media&amp;token=22bad442-02a6-42ca-9396-d262ebb6694f">
     I cannot help you. You should look elsewhere. Which direction do you want to go?</audio> 
       </speak>`;
    return conv.ask(ssml);
  }
});

app.intent('whatDoWehave', (conv) => {
  var result = ``;

  if (!thingsWeHave.axe && !thingsWeHave.banana && !thingsWeHave.crowbar && !thingsWeHave.rope && !thingsWeHave.wood) {
    result = result + `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui33.mp3?alt=media&amp;token=c1cd25b9-ae22-43b3-b6d7-495cf58c7f92">
    We currently do not have anything with us</audio>` ;
  } else {
    result = result + `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui34.mp3?alt=media&amp;token=328d5886-c711-437b-804c-8236f017f6e6">
    We currently have</audio>` ;
    if (thingsWeHave.axe) {
      result = result + `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui35.mp3?alt=media&amp;token=30fbf6c8-0a93-4a24-904d-b9e3ff893d52">
    an axe, </audio>` ;
    }
    if (thingsWeHave.rope) {
      result = result + `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui36mp3.mp3?alt=media&amp;token=fe131fa4-cc6f-4c04-9a4b-88ad460535fe">
      a rope, </audio>` ;
    }
    if (thingsWeHave.banana) {
      result = result + `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui37.mp3?alt=media&amp;token=7b057900-70fa-4709-bade-97263fec9adc">
      some bananas, </audio>` ;
    }
    if (thingsWeHave.crowbar) {
      result = result + `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui38.mp3?alt=media&amp;token=90bbfdeb-f5cc-4b72-8d2b-ce6838ba17e6">
      a crowbar, </audio>` ;
    }
    if (thingsWeHave.wood) {
      result = result + `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui39.mp3?alt=media&amp;token=d406bb0e-f410-44f7-8a07-5503740c49bc">
      some wooden logs, </audio>` ;
    }
  }
  const ssml = `<speak>` + result + `</speak>`;
  conv.ask(ssml);
});

app.intent('whereAmIIsland', (conv) => {
  switch (currentDirection) {
    case 1:
      const ssml1 =
        `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui40.mp3?alt=media&amp;token=c89de4ed-d980-4291-b306-bbe435690bf5">
     We are currently next to the boat which we found at the southern tip of the island</audio> 
       </speak>`;
      conv.ask(ssml1);
      break;
    case 2:
      const ssml2 =
        `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui41.mp3?alt=media&amp;token=24dca861-42c3-4bab-ad73-016a0fa7ab65">
     We are currently in the eastern end of the island, We found the monkey here</audio> 
       </speak>`;
      conv.ask(ssml2);
      break;
    case 3:
      const ssml3 =
        `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui42.mp3?alt=media&amp;token=f56507fd-9205-4794-ab43-097a2189fe18">
     We are the northern side of the island where we found the wooden box</audio> 
       </speak>`;
      conv.ask(ssml3);
      break;
    case 4:
      const ssml4 =
        `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui43.mp3?alt=media&amp;token=d8d8b20e-867e-420d-9b16-1cc57a7fea89">
     We are currently on the western side of the island where we found the banana trees</audio> 
       </speak>`;
      conv.ask(ssml4);
      break;
    default:
      const ssml5 =
        `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui44.mp3?alt=media&amp;token=dc615a54-6073-4502-bc67-d2603a137664">
     Seems like we are lost on this island, We should choose a direction and explore it. Where should we go?</audio> 
       </speak>`;
      conv.ask(ssml5);
  }
});




app.intent("startEscapeRoom", (conv, agent) => {

  if (question1Attempts === 0) {
    question1Attempts++;
    const ssml =
      `<speak>
   <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/dice-roll.mp3?alt=media&amp;token=1a135d26-01d3-489a-944d-095e07cce7cf">Die rolls</audio>
   You have rolled a 2.  
   <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/warpSound.mp3?alt=media&amp;token=1a5c3061-4b69-4a7f-a6ba-c9ab67c8ef06">Space Warp sound</audio> 
   <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/movingWall1%20(mp3cut.net).mp3?alt=media&amp;token=bba62f22-a0b3-48f2-9bd4-25a16ca035a4">Moving Walls</audio>
   <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui46.mp3?alt=media&amp;token=8678a7cb-6878-4a73-821c-1ba49fe6aa0d">
   Looks like we are stuck in this room of doom.  
   See, what's written on the screen.  
   To get out of this room, you have 3 lives. 
   With every wrong attempt, the walls will move closer. 
   This sounds scary, we should get out of here quick. 
   </audio>
   <break time="0.3" /> 
   <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui47.mp3?alt=media&amp;token=81056a6a-d5af-4cec-a0db-cff0f1929ce0">
   Here comes the first one: </audio> 
   <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/quiz1.mp3?alt=media&amp;token=755eec63-b08e-4d33-b558-0fd57aa89003">
   The one who built it, sold it 
   The one who bought it, never used it
   And the one who used it never saw it. What is it?
   </audio> 
     </speak>`;
    conv.ask(ssml);
  } else {
    numberOfAttempts--;
    question1Attempts++;
    if (question1Attempts === 2) {
      const ssml = `
      <speak>
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/movingWall1%20(mp3cut.net).mp3?alt=media&amp;token=bba62f22-a0b3-48f2-9bd4-25a16ca035a4">Moving Walls</audio>
      <break time="0.2" />
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui48.mp3?alt=media&amp;token=8bab9924-c0d9-45cb-92df-8faef556a2df">Wrong Answer!</audio>
      <break time="0.1" />
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui49.mp3?alt=media&amp;token=f3d6cb8c-d503-4b87-86a1-ade4a24f68cc">Hint: It rhymes with coffee.</audio>
      </speak>
      `;
      conv.ask(ssml);
    }
    // else if (question1Attempts === 3) {
    //   const ssml = `
    //   <speak>
    //   <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/movingWall1%20(mp3cut.net).mp3?alt=media&amp;token=bba62f22-a0b3-48f2-9bd4-25a16ca035a4">Moving Walls</audio>
    //   <break time="0.2" />
    // Wrong Answer!
    //   <break time="0.1" />
    //   Hint: It rhymes with Team Rocket's Pokemon.
    //   </speak>
    //   `;
    //   conv.ask(ssml);
    // } 
    else if (question1Attempts === 3) {
      const ssml = `
      <speak>
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/movingWall1%20(mp3cut.net).mp3?alt=media&amp;token=bba62f22-a0b3-48f2-9bd4-25a16ca035a4">Moving Walls</audio>
      <break time="0.2" />
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui50.mp3?alt=media&amp;token=0c0588ff-f521-4207-acd0-e12353105c9d">
      I don't think you can survive this room of doom. Anyway, I'll give you your final hint. It is used in funeral ceremonies.</audio>
      </speak>
      `;
      conv.ask(ssml);
    } else {
      gameOverFrom = 1;
      conv.followup('gameOver');
    }

    let livessml = ``, lives = ``;
    if (numberOfAttempts === 0) {
      lives = `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui54.mp3?alt=media&amp;token=b3c41422-a03e-42a2-b063-1a05edd553c8">Zero</audio>`;
    } else if (numberOfAttempts === 1) {
      lives = `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui51.mp3?alt=media&amp;token=a1db6ba9-fbe5-42a1-9cef-91399a67bcda">One</audio>`;
    } else if (numberOfAttempts === 2) {
      lives = `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui52.mp3?alt=media&amp;token=db5853c6-a930-4b0c-ae51-26c99978f9a4">Two</audio>`;
    }

    livessml = `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui55.mp3?alt=media&amp;token=2bf80ed6-fadb-42fc-abcc-ee8344acd455">You have</audio>` +
      lives + `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui56.mp3?alt=media&amp;token=d7b23bb4-fa27-436e-b85c-99d2ba5776eb">lives left</audio>`;

    const ssml =
      `<speak>
      ${livessml}
   <break time="0.2" />
   <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/quiz1.mp3?alt=media&amp;token=755eec63-b08e-4d33-b558-0fd57aa89003">
   The one who built it, sold it 
   The one who bought it, never used it
   And the one who used it never saw it. What is it?
   </audio> 
     </speak>`;
    conv.ask(ssml);
  }
});


app.intent('escapeRoom-Q2', (conv) => {
  if (question2Attempts == 0) {
    question2Attempts++;
    const ssml =
      `<speak>
  <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/contra.mp3?alt=media&amp;token=9526f7a2-8ce4-4772-ad46-62cba0971474"></audio>
  <break time="0.2" />
  <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui57.mp3?alt=media&amp;token=ade9a683-2b69-429e-ab74-360bf98b4479">
  Nice Work with the riddle. I hope you do not find the need to use a coffin.
  The second puzzle tests your mathematical prowess.
  What is the answer to:
  </audio>
  <break time="0.2" />
  <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/quiz2.mp3?alt=media&amp;token=b8f65f6f-78bf-402e-9886-3a046b2e3b93">
  Jane, Allie, and Pat each planted a tree 90cm in height. By the time Jane's tree grew by 1cm, Ally's tree grew by 2cm.
  By the time Ally's tree grew by 2cm, Pat's tree grew by 3cm.
  How tall is Jane's tree when the height of Pat's tree is 108cm?
  </audio>

  </speak>`;
    conv.ask(ssml);
  } else {
    numberOfAttempts--;
    question2Attempts++;
    if (numberOfAttempts === 0) {
      gameOverFrom = 2;
      conv.followup('gameOver');
    } else if (question2Attempts === 2) {
      const ssml = `
      <speak>
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/movingWall1%20(mp3cut.net).mp3?alt=media&amp;token=bba62f22-a0b3-48f2-9bd4-25a16ca035a4">Moving Walls</audio>
      <break time="0.2" />
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui48.mp3?alt=media&amp;token=8bab9924-c0d9-45cb-92df-8faef556a2df">Wrong Answer!</audio>
      <break time="0.1" />
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui59.mp3?alt=media&amp;token=e46c00ef-5a63-42df-8a15-7549f5da148d">Hint: It is simple linear algebra. Take a pen and do the math on your hand.</audio>
      </speak>
      `;
      conv.ask(ssml);
    } else if (question2Attempts === 3) {
      const ssml = `
      <speak>
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/movingWall1%20(mp3cut.net).mp3?alt=media&amp;token=bba62f22-a0b3-48f2-9bd4-25a16ca035a4">Moving Walls</audio>
      <break time="0.2" />
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui60.mp3?alt=media&amp;token=98e6239c-204f-44ff-ab53-8afb2433dce6">
      I don't think you can survive this room of doom. Anyway, its an anagram of 69.</audio>
      </speak>
      `;
      conv.ask(ssml);
    } else {
      const ssml = `
      <speak>
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/movingWall1%20(mp3cut.net).mp3?alt=media&amp;token=bba62f22-a0b3-48f2-9bd4-25a16ca035a4">Moving Walls</audio>
      <break time="0.2" />
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui48.mp3?alt=media&amp;token=8bab9924-c0d9-45cb-92df-8faef556a2df">Wrong Answer!</audio>
      <break time="0.1" />
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui61.mp3?alt=media&amp;token=e9f72f4a-659c-4c5b-a6cb-568edf421b6c">
      Hint: The answer is 96cm. Now you do not have any lives left. If you want to escape this room, you are on your own!</audio>
      </speak>
      `;
      conv.ask(ssml);
    }

    let livessml = ``, lives = ``;
    if (numberOfAttempts === 0) {
      lives = `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui54.mp3?alt=media&amp;token=b3c41422-a03e-42a2-b063-1a05edd553c8">Zero</audio>`;
    } else if (numberOfAttempts === 1) {
      lives = `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui51.mp3?alt=media&amp;token=a1db6ba9-fbe5-42a1-9cef-91399a67bcda">One</audio>`;
    } else if (numberOfAttempts === 2) {
      lives = `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui52.mp3?alt=media&amp;token=db5853c6-a930-4b0c-ae51-26c99978f9a4">Two</audio>`;
    }

    livessml = `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui55.mp3?alt=media&amp;token=2bf80ed6-fadb-42fc-abcc-ee8344acd455">You have</audio>` +
      lives + `<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/nui56.mp3?alt=media&amp;token=d7b23bb4-fa27-436e-b85c-99d2ba5776eb">lives left</audio>`;

    const ssml =
      `<speak>
      ${livessml}
   <break time="0.2" />
   <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/quiz2.mp3?alt=media&amp;token=b8f65f6f-78bf-402e-9886-3a046b2e3b93">
  Jane, Allie, and Pat each planted a tree 90cm in height. By the time Jane's tree grew by 1cm, Ally's tree grew by 2cm.
  By the time Ally's tree grew by 2cm, Pat's tree grew by 3cm.
  How tall is Jane's tree when the height of Pat's tree is 108cm?
  </audio>
     </speak>`;
    conv.ask(ssml);
  }
});


app.intent('escapeRoom-Q3', (conv) => {
  if (question3Attempts == 0) {
    question3Attempts++;
    const ssml =
      `<speak>
    <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/contra.mp3?alt=media&amp;token=9526f7a2-8ce4-4772-ad46-62cba0971474"></audio>
    <break time="0.2" />
    Yes, you are right. 96cm it is.
    <break time="0.2" />
    Let's go to the final level to get out of this room.
    In a moment, you will hear a morse code. Decode the code using the key provided on the table.
    <break time="0.1" />
    Remember you have only ${numberOfAttempts} lives left. One mistake can cause you your life.
    <break time="0.2" />
    Here is the code:
    dash dash dot <break time="0.3" /> dash dash dash
    <break time="0.4" />
    dash dash dot <break time="0.3" /> dot dash <break time="0.3" /> dash <break time="0.3" /> dash dash dash <break time="0.3" /> dot dash dot <break time="0.3" /> dot dot dot 
    </speak>`;
    conv.ask(ssml);
  } else {
    numberOfAttempts--;
    question3Attempts++;
    if (numberOfAttempts === 0) {
      gameOverFrom = 3;
      conv.followup('gameOver');
    } else if (question3Attempts === 2) {
      const ssml = `
      <speak>
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/movingWall1%20(mp3cut.net).mp3?alt=media&amp;token=bba62f22-a0b3-48f2-9bd4-25a16ca035a4">Moving Walls</audio>
      <break time="0.2" />
      Wrong Answer!
      <break time="0.1" />
      Hint: Get up and go.
      </speak>`;
      conv.ask(ssml);
    } else if (question3Attempts === 3) {
      const ssml = `
      <speak>
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/movingWall1%20(mp3cut.net).mp3?alt=media&amp;token=bba62f22-a0b3-48f2-9bd4-25a16ca035a4">Moving Walls</audio>
      <break time="0.2" />
      Wrong Answer!
      <break time="0.1" />
      Hint: Chomp Chomp.
      </speak>`;
      conv.ask(ssml);
    } else {
      const ssml = `
      <speak>
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/movingWall1%20(mp3cut.net).mp3?alt=media&amp;token=bba62f22-a0b3-48f2-9bd4-25a16ca035a4">Moving Walls</audio>
      <break time="0.2" />
      No more hints now for you. You are on your own.
      </speak>`;
      conv.ask(ssml);
    }

    const ssml =
      `<speak>
   You have ${numberOfAttempts} lives left.
   <break time="0.2" />
    Here is the code:
    dash dash dot <break time="0.3" /> dash dash dash
    <break time="0.4" />
    dash dash dot <break time="0.3" /> dot dash <break time="0.3" /> dash <break time="0.3" /> dash dash dash <break time="0.3" /> dot dash dot <break time="0.3" /> dot dot dot 
     </speak>`;
    conv.ask(ssml);
  }
});

app.intent('startEscapeRoom - fallback', (conv) => {
  conv.followup('startEscapeRoom');
});

app.intent('escapeRoom-Q2 - fallback', (conv) => {
  conv.followup('escapeRoomQ2');
});

app.intent('escapeRoom-Q3 - fallback', (conv) => {
  conv.followup('escapeRoomQ3');
});

app.intent('escapeRoomFinish', (conv) => {
  gameStatus = 'startEscapeRoom';
  conv.followup('shouldWePlayEvent');
});

app.intent('gameOverIntent', (conv) => {
  if (gameOverFrom === 1) {
    const ssml =
      `<speak>
      <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/super-mario-falling-%5BAudioTrimmer%20(mp3cut.net)%20(2)%20(2).mp3?alt=media&amp;token=5bb6c24d-982e-4892-9d0e-831a96a2a6e9" >Mario</audio>
      <break time = "0.2" />
      You have exhausted all your chances of survival. If you haven't answer the question yet. You would need a coffin. FYI that is the answer
      </speak>`;
    conv.close(ssml);
  } else if (gameOverFrom === 2) {
    const ssml =
      `<speak>
      <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/super-mario-falling-%5BAudioTrimmer%20(mp3cut.net)%20(2)%20(2).mp3?alt=media&amp;token=5bb6c24d-982e-4892-9d0e-831a96a2a6e9" >Mario</audio>
      <break time = "0.2" />
      You have exhausted all your chances of survival. The answer to this linear algebra puzzle is 96cm.
      </speak>`;
    conv.close(ssml);
  } else if (gameOverFrom === 3) {
    const ssml =
      `<speak>
      <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/super-mario-falling-%5BAudioTrimmer%20(mp3cut.net)%20(2)%20(2).mp3?alt=media&amp;token=5bb6c24d-982e-4892-9d0e-831a96a2a6e9" >Mario</audio>
      <break time = "0.2" />
      You have exhausted all your chances of survival. The decoded version of this morse code is Go Gators.
      </speak>`;
    conv.close(ssml);
  } else {
    const ssml =
      `<speak>
      <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/contra.mp3?alt=media&amp;token=9526f7a2-8ce4-4772-ad46-62cba0971474" >Mario</audio>
      <break time = "0.2" />
      You have completed the game. Good luck with your life. Stay safe from COVID-19
      </speak>`;
    conv.close(ssml);
  }
});


app.intent('Default Fallback Intent', (conv) => {
  conv.ask(`I did not get that, Can you repeat it again?`);
});

app.intent('islandNorth-fallback', (conv) => {
  conv.ask(`I am not sure this will work!`);
});


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
