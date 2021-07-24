const Discord = require('discord.js')
const config = require("../../config.json")
module.exports.run = (client, message, args) => {

        let user = message.mentions.users.first()
        let member = message.mentions.members.first()

        if(!user) return message.channel.send(`🚧 | You didnt mention anyone.`)
        if(member === message.member) return message.channel.send('🚧 | You cant kick yourself.')

        let HighRole = message.member.roles.highest.position;
        let getHighRole = member.roles.highest.position;
        
        if (HighRole < getHighRole) return message.channel.send(`🚧 | You cant use this command on users that have bigger role than yours.`)
        if (HighRole === getHighRole) return message.channel.send(`🚧 | You cant use this command on users that have same role as you.`)

        let reason = args.splice(1).join(' ');
        let memberkick = await message.guild.members.fetch(user);

        memberkick.kick(reason || 'None')

        .then(() => {

            message.channel.send(`✅ | Succesfully kicked user **${user.tag}**.`)

            const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} | Kick`, client.user.avatarURL())
            .addField(`✅ | Kick`, `> Moderator: **${message.author.tag}**\n> User Kicked: **${user.tag}**\n> Reason: **${reason || 'None'}**`)
            .setThumbnail(`${message.guild.iconURL({ dynamic:true })}`)
            .setColor(message.guild.me.displayHexColor)
            .setTimestamp()
            client.channels.cache.get(config.DiscordChannels.modLogs).send({embeds: [embed]})
        })

        .catch((error) => {
            message.channel.send(`\`\`\`js\n${error}\`\`\``)
          })
}

module.exports.info = {
    name: 'kick',
    description: "Kick someone from the server.",
    requiredPermission: 'KICK_MEMBERS',
}
