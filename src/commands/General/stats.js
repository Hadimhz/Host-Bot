const { MessageEmbed }= require('discord.js');
const moment = require('moment');
const { mem, cpu, os } = require('node-os-utils');
const { stripIndent } = require('common-tags');
module.exports.run = async (client, message, args) => {
    const d = moment.duration(message.client.uptime);
    const days = (d.days() == 1) ? `${d.days()} day` : `${d.days()} days`;
    const hours = (d.hours() == 1) ? `${d.hours()} hour` : `${d.hours()} hours`;
    const minutes = (d.hours() == 1) ? `${d.minutes()} minutes` : `${d.minutes()} minutes`;
    const seconds = (d.hours() == 1) ? `${d.seconds()} seconds` : `${d.seconds()} seconds`;
    const ramUsed = process.memoryUsage().heapUsed / 1024 / 1024;
    
    const clientStats = stripIndent`
    Users     :: ${message.client.users.cache.size}
    Channels  :: ${message.client.channels.cache.size}
    Uptime    :: ${days}, ${hours} ${minutes}, ${seconds}
    `;
    const { totalMemMb, usedMemMb } = await mem.info();
    const serverStats = stripIndent`
    OS        :: ${await os.oos()}
    CPU       :: ${cpu.model()}
    Cores     :: ${cpu.count()}
    CPU Usage :: ${await cpu.usage()} %
    RAM       :: ${totalMemMb} MB
    RAM Usage :: ${Math.round(ramUsed * 100) / 100} MB 
    `;
    let now = Date.now()
    let msg = await message.channel.send({embeds: [new MessageEmbed().setTitle("Pinging...")]})
    const embed = new MessageEmbed()
    .setTitle(`Bot\'s Statistics`)
    .addField('Commands fetched', `\`${client.commands.size}\` commands`, true)
    .addField(`> 🖥 API Latency:`, `**${client.ws.ping}ms**`, true)
    .addField(`> 🤖 Bot Latency:`, `**${Math.round(Date.now() - now)}ms**`, true)
    .addField(`Client`, `\`\`\`asciidoc\n${clientStats}\`\`\``)
    .addField(`Server`, `\`\`\`asciidoc\n${serverStats}\`\`\``)
    .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor('#36393F');
    msg.edit({embeds: [embed]});
};
module.exports.info = {
    name: 'stats',
    description: "A stats command that shows detailed information about the bot",
    requiredPermission: null,
    aliases: ['statistics', 'ping', 'uptime'],
} 
