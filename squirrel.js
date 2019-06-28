const Discord = require('discord.js')
const HTTP = require('http')
require('dotenv').config()

const client = new Discord.Client();
function listenTo(e) {
     client.user.setPresence({
          game: {
               name: e,
               type: "LISTENING"
          }
     });
}

function play(e) {
     client.user.setPresence({
          game: {
               name: e,
               type: "PLAYING"
          }
     });
}
function randomArray(arr) {
     return arr[Math.floor(Math.random() * arr.length)]
}

client.on("ready", () => {
     console.log(`SquirrelBot is now online! > ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} <`)
     client.user.setStatus('available')
     client.user.setActivity(null)
     const actions = ['my inner demons', '3:30 am lofi hip hop', 'j\'san', 'darksynth', "Odysseus", 'future funk', '/playing guitar']
     const games = ['Ori and the Blind Forest', null, 'Minecraft', null, 'Half-Life', null, null, 'Yars\' Revenge']
     let current = 0
     setInterval(() => {
          let a = randomArray(actions)
          let j = Math.floor(Math.random() * 10)
          let i = Math.floor(Math.random() * 10)
          console.log("interval");
          if(i === 4) {
               client.user.setActivity(null)
          }
          if(j > 4) {
               console.log('continued')
               return;
          } else if(j === 8 || j === 9) {
               if(i > 3) {
                    if(a.split(' ')[0] == '/playing') {
                         play(a.replace(a.split(' ')[0]), '')
                         console.log('guitar')
                    } else {
                         listenTo(a)
                         console.log('listening to '+a)
                    }
               } else {
                    let t = randomArray(games)
                    play(t)
                    console.log(t)
               }
          }
     }, 480000); // Math.random() * (1200000 - 480000) + 480000 -- between eight and 12 mins
     // 4800000 + Math.random() * 960000
     // 600000 -- ten minutes
     // 480000 -- eight mins
     // 1200000 -- 20 min
})

let triggers = {
     greetings: ['hello', 'hi', 'hello!', "hey!", "hey"],
     mornings: ['mornin', 'morning', 'good morning!', 'good morning', 'morning!'],
     nights: ['gnight', 'gnight!', 'night', 'good night', 'good night!', 'goodnight', 'goodnight!'],
     byes: ['bye!', 'bye', 'goodbye!', 'goodbye', 'adios!', 'adios', 'cya', 'cya later', 'seeya', 'later', 'see you later', 'see ya later'],
     howya: ['how are you?', 'whats up?', 'how are you doing?', 'whats goin on?', 'how are you', 'whats up', 'how are you doing'],
     lols: ['lol', 'lmao', 'rofl', 'roflmao', 'lmfao']
}
triggers.total = [triggers.greetings, triggers.mornings, triggers.nights, triggers.byes, triggers.howya]

let responses = {
     greetings: ['Hey /user!', 'Hello /user!', 'Hi!', 'Hey /user! How are you?', 'Hello /user! I hope your day is *fantastic*!'],
     mornings: ['Good morning /user!', '**yawn** Good morning, /user', 'I hope you slept well, /user.'],
     nights: ['Good night, /user!', "See you in the morning, /user!", 'Good night, /user! See you in the morning!', 'Good night /user! Sleep well!', "Sleep tight, /user!"],
     byes: ['Goodbye, /user!', 'Bye /user!', 'Goodbye!', 'See you later, /user!', 'Bye!', 'See you on the other side, /user!'],
     thanks: ['No problem!', 'You\'re welcome, /user!', 'My pleasure!'],
     howya: ["I'm not doing too bad myself, /user. Thanks for asking!", "I'm doing good, thank you!", "i've had kind of a rough day, thank you for asking", "its not been the best day but ehhh...", "Good! I just got back from a vacation in Africa to visit some relatives. Thanks for asking, /user."],
     lols: ['lol', 'lmao', 'roflmao']
}
responses.total = [responses.greetings, responses.mornings, responses.nights, responses.byes, responses.thanks]

function fillNick(sending, message) {
     if (sending.toString().includes('/user')) {
          sending = sending.replace('/user', message.author.username)
     }
     message.channel.startTyping()
     setTimeout(() => {
          message.channel.send(sending)
          message.channel.stopTyping()
     }, (sending.length / 2) * 200)
}

function arrayIncludes(arr, str) {
     arr.forEach(a => {
          if (a.includes(str)) {
               return true;
          }
     })
}

function stringIncludes(arr, str) {
     arr.forEach(a => {
          if (str.includes(a)) {
               return true;
          }
     })
}

let secCount = 0;
let lolCount = 0;
let desiredlols = 6;

client.on("message", (message) => {
     let content = message.content.toLowerCase();

     if (message.author.id === client.user.id) return;

     if (message.author.id === '83010416610906112' && content.includes('hello')) {
          message.channel.send('Hello NightBot!')
     }
     if (message.author.bot) console.log('triggered by bot');
     if (content.includes('thank') && content.includes('squirrelbot')) {
          fillNick(randomArray(responses.thanks), message)
     } else {
          if (triggers.greetings.includes(content) || stringIncludes(triggers.greetings, content)) {
               fillNick(randomArray(responses.greetings), message)
          } else if (triggers.mornings.includes(content) || stringIncludes(triggers.mornings, content)) {
               fillNick(randomArray(responses.mornings), message)
          } else if (triggers.nights.includes(content) || stringIncludes(triggers.nights, content)) {
               fillNick(randomArray(responses.nights), message)
          } else if (triggers.byes.includes(content) || stringIncludes(triggers.byes, content)) {
               fillNick(randomArray(responses.byes), message)
          } else if (triggers.howya.includes(content) || stringIncludes(triggers.byes, content)) {
               fillNick(randomArray(responses.howya), message)
          } else if (triggers.lols.includes(content) || stringIncludes(triggers.lols, content)) {
               lolCount++;
               console.log(lolCount)
               if (lolCount === desiredlols) {
                    lolCount = 0;
                    fillNick(randomArray(responses.lols), message)
               }
               // for every "lol" add one
               // if it gets to {x} say "lol" or some form of roflmao
          }

     }
})

client.login(process.env.TOKEN)
