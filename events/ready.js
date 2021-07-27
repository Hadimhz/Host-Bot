const config = require("../config.json");
const mongo = require("../utils/mongo");
const { client } = require("../index");
const chalk = require("chalk");

client.on('ready', async client => {
    const guild = client.guilds.cache.get(config.discord.guild);
    await guild.members.fetch();

    console.log(`${chalk.greenBright("[BOT]")} Bot ready and logged in as ${client.user.tag}`);
    await mongo()
        .then(() => console.log(chalk.green("[DATABASE]") + " Connected to database successfully!"))
        .catch(e => console.error(chalk.bgRedBright("[ERROR]"), `An error has occured when attempting to connect to mongo. (${e.message})`));
});
