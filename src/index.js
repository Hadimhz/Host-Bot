
const chalk = require('chalk');
const fs = require('fs');
const { loadCommands } = require('./utils/commandHandler');
const config = require("./config.json"); // Edit example-config.json
require("dotenv").config();
const Discord = require("discord.js");
const panel = require('./wrapper/index').Application;
const cache = require('./utils/Cache');

panel.login(config.pterodactyl.hosturl, config.pterodactyl.apikey);

const client = new Discord.Client({
    //I've removed any intents that seemd useless, Add them as you need
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "GUILD_MESSAGE_REACTIONS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_INVITES", "DIRECT_MESSAGES"],
    //The bot can only ping users, This way if someone founds a exploit it can't ping that many users
    allowedMentions: {
        parse: ['users'],
        repliedUser: true
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
client.messageSnipes = new Discord.Collection();

exports.client = client;
global.ROOT_PATH = __dirname;
exports.panel = panel;

const { parse, fetchNodes } = require('./utils/fetchNodes')

const updateCache = async () => {
    var today = new Date();
    const { botNodes, gamingNodes, storageNodes } = parse(await fetchNodes());

    cache.set('botNodeIds', botNodes);
    cache.set('gamingNodeIds', gamingNodes);
    cache.set('storageNodeIds', storageNodes);

    console.log(chalk.green("[CACHE]"), "Updated Cache! Time: " + today.getHours() + ":" + today.getMinutes())
};

exports.updateCache = updateCache;

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
