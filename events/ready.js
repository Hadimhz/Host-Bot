const config = require("../config.json");
const { client, updateCache } = require("../index");
const mongo = require("../utils/mongo");
const chalk = require("chalk");

client.on('ready', async () => {
    console.log(`${chalk.greenBright("[BOT]")} Bot ready and logged in as ${client.user.tag}`);

    await mongo().then(() => console.log(chalk.green("[DATABASE]") + " Connected to database successfully!"))
        .catch(e => console.error(chalk.bgRedBright("[ERROR]"), `An error has occured when attempting to connect to mongo. (${e.message})`));


    await updateCache()

    setInterval(async () => await updateCache(), 60 * 60 * 1000)
});

