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

let thingsWeHave = {
  crowbar: false,
  wood: false,
  rope: false,
  axe: false,
  banana: false
};

function resetGameState() {
  gameStatus = "start";
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
    `<speak><audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/WelcomeIntent.mp3?alt=media&amp;token=3c874054-31ba-4e68-b53c-3f66cd23f5cb" clipBegin="0s" clipEnd="5s">Welcome!!</audio> Hey, hi there! What is your name ?</speak>`;
  conv.ask(ssml);
  
});

app.intent("rollDie", conv => {
  console.log("IN the webhook" + JSON.stringify(conv));
  let number = arr[Math.floor(Math.random()*arr.length)];
  arr = arr.filter(item => item != number);
  
  
  if (number === 3) {
    conv.followup("StartBeach");
  }
  
  if (number === 2) {
    conv.followup("startEscapeRoom");
  }
});

app.intent("islandNorth", conv => {
  const ssml =
    "<speak>" +
    '<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/running_on_sand-%5BAudioTrimmer.com%5D.mp3?alt=media&amp;token=e5897db9-5527-4c41-8033-dc02521ab58f">running on sand</audio>' +
    "</speak>";
  conv.ask(ssml);

  if (boxOpen) {
    conv.ask(`There is nothing but only the empty box. 
  Which direction should we go now?`);
  } else {
    conv.ask(`Look there is a wooden box here. What should we do?`);
  }
});


app.intent("islandNorthOpenBox", conv => {
    if (thingsWeHave.crowbar) {
      boxOpen = true;
      thingsWeHave.axe = true;
      const ssml =
    "<speak>" +
    '<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/wooden-box.mp3?alt=media&amp;token=5f0f1ef0-8b60-4593-92b0-ff2de8ea351f">foot steps on sand</audio>' +
    "</speak>";
    conv.ask(ssml);
      conv.ask(`Look. There is an axe inside. I'll pick it up. Where should we go now?`);
    } else {
      conv.ask(`Ohh, it seems the box is not opening. 
    Maybe we should explore some other way. Which direction should we go to now?`);
    }
  
  console.log("IN the islandNorthOpenBox webhook" + JSON.stringify(conv));
});


app.intent("islandEast", conv => {
  const ssml =
    "<speak>" +
    '<audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/running_on_sand-%5BAudioTrimmer.com%5D.mp3?alt=media&amp;token=e5897db9-5527-4c41-8033-dc02521ab58f">foot steps on sand</audio>' +
    "</speak>";
  conv.ask(ssml);

  if (!thingsWeHave.rope) {
    const ssml2 =
      "<speak>" +
      '<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/moneky2.mp3?alt=media&amp;token=b4aa024c-e4b7-412e-894c-12559d7fc47e">monkey screaming</audio> Oh there is nothing here apart from the monkey on the tree.  What should we do, Should we do something or go in some other direction?' +
      "</speak>";
    conv.ask(ssml2);
  } else {
    const ssml2 =
      "<speak>" +
      '<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/moneky2.mp3?alt=media&amp;token=b4aa024c-e4b7-412e-894c-12559d7fc47e">monkey screaming</audio> Oh there is nothing here apart from the monkey on the tree.' +
      "</speak>";
    conv.ask(ssml2);
    conv.ask(
      `The monkey gave us the rope, there's nothing here to find, maybe we should explore other directions and scavange other things`
    );
  }
});

app.intent("islandEast-pickUpCrowBar", conv => {
  thingsWeHave.crowbar = true;
  const ssml =
    "<speak>" +
    '<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/picking_crowbar.mp3?alt=media&amp;token=fc77180b-4175-46ab-90bf-524b2e8ee427">picking up crowbar </audio> Here,  I got the crowbar, lets explore some other direction. Which direction should we go now?' +
    "</speak>";
  conv.ask(ssml);

  console.log("IN the islandEast-pickUpCrowBar webhook" + JSON.stringify(conv));
});

app.intent("islandEast-Givebanana", conv => {
  if (thingsWeHave.banana) {
    thingsWeHave.rope = true;
    const ssml =
      "<speak>" +
      '<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/moneky2.mp3?alt=media&amp;token=b4aa024c-e4b7-412e-894c-12559d7fc47e">monkey screaming</audio> Hey, look what the monkey gave us, a rope, I bet this will come in handy on the boat, What should we do now?  Go back to the boat?' +
      "</speak>";
    conv.ask(ssml);
  } else {
    const ssml =
      "<speak>" +
      '<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/moneky2.mp3?alt=media&amp;token=b4aa024c-e4b7-412e-894c-12559d7fc47e">monkey screaming </audio> But we dont have anything to offer the monkey with, What should we do?' +
      "</speak>";
    conv.ask(ssml);
  }
  console.log("IN the islandEast-Givebanana webhook" + JSON.stringify(conv));
});



app.intent("islandWest", conv => {
  if(thingsWeHave.crowbar){
    
    const ssml =
    "<speak>" +
    '<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/running_on_sand-%5BAudioTrimmer.com%5D.mp3?alt=media&amp;token=e5897db9-5527-4c41-8033-dc02521ab58f "> steps sound</audio>' +
    "</speak>";
    conv.ask(
      `we just picked the crowbar from this spot, there is nothing here apart from the banana tree, what should we do?`
    );
  }else{
    const ssml =
    "<speak>" +
    '<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/running_on_sand-%5BAudioTrimmer.com%5D.mp3?alt=media&amp;token=e5897db9-5527-4c41-8033-dc02521ab58f "> steps sound</audio>' +
    "</speak>";
    conv.ask(
      `Look, here is a crowbar lying under the banana tree I wonder if we can do something with these? Or should we go somewhere else?`
    );
  }
  

  console.log("IN the islandEast-pickUpCrowBar webhook" + JSON.stringify(conv));
});


app.intent("islandWest-shakeTree", conv => {
  thingsWeHave.banana = true;
  const ssml =
    "<speak>" +
    '<audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/shaking_tree.mp3?alt=media&amp;token=9e2099b7-910a-4e67-a825-69cc44801848">shaking the tree </audio> I got the banana, what should we do with this now ?' +
    "</speak>";
  conv.ask(ssml);

  console.log("IN the islandEast-pickUpCrowBar webhook" + JSON.stringify(conv));
});

app.intent("islandWest-cutTree", conv => {
  if(thingsWeHave.axe){
      thingsWeHave.wood = true;
      const ssml =
      `<speak>
     <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/tree-cutting.mp3?alt=media&amp;token=b7d8e46a-9086-4f96-9640-c3143df27e23">cutting the tree</audio>
       <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/tree-falling-on-ground.mp3?alt=media&amp;token=06b269cb-5cde-4818-845f-12fe457773a8">tree fell down</audio> 
     Good job cutting the tree down, this wood will come in handy to fix the holes in the boat.
     Where do we head next?
       </speak>`;
      conv.ask(ssml);
  } else {
    conv.ask(
      `But we have nothing to cut the tree with,   maybe we should find that first?`
    );
  }
  

  console.log("IN the islandEast-pickUpCrowBar webhook" + JSON.stringify(conv));
});

app.intent('atBoat', (conv) => {
  if (thingsWeHave.wood && thingsWeHave.rope && thingsWeHave.axe) {
        gameStatus = 'startIsland';
      conv.followup('shouldWePlayEvent');
    } else {
      conv.ask(`We  need some things to fix the boat. Lets explore the island and salvage some things. Which direction should we go?`);
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
    } else if (gameStatus === 'startIsland'){
      const ssml = 
         `<speak>Hey, congratulations you have everything to fix the boat. Lets leave. Should we roll the die again?</speak>`;
        conv.ask(ssml);
    } else if(gameStatus === 'startEscapeRoom'){
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
      return conv.ask('Sorry, I am not sure this is working, What should we do with this box, or do you want to explore some other direction?');
    } else if (conv.data.fallbackCount === 2) {
      return conv.ask(`Sorry, I didn't get it. What do you wanna do?`);  
    } else if(conv.data.fallbackCount === 3){
      // If 'fallbackCount' is greater than 2, send out the final message and terminate the conversation.
      return conv.ask(`Sorry, I didn't get it. maybe we should try and go back to the boat`);
    }else{
      return conv.close(`This seems to be beyond our expertise. It seems it is game over`);
    }
  } else{
    return conv.ask(`There is nothing but only the empty box. 
  Which direction should we go now?`);
  }
    
});

app.intent('islandNorthOpenBox - fallback', (conv) => {
  return conv.ask(`You already opened the box. Which direction should we go now?`);
});

app.intent('islandWest - fallback', (conv) => {
    if(!thingsWeHave.crowbar){
      return conv.ask(`Hint: the crowbar might be useful`);
    } 

    if (!thingsWeHave.banana) {
      return conv.ask(`Hint: You might want to shake things up!`);
    } 

    if (thingsWeHave.axe) {
      return conv.ask(`Hint: You might need some wood to repair the boat. Want to use your axe?`);
    } 
      
    return conv.ask(`I am sorry! I cannot help you. Which direction do you want to go?`);
});

app.intent('islandEast-pickUpCrowBar - fallback', (conv) => {
    
    if (!thingsWeHave.banana) {
      return conv.ask(`Hint: You might want to shake things up!`);
    } 

    return conv.ask(`Hint: You might need some wood to repair the boat. Want to use your axe?`);
});

app.intent('islandWest-shakeTree - fallback', (conv) => {
    
    if (!thingsWeHave.crowbar) {
      return conv.ask(`Hint: the crowbar might be useful`);
    } 

    if (thingsWeHave.axe) {
      return conv.ask(`Hint: You might need some wood to repair the boat. Want to use your axe?`);
    }

    return conv.ask(`I am sorry! I cannot help you. Which direction do you want to go?`);
});

app.intent('islandWest-cutTree - fallback', (conv) => {
    
    if (!thingsWeHave.banana) {
      return conv.ask(`Hint: You might want to shake things up!`);
    } 

    return conv.ask(`I cannot help you. You should look elsewhere. Which direction do you want to go?`);
});

app.intent('islandEast - fallback', (conv) => {
    if (!thingsWeHave.banana) {
      return conv.ask(`Hint: You mmight need something for the monkey`);
    } else {
      return conv.ask(`Hint: You might want to trade stuffs with monkey`);
    }
});

app.intent('islandEast-Givebanana - fallback', (conv) => {
    if (thingsWeHave.rope) {
      return conv.ask(`You can look somewhere else or go back to the boat. Which direction to go now?`);
    }
});


app.intent("startEscapeRoom", (conv, agent) => {

  if(question1Attempts === 0){
    question1Attempts++;
    const ssml =
  `<speak>
   <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/dice-roll.mp3?alt=media&amp;token=1a135d26-01d3-489a-944d-095e07cce7cf">Die rolls</audio>
   You have rolled a 2.  
   <audio src="https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/warpSound.mp3?alt=media&amp;token=1a5c3061-4b69-4a7f-a6ba-c9ab67c8ef06">Space Warp sound</audio> 
   <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/movingWall1%20(mp3cut.net).mp3?alt=media&amp;token=bba62f22-a0b3-48f2-9bd4-25a16ca035a4">Moving Walls</audio>
   Looks like we are stuck in this room of doom.  
   See, what's written on the screen.  
   To get out of this room, you have 3 lives. 
   With every wrong attempt, the walls will move closer. 
   This sounds scary, we should get out of here quick. 
     Here comes the first one: 
     <break time="0.2" />
   The one who built it, <break time="0.1" />sold it
   <break time="0.3" />
   The one who bought it, <break time="0.1" /> never used it
   <break time="0.3" />
   And the one who used it never saw it. <break time="0.1" /> What is it?
     </speak>`;
  conv.ask(ssml);
  } else{
    numberOfAttempts--;
    question1Attempts++;
    if (question1Attempts === 2) {
      const ssml = `
      <speak>
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/movingWall1%20(mp3cut.net).mp3?alt=media&amp;token=bba62f22-a0b3-48f2-9bd4-25a16ca035a4">Moving Walls</audio>
      <break time="0.2" />
      Wrong Answer!
      <break time="0.1" />
      Hint: It rhymes with coffee.
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
      Ahhh! I don't think you can survive this room of doom. Anyway, I'll give you your final hint. It is used in funeral ceremonies.
      </speak>
      `;
      conv.ask(ssml);
    } else {
      gameOverFrom = 1;
      conv.followup('gameOver');
    }

    const ssml =
  `<speak>
   You have ${numberOfAttempts} lives left
   <break time="0.2" />
    The one who built it, <break time="0.1" />sold it
   <break time="0.3" />
   The one who bought it, <break time="0.1" /> never used it
   <break time="0.3" />
   And the one who used it never saw it. <break time="0.1" /> What is it?
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
  Nice Work with the riddle. I hope you do not find the need to use a coffin.
  <break time="0.2" />
  The second puzzle tests your mathematical prowess.
  What is the answer to:
  Jane, Allie, and Pat each planted a tree 90cm in height. By the time Jane's tree grew by 1cm, Ally's tree grew by 2cm.
  <break time="0.2"/>
  By the time Ally's tree grew by 2cm, Pat's tree grew by 3cm.
  <break time="0.3"/>
  How tall is Jane's tree when the height of Pat's tree is 108cm?
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
      Wrong Answer!
      <break time="0.1" />
      Hint: It is simple linear algebra. Take a pen and do the math on your hand.
      </speak>
      `;
      conv.ask(ssml);
    } else if (question2Attempts === 3) {
      const ssml = `
      <speak>
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/movingWall1%20(mp3cut.net).mp3?alt=media&amp;token=bba62f22-a0b3-48f2-9bd4-25a16ca035a4">Moving Walls</audio>
      <break time="0.2" />
      Ahhh! I don't think you can survive this room of doom. <break time = "0.2" /> Anyway, its an anagram of 69.
      </speak>
      `;
      conv.ask(ssml);
    } else {
      const ssml = `
      <speak>
      <audio src = "https://firebasestorage.googleapis.com/v0/b/nui-adventuregame-covbdv.appspot.com/o/movingWall1%20(mp3cut.net).mp3?alt=media&amp;token=bba62f22-a0b3-48f2-9bd4-25a16ca035a4">Moving Walls</audio>
      <break time="0.2" />
      Wrong Answer!
      <break time="0.1" />
      Hint: The answer is 96cm. Now you do not have any lives left. If you want to escape this room, you are on your own!
      </speak>
      `;
      conv.ask(ssml);
    }

   const ssml =
     `<speak>
   You have ${numberOfAttempts} lives left
   <break time="0.2" />
   Jane, Allie, and Pat each planted a tree 90cm in height. By the time Jane's tree grew by 1cm, Ally's tree grew by 2cm.
   <break time="0.1"/>
   By the time Ally's tree grew by 2cm, Pat's tree grew by 3cm.
   <break time="0.2"/>
   How tall is Jane's tree when the height of Pat's tree is 108cm?
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
