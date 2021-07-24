const { MessageEmbed } = require('discord.js')
const userdb = require('../../../database/schemas/UserData')

module.exports.run = async (client, message, args) => {
    try {
        if (!args[0]) return message.reply('Who are you checking for user Data?')
        e = await message.channel.send(`Fetching users Data...`)
        setTimeout(() => {
            message.guild.members.fetch()
        }, 5000)
        const person = message.mentions.users.first() || await message.guild.members.cache.get(args[0]);
        if(!person) return e.edit('User doesn\'t exist ')
        const userData = await userdb.findOneAndDelete({
            userID: person.id
        });
        if(!userData) return e.edit('<@' + person + '> Doesn\'t have a account or Isn\'t linked')
        const embed = new MessageEmbed()
        .setTitle(`${person.username || person.user.username}'s Old Data`)
        .setDescription('```js\n' + userData + '```')
        message.author.send({embeds: [embed]})
        message.channel.send('User Data Deleted, Sent a Dm with their data')
    } catch (err) {
        console.log(err)
    }
}


module.exports.info = {
    name: "forceunlink",
    description: "Unlinks a User",
    requiredPermission: "ADMINISTRATOR",
    aliases: []
}