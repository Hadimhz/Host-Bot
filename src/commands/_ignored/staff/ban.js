const Discord = require('discord.js')
const config = require("../../../config.json")
module.exports.run = async (client, message, args) => {

        let user = message.mentions.users.first()
        let member = message.mentions.members.first()

        if(!user) return message.channel.send(`You didnt mention anyone.`)
        if(member === message.member) return message.channel.send('You cant ban yourself.')

        let HighRole = message.member.roles.highest.position;
        let getHighRole = member.roles.highest.position;

        if (HighRole < getHighRole) return message.channel.send(`You cant use this command on users that have bigger role than yours.`)
        if (HighRole === getHighRole) return message.channel.send(`You cant use this command on users that have same role as you.`)

        let reason = args.splice(1).join(' ') || `${message.author.tag} Banned with No reason.`

        message.guild.members.ban(user, {reason})

        .catch((error) => {
            message.channel.send(`\`\`\`js\n${error}\`\`\``)
          })

   }

module.exports.info = {
    name: 'ban',
    description: "Bans a member.",
    requiredPermission: "BAN_MEMBERS"
}
