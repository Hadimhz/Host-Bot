const Discord = require("discord.js");
const BaseCommand = require("../../BaseClasses/BaseCommand");

module.exports = class Unban extends BaseCommand {
    constructor() {
        super({
            aliases: ["unban"],
            description: "Unban a Member",
            name: "unban",
            permissions: ["KICK_MEMBERS"],
            usage: "unban <@user>"
        });
    }

    async run(client, message, args) {

        if(!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send(`🚧 | You do not have enough permissions to use this command.`)

        if(!args[0]) return message.channel.send(`🚧 | Specify **ID** of the **user** you want to **unban**.`)

        if(message.mentions.users.first()) return message.channel.send(`🚧 | Use ID's to unban people.`)

        let member = await client.users.fetch(args[0])

        message.guild.bans.fetch().then(bans => {

        const user = bans.find(ban => ban.user.id === member.id);

        if(!user) return message.channel.send('🚧 | That user is not banned.')
    
        let reason = args.slice(1).join(" ");

        if (user) {
            
            message.guild.members.unban(member).then(() => {

                message.channel.send(`✅ | Succesfully unbanned user **${member.tag}**.`)

                const embed = new Discord.MessageEmbed()
                .setAuthor(`${client.user.username} | Unban`, client.user.avatarURL())
                .addField(`✅ | Unban`, `> Moderator: **${message.author.tag}**\n> User Unbanned: **${member.tag}**\n> Reason: **${reason || 'None'}**`)
                .setThumbnail(`${message.guild.iconURL({ dynamic:true })}`)
                .setColor(message.guild.me.displayHexColor)
                .setTimestamp()
                client.channels.cache.get('866302681512935444').send({embeds: [embed]}) // config.DiscordChannels.modLogs

                }).catch((error) => { message.channel.send(`\`\`\`js\n${error}\`\`\``) })
            }
        })
}
    
module.exports.info = {
    name: 'unban',
    description: "UNbans a user thats banned from server.",
    aliases: ['unban'],
}
