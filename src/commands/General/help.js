const { MessageEmbed } = require('discord.js')
const config = require("../../config.json")
module.exports.run = (client, message, args) => {

    let { log: parsed, findCommand } = require(ROOT_PATH + '/utils/commandHandler');
    let rrole;
    let embed = new MessageEmbed()
        .setTitle("Commands Help!").setColor("#36393F").setDescription(`Here is a list of commands that you can use! Use \`${config.discord.bot.prefix}help <name>\` to get help with a specific command!`)
        .setFooter(`Requested by ${message.author.tag}`).setTimestamp();

    if (args[0] == null) {
        for (const category of parsed.categories.filter(x => x.name != '_ignored')) {
            embed.addField(category.name, "`" + category.children.map(x => x.name).join('`, `') + "`");
        }
    } else {

        let cmd = findCommand([...args], client.commands);

        if (cmd == null) {
            embed.setDescription(`Couldn't find a command with the name ${args[0]}.`).setColor("RED");
        } else {
            let usage = config.discord.bot.prefix + cmd.usage;

            let aliases = "`" + cmd.aliases.join('`, `') + "`";
            let subCommands = cmd.subCommands != null ? `\`${cmd.subCommands.map(x => x.name).join('`, `')}\`` : null;
            rrole = cmd.requiredRole == null ? "none" : cmd.requiredRole;
            if(rrole != "none") rrole = message.guild.roles.cache.find(r => r.id === rrole);
            let help = [
                `**name:** ${cmd.name}`,
                `**description:** ${cmd.description}`,
                cmd.aliases.length == 0 ? null : `**aliases:** ${aliases}`,
                `**usage:** ${usage}`,
                `**requiredPermission:** ${cmd.requiredPermission == null ? "none" : cmd.requiredPermission}`,
                `**requiredRoles:** ${rrole}`,
                subCommands != null ? `**subcommands:** ${subCommands}` : null
            ]

            embed.addField(`${args.slice(0, cmd.depth).join(' ')}'s Help:`, help.filter(x => x != null).join('\n'))
        }

    }

    message.channel.send({embeds: [embed]});
}

module.exports.info = {
    name: 'help',// default = file name (without the extention)
    description: "Shows you the list of commands.",// default is "None"
    requiredPermission: null,// default is null
    aliases: ['?', "h"], // default is null
    usage: '[command] [subcommand]' // default is null
}
