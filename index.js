/*
    ____              ____        __     __  __           __  _
   / __ \____ _____  / __ )____  / /_   / / / /___  _____/ /_(_)___  ____ _
  / / / / __ `/ __ \/ __  / __ \/ __/  / /_/ / __ \/ ___/ __/ / __ \/ __ `/
 / /_/ / /_/ / / / / /_/ / /_/ / /_   / __  / /_/ (__  ) /_/ / / / / /_/ /
/_____/\__,_/_/ /_/_____/\____/\__/  /_/ /_/\____/____/\__/_/_/ /_/\__, /
Free Hosting forever!                                            /____/
*/
global.config = require("./config.json");

global.Discord = require("discord.js");
global.client = new Discord.Client({
    restTimeOffset: 0,
    disableMentions: 'everyone',
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"],
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true
    },
    restWsBridgetimeout: 100,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

//Bot login
client.login(config.DiscordBot.Token);