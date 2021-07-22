const { client } = require('../index.js')
const config = require('../config.json')
const chalk = require('chalk')
const mongo = require('../mongo');

client.on('ready', async (client) => {
    console.log(`${chalk.greenBright("[BOT]")} Bot ready and logged in as ${client.user.tag}`)
    await mongo().then(mongoose => {
        console.log(`${chalk.green("[DATABASE]")} Connected to databse successfully!`)
    });

})