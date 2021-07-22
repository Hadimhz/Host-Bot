const { client } = require('../index.js')
const config = require('../config.json')
const exec = require('child_process').exec;
const chalk = require('chalk')
const mongo = require('../mongo');

client.on('ready', async (client) => {
    console.log(`${chalk.greenBright("[BOT]")} Bot ready and logged in as ${client.user.tag}`)
    await mongo().then(mongoose => {
        console.log(`${chalk.green("[DATABASE]")} Connected to databse successfully!`)
    });

    console.log(config.DiscordChannels.gitlogs)
    setInterval(() => {
        exec(`git pull`, (error, stdout) => {
            let response = (error || stdout);
            if (!error) {
                if (response.includes("Already up to date.")) {
                    //console.log('Bot already up to date. No changes since last pull')
                } else {
                    client.channels.cache.get(config.DiscordChannels.gitlogs).send('**[AUTOMATIC]** \nNew update on GitHub. Pulling. \n\nLogs: \n```' + response + "```" + "\n\n\n**Restarting bot**")
                    setTimeout(() => {
                        process.exit();
                    }, 1000)
                }
            }
        })
    }, 30000)
})