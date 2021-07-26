const { DiscordAPIError, MessageEmbed } = require('discord.js');
const {
    inspect
} = require('util');
module.exports.run = async (client, message, args) => {
    if(!args[0]) return messsage.channel.send('what do you want to test?')
    const code = args.join(" ");
    try {
    let evaled = eval(code);
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
            if (evaled.length > 2000) {
                console.log(evaled)
            const embed = new MessageEmbed()
            .setTitle('Evaled')
            .addField('Input', '```js\n' + code + '\n```')
            .addField(`OutPut`, `Output too long console logged it`)
            message.channel.send({embeds: [embed]})
            } else { 
                const embed = new MessageEmbed()
            .setTitle('Evaled')
            .addField('Input', '```js\n' + code + '\n```')
            .addField(`OutPut`, '```js\n' + evaled + '\n```')
            message.channel.send({embeds: [embed]})
            }
} catch(err) {
    const embed = new MessageEmbed()
    .setTitle('ERROR')
    .addField(`Input`, '```js\n' + code + '\n```')
    .addField(`OutPut`, '```js\n' + err + '\n```')
    message.channel.send({embeds: [embed]})
}}

module.exports.info = {
    name: "eval",
    description: "eval code.",
    requiredPermission: "ADMINISTRATOR",

}