const { MessageEmbed } = require("discord.js")


module.exports.run = async (client, message, args) => {
    message.channel.send({
        embeds: [new MessageEmbed().setTitle("Pong!").setColor("RED").setDescription(`Ping: ${client.ws.ping}ms`)]
    });
}

/**
 * This is completely optional...
 */

module.exports.info = {
    name: 'ping', // default = file name (without the extention)
    description: "Shows the bot's ping." // default is "None"
}