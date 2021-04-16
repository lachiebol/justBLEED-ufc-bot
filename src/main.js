const sherdog = require('sherdog');
const Discord = require('discord.js');
const client = new Discord.Client();

const fightRetriever = require('./FighterDataRetriever');

const getFighterTag = "!fighter ";


require('dotenv').config();

console.log(process.env.DISCORD_TOKEN);
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if(msg.content.startsWith(getFighterTag)){
      fightRetriever.getFighterData(msg.content.slice(getFighterTag.length)).then((data) => {
        let fightString = getFightsInFormat(data.fights);
        msg.reply(`\nName: ${data.name}, Nickname: ${data.nickname}, Age: ${data.age}\nRecord: ${data.wins.total} - ${data.losses.total}\n\nLast 5 wins:\n${fightString}`);
      });
  }
});

client.login(process.env.DISCORD_TOKEN);


/**
 * Takes array of fighters and formats it to be displayed
 * @param {Array} fights Array of fight objects 
 * @returns Formatted string with fighter's last 5 fights
 */
function getFightsInFormat(fights) {
  let fightStrings = ""
  for(let fight of fights.slice(0, 5)) {
    fightStrings += (`${fight.result.slice(0, 1).toUpperCase()}: ${fight.opponent} (${fight.method}, Round: ${fight.round})\n`)
  }
  return fightStrings;
}



