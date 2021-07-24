const Discord = require("discord.js");
const BaseCommand = require("../../BaseClasses/BaseCommand");

module.exports = class Ban extends BaseCommand {
    constructor() {
        super({
            aliases: ["ban"],
            description: "ban a Member",
            name: "ban",
            permissions: ["KICK_MEMBERS"],
            usage: "ban <@user>"
        });
    }

    async run(client, message, args) {

        if(!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send(`🚧 | You do not have enough permissions to use this command.`)

        let user = message.mentions.users.first()
        let member = message.mentions.members.first()

        if(!user) return message.channel.send(`🚧 | You didnt mention anyone.`)
        if(member === message.member) return message.channel.send('🚧 | You cant kick your self.')

        let HighRole = message.member.roles.highest.position;
        let getHighRole = member.roles.highest.position;
        
        if (HighRole < getHighRole) return message.channel.send(`🚧 | You cant use this command on users that have bigger role than yours.`)
        if (HighRole === getHighRole) return message.channel.send(`🚧 | You cant use this command on users that have same role as you.`)

        let reason = args.splice(1).join(' ');

        message.guild.members.ban(user)

        .then(() => {

            message.channel.send(`✅ | Succesfully banned user **${user.tag}**.`)

            const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} | Ban`, client.user.avatarURL())
            .addField(`✅ | Ban`, `> Moderator: **${message.author.tag}**\n> User Banned: **${user.tag}**\n> Reason: **${reason || 'None'}**`)
            .setThumbnail(`${message.guild.iconURL({ dynamic:true })}`)
            .setColor(message.guild.me.displayHexColor)
            .setTimestamp()
            client.channels.cache.get('866302681512935444').send({embeds: [embed]}) // config.DiscordChannels.modLogs
        })

        .catch((error) => {
            message.channel.send(`\`\`\`js\n${error}\`\`\``)
          })

    }

}