const { MessageEmbed } = require("discord.js")


module.exports.run = async (client, message, args) => {
    let days = Math.floor(client.uptime / 86400000 );
    let hours = Math.floor(client.uptime / 3600000 ) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;
    message.channel.send({
        embeds: [new MessageEmbed().setTitle(`DanBot Hosting Bot Uptime`).setColor("#6f89d9").addField("Uptime:", `${days}d ${hours}h ${minutes}m ${seconds}s`).addField("Memory usage:", Math.trunc((process.memoryUsage().heapUsed) / 1024 / 1000) + "mb", true).setFooter(`Requested by ${message.author.tag}`).setTimestamp()]
    });
}

module.exports.info = {
    name: 'uptime', 
    description: "Shows the bot's uptime." 
}
