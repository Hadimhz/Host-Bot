const { MessageEmbed } = require('discord.js')
const config = require(ROOT_PATH + '/config.json');

module.exports.run = (client, message, args) => {

    let { log: parsed, findCommand } = require(ROOT_PATH + '/utils/commandHandler');

    let embed = new MessageEmbed()
        .setTitle("Help!").setColor("BLUE").setDescription("Commands Help list");

    if (args[0] == null) {
        for (const category of parsed.categories.filter(x => x.name != '_ignored')) {
            embed.addField(category.name, "`" + category.children.map(x => x.name).join('`, `') + "`");
        }
    } else {

        let cmd = findCommand([...args], client.commands);

        if (cmd == null) {
            embed.setDescription(`Couldn't find a command with the name ${args[0]}.`).setColor("RED");
        } else {
            let usage = config.prefix + cmd.usage;

            let aliases = "`" + cmd.aliases.join('`, `') + "`";
            let subCommands = cmd.subCommands != null ? `\`${cmd.subCommands.map(x => x.name).join('`, `')}\`` : null;

            let help = [
                `**name:** ${cmd.name}`,
                `**description:** ${cmd.description}`,
                cmd.aliases.length == 0 ? null : `**aliases:** ${aliases}`,
                `**usage:** ${usage}`,
                `**requiredPermission:** ${cmd.requiredPermission == null ? "none" : cmd.requiredPermission}`,
                subCommands != null ? `**subcommands:** ${subCommands}` : null
            ]

            embed.addField(`${args.slice(0, cmd.depth).join(' ')}'s Help:`, help.filter(x => x != null).join('\n'))
        }

    }

    message.channel.send({embeds: [embed]});
}


/**
 * This is completely optional...
 */

module.exports.info = {
    name: 'help',// default = file name (without the extention)
    description: "Shows you the list of commands.",// default is "None"
    requiredPermission: null,// default is null
    aliases: ['?', "h"], // default is null
    usage: '[command] [subcommand]' // default is null
}