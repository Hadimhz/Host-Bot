const { updateCache } = require('../../../index');
const { MessageEmbed } = require('discord.js')
const config = require('../../../../config.json');

module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has(config.discord.roles.botdev)) return;

    const embed = new MessageEmbed()
    .setTitle('Cache Update')
    .setColor('#DBC326')
    .setDescription('Updating cache...')
    .setTimestamp()

    let msg = await message.channel.send({
        content: '\u200b',
        embeds: [embed]
    })

    await updateCache();

    const newEmbed = new MessageEmbed()
    .setTitle('Cache Update')
    .setColor('#16E61D')
    .setDescription('Cache updated!')
    .setTimestamp()

    msg.edit({
        content: '\u200b',
        embeds: [newEmbed]
    });
}

module.exports.info = {
    name: "update",
    description: "Update the bot's cache",
    aliases: ['u'],
}