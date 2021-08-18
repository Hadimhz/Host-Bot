const { MessageEmbed } = require("discord.js")
const humanizeDuration = require("humanize-duration")


module.exports.run = async (client, message, args) => {

    message.channel.send({
        embeds: [
            new MessageEmbed()
                .setTitle(`DanBot Hosting Bot Uptime`)
                .setColor("#6f89d9").addField("> 🤖 Uptime:", humanizeDuration(client.uptime, { round: true }))
                .addField("> ⌛ Memory usage:", Math.trunc((process.memoryUsage().heapUsed) / 1024 / 1000) + "mb", true)
                .setFooter(`Requested by ${message.author.tag}`).setTimestamp()
        ]
    });
}

module.exports.info = {
    name: 'uptime',
    description: "Shows the bot's uptime."
}
