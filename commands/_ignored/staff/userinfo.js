const { MessageEmbed } = require('discord.js');
const userdb = require('../../../database/schemas/UserData')

module.exports.run = async (client, message, args) => {
    try {
        if (!args[0]) return message.reply('Who are you checking for user Data?')
        e = await message.channel.send(`Fetching users Data...`)
        setTimeout(() => {
            message.guild.members.fetch()
        }, 5000)
        const person = message.mentions.users.first() || await message.guild.members.cache.get(args[0]);
        const userData = await userdb.findOne({
            userID: person.id
        });
        if (!userData) return e.edit('You or the person you mentioned doesn\'t have any Data. Do they have a account?');
        const embed = new MessageEmbed()
            .setTitle(`${person.username || person.user.username}` + "'s Data")
            .setDescription('```js\n' + userData + '\n```')
        message.author.send({
            embeds: [embed]
        })
        e.edit(`Fetched ${person.username || person.user.username}'s Data, Sent a Dm with info`)
    } catch (err) {
        console.log(err)
    }
}

module.exports.info = {
    name: "userinfo",
    description: "Get Info about a user",
    requiredPermission: "ADMINISTRATOR",
    aliases: ['ui']
}