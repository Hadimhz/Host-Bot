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
const config = require("./config.json"); // Edit example-config.json
require("dotenv").config();
const Discord = require("discord.js");
const panel = require('./wrapper/index').Application;

panel.login(config.Pterodactyl.hosturl, config.Pterodactyl.apikey);

const client = new Discord.Client({
    //I've removed any intents that seemd useless, Add them as you need
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "GUILD_MESSAGE_REACTIONS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_INVITES"],
    //The bot can only ping users, This way if someone founds a exploit it can't ping that many users
    allowedMentions: {
        parse: ['users'],
        repliedUser: true
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

exports.client = client;
global.ROOT_PATH = __dirname;
exports.panel = panel;

// Event Handler
let events = fs.readdirSync(ROOT_PATH + '/events').filter(x => x.endsWith(".js"));
events.forEach(x => {
    try {
        require('./events/' + x);
    } catch (error) {
        console.log(chalk.bgRedBright("[ERROR]"), `An error occured while trying to load the ${x} event ` + error.stack);
    };
});

loadCommands(`${ROOT_PATH}/commands`).then(x => {
    // console.log(x);
    fs.writeFileSync(ROOT_PATH + '/log.json', JSON.stringify(x.logs, null, 2));
    client.commands = x.commandsCol;

    if (x.logs.stats.errors != 0)
        console.log(chalk.bgRedBright("[ERROR]"), `An error occured while loading commands, please check`, chalk.bgWhite("log.json"), `for more information.`);

    console.log(chalk.bgCyan("[CommandHandler]"), `Loaded a total of ${x.logs.stats.commands} commands in ${x.logs.stats.categories} categories.`);
});

client.login(process.env.Token); // Login to Discord