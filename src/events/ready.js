const config = require(ROOT_PATH + "/../config.json");
const { client, updateCache } = require("../index");
const mongo = require("../utils/mongo");
const chalk = require("chalk");

client.on('ready', async () => {
    const guild = client.guilds.cache.get(config.discord.guild);
    guild.members.fetch()
    console.log(`${chalk.greenBright("[BOT]")} Bot ready and logged in as ${client.user.tag}`);
    console.log(`${chalk.greenBright("[BOT]")} Cached All members in ${guild.name}`)
    await mongo().then(() => console.log(chalk.green("[DATABASE]") + " Connected to database successfully!"))
        .catch(e => console.error(chalk.bgRedBright("[ERROR]"), `An error has occured when attempting to connect to mongo. (${e.message})`));


    await updateCache()
    .catch(e => console.error(chalk.bgRedBright("[ERROR]"), `An error has occured when fetching nodes. (${e.message})`))

    setInterval(async () => await updateCache().catch(e => console.error(chalk.bgRedBright("[ERROR]"), `An error has occured when fetching nodes. (${e.message})`)), 60 * 60 * 1000)
});

