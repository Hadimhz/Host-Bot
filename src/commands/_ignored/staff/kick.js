const Discord = require('discord.js')
const config = require(ROOT_PATH + "/../config.json");
module.exports.run = async (client, message, args) => {

    let user = message.mentions.users.first()
    let member = message.mentions.members.first()

    if(!user) return message.channel.send(`🚧 | You didnt mention anyone.`)
    if(member === message.member) return message.channel.send('🚧 | You cant Kick yourself.')

    let HighRole = message.member.roles.highest.position;
    let getHighRole = member.roles.highest.position;

    if (HighRole < getHighRole) return message.channel.send(`🚧 | You cant use this command on users that have bigger role than yours.`)
    if (HighRole === getHighRole) return message.channel.send(`🚧 | You cant use this command on users that have same role as you.`)
    if(user == client.user) return message.channe
    let reason = args.splice(1).join(' ') || `${message.author.tag} Kicked with No reason.`

    message.guild.members.kick(user, {reason})

        .then(() => {

            message.channel.send(`✅ | Succesfully kicked user **${user.tag}**.`)

            const embed = new Discord.MessageEmbed()
            .setAuthor({name: `${client.user.username} | Kick`, iconURL: client.user.avatarURL()})
            .addField(`✅ | Kick`, `> Moderator: **${message.author.tag}**\n> User Kicked: **${user.tag}**\n> Reason: **${reason || 'None'}**`)
            .setThumbnail(`${message.guild.iconURL({ dynamic:true }) || "https://cdn.discordapp.com/embed/avatars/0.png"}`)
            .setColor(message.guild.me.displayHexColor)
            .setTimestamp()
            client.channels.cache.get(config.discord.channels.modLogs).send({embeds: [embed]})
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