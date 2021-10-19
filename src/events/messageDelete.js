const { client } = require("../index");
const chalk = require("chalk");
const { MessageEmbed } = require('discord.js')
const config = require(ROOT_PATH + "/../config.json");
client.on('messageDelete', async (message) => {
    if (message.author == null || message.author.bot == true) return;
    let logChannel = client.channels.cache.get(config.discord.channels.messageLogs);

    if (!message.content != 0 && logChannel) {

        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;
        if (message.channel.type !== 'GUILD_TEXT') return;
        if (message.author == null) return;

        const description = message.cleanContent || "message had no content"
        const descriptionfix = description.substr(0, 600);
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setThumbnail(message.author.avatarURL)
            .addField("Author ", `${message.author.tag} (ID: ${message.author.id})`)
            .addField("Message Content:", `${descriptionfix}`)
            .setTimestamp()
            .setFooter("Message delete in " + message.channel.name);
        logChannel.send({ embeds: [embed] });

    }
    if (message.author.bot || !message.content) return;

    let data = {
        message: message.content,
        member: message.member,
        timestamp: Date.now(),
        action: "delete"
    };
    if (client.messageSnipes.get(message.channel.id) == null) client.messageSnipes.set(message.channel.id, [data])
    else client.messageSnipes.set(message.channel.id, [...client.messageSnipes.get(message.channel.id), data]);

    client.messageSnipes.set(message.channel.id, client.messageSnipes.get(message.channel.id).filter(x => (Date.now() - x.timestamp) < 300000 && x != null));
});