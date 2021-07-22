const UserData = require('../../../database/schemas/UserData')

module.exports.run = (client, message, args) => {
    message.channel.send({ content: "Test" })
}

module.exports.info = {
    name: "new",
    description: "Creates a new panel account",
    aliases: ['n'],
}