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

global.config = require("./config.json"); // Edit example-config.json
require("dotenv").config();
global.Discord = require("discord.js");

global.client = new Discord.Client({
    //I've given it all intents Remove any you think it might not need :)
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"],

    //Made it where it can only ping Users, Stops people from pinging @everyone or @members
    allowedMentions: {
        parse: ['users'],
        repliedUser: true
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.on("ready", () => {
    console.log('Ready, Logged in as ' + client.user.tag);
});

client.login(process.env.Token); // Login to Discord
