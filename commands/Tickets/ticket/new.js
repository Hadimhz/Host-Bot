const {
    MessageEmbed,
    MessageButton,
    MessageActionRow
} = require("discord.js")

module.exports.run = async (client, message, args) => {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('donated')
            .setLabel('Donated')
            .setStyle('PRIMARY'),
        )
        .addComponents(
            new MessageButton()
            .setCustomId('serervi')
            .setLabel('Server issues')
            .setStyle('SUCCESS'),
        )
        .addComponents(
            new MessageButton()
            .setCustomId('accounti')
            .setLabel('Account issues')
            .setStyle('SUCCESS'),
        )
        .addComponents(
            new MessageButton()
            .setCustomId('report')
            .setLabel('Report user')
            .setStyle('DANGER'),
        )
        .addComponents(
            new MessageButton()
            .setCustomId('other')
            .setLabel('Other')
            .setStyle('SECONDARY'),
        );
    const embed = new MessageEmbed()
        .setTitle('Pick What type of ticket')
        .setColor('GREEN')
        .setDescription('Hey ' + message.author.username + ', It seems like you want to make a ticket.\n\nPlease pick from a ticket below too open a ticket.')
    message.channel.send({
        embeds: [embed],
        components: [row]
    })
}
module.exports.info = {
    name: 'new',
    description: "Makes a new Ticket"
}
