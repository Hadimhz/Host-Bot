const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")

module.exports.run = async (client, message, args) => {
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('close')
					.setLabel('Close Ticket')
					.setStyle('SUCCESS'),
			)
            .addComponents(
				new MessageButton()
					.setCustomId('keep open')
					.setLabel('Keep Open')
					.setStyle('DANGER'),
			)
const embed = new MessageEmbed()
    .setTitle('Close Ticket?')
    .setColor('GREEN')
    .setDescription('Do you want to close or keep this ticket open?')
    message.channel.send({embeds: [embed], components: [row]})
            }
    module.exports.info = {
        name: 'close',
        description: "Close a ticket"
    }
    
