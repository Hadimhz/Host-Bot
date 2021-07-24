const userdb = require('../../../database/schemas/UserData')
const config = require('../../../config.json')
const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, message, args) => {
    e = await message.channel.send('Checking DataBase...')
    const userData = await userdb.findOneAndDelete({
        userID: message.author.id
    });
    if (!userData) return e.edit(`You don\'t Seem to have a account link, \`${config.discord.bot.prefix}user link\` to link your account`);
    const embed = new MessageEmbed()
        .setTitle("Account Unlink")
        .setColor("#36393F")
        .setDescription(`Unlinked your account, do \`${config.discord.bot.prefix}user link\` To relink your account`)
    e.edit({content: ' ', embeds: [embed]})
}
module.exports.info = {
    name: "unlink",
    description: "Unlink your account.",
    aliases: ['ul'],
}
