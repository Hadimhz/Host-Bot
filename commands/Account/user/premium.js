const { MessageEmbed } = require('discord.js');
const userprem = require('../../../database/schemas/UserPrem')
const userdb = require('../../../database/schemas/UserData')
const config = require('../../../config.json')
module.exports.run = async (client, message, args) => {
    //Fetching the members so stuff doesn't come back as undefined
    message.guild.members.fetch()
    const person = message.mentions.users.first() || await message.guild.members.cache.get(args[0]) || message.author;
    //Getting Users console ID
    const userData = await userdb.findOne({
        userID: person.id
    });
    if (message.author.id === person.id && !userData) return message.reply({
        content: "You do not have a `panel account` linked to your discord!" +
            "\n" + `Use \`${config.discord.bot.prefix}user new\` to create an account and get started or \`${config.discord.bot.prefix}user link\` to link a existing account.`
    })
    if (!userData) return message.channel.send('The User you mentioned doesn\'t have a account or isn\'t linked.')
    // This is where you get the amount of servers the user has and has used
    const pp = await userprem.findOne({
        consoleID: userData.consoleID
    });
    if (!pp) return message.reply(`You have No premium servers, You can buy them for ${config.premiumprice} by donating to ${config.donationlink}`)
    if (pp.amount === '0') return message.reply(`You have No premium servers, You can buy them for ${config.premiumprice} by donating to ${config.donationlink}`)
    const embed = new MessageEmbed()
        .setTitle('Premium Servers For ' + `${person.tag || person.user.tag}`)
        .setDescription(`${pp.used} out of ${pp.amount} Servers used`)
        .setColor('BLURPLE')
    message.reply({
        embeds: [embed]
    })
}

module.exports.info = {
    name: "premium",
    description: "Get your premium user data",
    aliases: ['p']
}