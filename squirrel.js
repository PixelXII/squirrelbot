// lol changing this comment for git commits to heroku

// ok so when deploying to heroku he stays online for about 5 mins (no interactions)
// superuser SO or stackexchange march 23

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
     const actions = ['my inner demons', 'Feardog\'s mixes', 'j\'san', 'Joji', 'darksynth', "Odysseus", 'convolk', 'future funk', '/playing himself']
     const games = ['Ori and the Blind Forest', null, 'Minecraft', null, 'Half-Life 1 Episode 2', null, null, 'Yars\' Revenge']
     let current = 0
     setInterval(() => {
          let a = randomArray(actions)
          let j = Math.floor(Math.random() * 10)
          if (j <= 4) {
               client.user.setActivity(null)
          } else if (j === 8) {
               client.user.setActivity(randomArray(games))
          } else {
               if (a.split(' ')[0] == '/playing') {
                    play(a.replace(a.split(' ')[0], ''))
               } else {
                    listenTo(a)
               }
          }
     }, 10000/* 2400000 + Math.random() * 480000 */) // Math.random() * (1200000 - 480000) + 480000 -- between eight and 12 mins
     // 600000 -- ten minutes
     // 480000 -- eight mins
     // 1200000 -- 20 min
})

let triggers = {
     greetings: ['hello', 'hi', 'hello!', "hey!", "hey"],
     mornings: ['mornin', 'morning', 'good morning!', 'good morning', 'morning!'],
     nights: ['gnight', 'gnight!', 'night', 'good night', 'good night!', 'goodnight', 'goodnight!'],
     byes: ['bye!', 'bye', 'goodbye!', 'goodbye', 'adios!', 'adios', 'cya', 'cya later', 'seeya', 'later', 'see you later', 'see ya later']
}
triggers.total = [triggers.greetings, triggers.mornings, triggers.nights, triggers.byes]

let responses = {
     greetings: ['Hey /user!', 'Hello /user!', 'Hi!', 'Hey /user! How are you?', 'Hello /user! I hope your day is *fantastic*!'],
     mornings: ['Good morning /user!', '**yawn** Good morning, /user', 'I hope you slept well, /user.'],
     nights: ['Good night, /user!', "See you in the morning, /user!", 'Good night, /user! See you in the morning!', 'Good night /user! Sleep well!', "Sleep tight, /user!"],
     byes: ['Goodbye, /user!', 'Bye /user!', 'Goodbye!', 'See you later, /user!', 'Bye!', 'See you on the other side, /user!'],
     thanks: ['No problem!', 'You\'re welcome, /user!', 'My pleasure!'],
     wakeUp: ["Hello?", "Everyone asleep?", "I'm still awake..."]
}
responses.total = [responses.greetings, responses.mornings, responses.nights, responses.byes, responses.thanks, responses.wakeUp]

function fillNick(sending, message) {
     if (sending.toString().includes('/user')) {
          sending = sending.replace('/user', message.author.username)
     }
     message.channel.startTyping();
     setTimeout(() => {
          message.channel.send(sending)
          message.channel.stopTyping()
     }, (sending.length / 2) * 200)
}

function arrayIncludes(arr, str) { // shorter than arr.forEach(. . .)
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

client.on("message", (message) => {
     let secCount = 0;
     let timer = setInterval(() => {
          secCount++;
          if (secCount === 250) {
               fillNick(randomArray(responses.wakeUp))
               secCount = 0;
          }
     }, 1000) // setInterval isnt exact with timing but i dont need *perfect* accuracy
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
          }
     }

     message.channel.fetchMessages({ limit: 1 }).then(messages => {
          let lastMessage = messages.first()
          let secondLast = messages.second()
          if (lastMessage.author.id === client.user.id) {
               console.log([lastMessage, secondLast])
          }
     }).catch(console.error);
})

client.login(process.env.TOKEN)