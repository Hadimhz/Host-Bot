const Discord = require('discord.js')
const config = require("../../config.json")
module.exports.run = (client, message, args) => {
  
        if(!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(`🚧 | You do not have enough permissions to use this command.`)

        let user = message.mentions.users.first()
        let member = message.mentions.members.first()

        if(!user) return message.channel.send(`🚧 | You didnt mention anyone.`)
        if(member === message.member) return message.channel.send('🚧 | You cant kick your self.')

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
            client.channels.cache.get(onfig.DiscordChannels.modLogs).send({embed: [embed]})
        })

        .catch((error) => {
            const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`\`\`\`js\n${error}\`\`\``)
            .setColor(message.guild.me.displayHexColor)
            .setThumbnail(client.user.avatarURL())
            .setTimestamp()
            .setFooter(client.user.username, client.user.avatarURL())
            message.channel.send({embed: [embed]})
        })
}

module.exports.info = {
    name: 'kick',
    description: "Kick someone from the server.",
    requiredPermission: 'KICK_MEMBERS,
    aliases: null,
}
