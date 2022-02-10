const Discord = require('discord.js')
const config = require("../../../config.json")
module.exports.run = async (client, message, args) => {

        if(!args[0]) return message.channel.send(`Specify **ID** of the **user** you want to **unban**.`)

        if(message.mentions.users.first()) return message.channel.send(`Use ID's to unban people.`)

        let member = await client.users.fetch(args[0])

        message.guild.bans.fetch().then(bans => {

        const user = bans.find(ban => ban.user.id === member.id);

        if(!user) return message.channel.send(`That user is not banned.')

        let reason = args.slice(1).join(" ");

        if (user) {

            message.guild.members.unban(member).then(() => {

                message.channel.send(`Succesfully unbanned user **${member.tag}**.`)

                const embed = new Discord.MessageEmbed()
                .setAuthor(`${client.user.username} | Unban`, client.user.avatarURL())
                .addField(`Unban`, `> Moderator: **${message.author.tag}**\n> User Unbanned: **${member.tag}**\n> Reason: **${reason || 'None'}**`)
                .setThumbnail(`${message.guild.iconURL({ dynamic:true })}`)
                .setColor(message.guild.me.displayHexColor)
                .setTimestamp()
                client.channels.cache.get(config.DiscordChannels.modLogs).send({embeds: [embed]})

                }).catch((error) => { message.channel.send(`\`\`\`js\n${error}\`\`\``) })
            }
        })
}

module.exports.info = {
    name: 'unban',
    description: "Unbans a user thats banned from server.",
    requiredPermission: "BAN_MEMBERS"
}
