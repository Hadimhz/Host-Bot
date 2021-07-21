/*
    ____              ____        __     __  __           __  _
   / __ \____ _____  / __ )____  / /_   / / / /___  _____/ /_(_)___  ____ _
  / / / / __ `/ __ \/ __  / __ \/ __/  / /_/ / __ \/ ___/ __/ / __ \/ __ `/
 / /_/ / /_/ / / / / /_/ / /_/ / /_   / __  / /_/ (__  ) /_/ / / / / /_/ /
/_____/\__,_/_/ /_/_____/\____/\__/  /_/ /_/\____/____/\__/_/_/ /_/\__, /
Free Hosting forever!                                            /____/
*/
const chalk = require('chalk');
const fs = require('fs');
const { loadCommands } = require('./utils/commandHandler');
global.config = require("./config.json"); // Edit example-config.json
global.Discord = require("discord.js"); 
global.client = new Discord.Client({
    //I've given it all intents Remove any you think it might not need :)
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"],
    //Made it where it can only ping Users, Stops people from pinging @everyone or @members
    allowedMentions: {
        parse: ['users'],
        repliedUser: true
    },
    restWsBridgetimeout: 100,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

exports.client = client;
global.ROOT_PATH = __dirname;


// Event Handler
let events = fs.readdirSync(ROOT_PATH + '/events').filter(x => x.endsWith(".js"));
events.forEach(x => {
    try {
        require('./events/' + x);
    } catch (error) {
        console.log(chalk.bgRedBright("[ERROR]"), `An error occured while trying to load the ${x} event`);
    }
});

loadCommands(`${ROOT_PATH}/commands`).then(x => {
    // console.log(x);
    fs.writeFileSync(ROOT_PATH + '/../log.json', JSON.stringify(x.logs, null, 2));
    client.commands = x.commandsCol;

    if (x.logs.stats.errors != 0)
        console.log(chalk.bgRedBright("[ERROR]"), `An error occured while loading commands, please check`, chalk.bgWhite("log.json"), `for more information.`);

    console.log(chalk.bgCyan("[CommandHandler]"), `Loaded a total of ${x.logs.stats.commands} commands in ${x.logs.stats.categories} categories.`);
})
client.on('ready', () => {
    console.log("online");
});
//Bot login
client.login(config.DiscordBot.Token);