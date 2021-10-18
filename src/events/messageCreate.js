const { findCommand } = require("../utils/commandHandler");
const { MessageEmbed } = require("discord.js");
const config = require(ROOT_PATH + "/../config.json");
const { client } = require("../index");
const chalk = require("chalk");

client.on('messageCreate', async (message) => {
        if(message.channel.type == "DM") {
            if(message.author.bot) return
        const embed = new MessageEmbed()
        .setTitle(`New DM From ${message.author.tag}`)
        .setDescription(message.content.toString())
        .setColor("GREEN")
        .setFooter(`${message.author.id}`)
        .setTimestamp()
        return client.channels.cache.get(config.discord.channels.modLogs).send({embeds:[embed]})
    }
    if (message.channel.type == "DM" || message.author.bot
        || message.guild.id != config.discord.guild || !message.content.startsWith(config.discord.bot.prefix)) return;
    if(message.content.startsWith(config.discord.bot.prefix + 'prefix')) {
        return message.react('✅')
    }
    let args = message.content.trim().slice(config.discord.bot.prefix.length).split(/ +/);

    let cmd = findCommand([...args], client.commands, message);

    if (cmd) {
        let commandTree = args.slice(0, cmd.depth);
        args = args.slice(cmd.depth);

        if (!cmd.subCommands) {
            try {
                cmd.run(client, message, args, commandTree);
            } catch (error) {
                console.log(chalk.bgRedBright("[ERROR]"), `An error occured while trying to execute the ${cmd.name} command!`);
                console.log(error);
            };
        } else {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle(commandTree.join(" ") + "'s subcommands")
                        .setColor("PURPLE")
                        .setDescription(cmd.subCommands.map(x => `**${x.name}** - \`${x.description}\`\n*usage:* \`${x.usage}\``).join('\n\n'))
                        .setFooter(`Executed by ${message.author.tag}`)
                        .setTimestamp()
                ]
            });

        };

    };
});