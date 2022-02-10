global.ROOT_PATH = __dirname;
require("dotenv").config();

const chalk = require('chalk');
const fs = require('fs');
const { loadCommands } = require('./utils/commandHandler');
const config = require(ROOT_PATH + "/../config.json"); // Edit example-config.json
const Discord = require("discord.js");
const panel = require('./wrapper/index').Application;
const cache = require('./utils/Cache');

panel.login(config.pterodactyl.hosturl, config.pterodactyl.apikey);

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_BANS"],
    allowedMentions: { parse: ['users'], repliedUser: true },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.messageSnipes = new Discord.Collection();

exports.client = client;
exports.panel = panel;

const { parse, fetchNodes, fetchEggs } = require('./utils/panelUtils')

const updateCache = async () => {
    let today = new Date();
    let nodes = await fetchNodes();
    const { botNodes, gamingNodes, storageNodes } = parse(nodes);

    cache.set('botNodeIds', botNodes);
    cache.set('gamingNodeIds', gamingNodes);
    cache.set('storageNodeIds', storageNodes);
    cache.set('eggs', await fetchEggs());

    console.log(`${chalk.green("[CACHE]")} Updated Cache! Time: ${today.getHours()%12}:${today.getMinutes()} ${(today.getHours() >= 12 ? "PM" : "AM")} (${nodes.data.length} nodes and ${cache.get('eggs').length} eggs)`);
}

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
    fs.writeFileSync(ROOT_PATH + '/log.json', JSON.stringify(x.logs, null, 2));
    client.commands = x.commandsCol;

    if (x.logs.stats.errors != 0)
        console.log(chalk.bgRedBright("[ERROR]"), `An error occured while loading commands, please check`, chalk.bgWhite("log.json"), `for more information.`);

    console.log(chalk.bgCyan("[CommandHandler]"), `Loaded a total of ${x.logs.stats.commands} commands in ${x.logs.stats.categories} categories.`);
});

client.login(config.discord.bot.token); // Login to Discord