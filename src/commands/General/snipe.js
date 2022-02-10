const config = require(ROOT_PATH + "/../config.json");
const { MessageEmbed } = require('discord.js')
const Discord = require('discord.js')
module.exports.run = async (client, message, args) => {
    if (args[0]) {
        if (args[0].toLowerCase() == 'dump' && message.member.roles.cache.get(config.discord.roles.botdev) != null) {
            let file = new Discord.MessageAttachment(Buffer.from(JSON.stringify(Array.from(client.messageSnipes)), "utf8"), "Snipes-Dump.json");
            message.author.send({
                files: [file]
            });
            message.channel.send('Check your dms.');
            return;
        }

        /**
         *  -- Can only be used by staff --
         * Usage: <prefix>snipe purge [user | *] <reason>
         * if user is not specified the bot will purge all the logs for that current channel
         * if you pass * as user, it will completely dump the logs.
         */

        if (args[0].toLowerCase() == 'purge' && (message.member.roles.cache.get(config.discord.roles.staff) != null || message.member.roles.cache.get(config.discord.roles.botdev) != null)) {
            //return console.log('User trying to purge');
            let reason = args.slice(1);

            if (reason.length == 0) {
                message.channel.send({
                    embeds: [new MessageEmbed().setTitle('Snipe Dump')
                        .setDescription(` \*  -- Can only be used by staff --\n\* Usage: ${config.discord.bot.prefix}snipe purge [user | \*] <reason>\n\* if user is not specified the bot will purge all the logs for that current channel\n\* if you pass \* as user, it will completely dump the logs.`)
                        .setColor('BLUE')
                    ]
                })
                return;
            }
            let target;
            if (reason[0] == '*' || message.guild.members.cache.get((reason[0].match(/[0-9]{18}/) == null ? reason[0] : reason[0].match(/[0-9]{18}/)[0]))) {
                target = (!reason[0].match(/[0-9]{18}/) || reason[0].match(/[0-9]{18}/).length == 0) ? reason[0] : reason[0].match(/[0-9]{18}/)[0];
                reason.shift();
            }

            if (reason.length == 0) {
                message.channel.send('You are required to provide a reason when purging snipe logs.')
                return;
            }
            let file;

            if (target != '*') {
                file = new Discord.MessageAttachment(Buffer.from(JSON.stringify(client.messageSnipes.get(message.channel.id).filter(x => x.member == target)), "utf8"), "Snipe-Logs.json");
                client.messageSnipes.set(message.channel.id, client.messageSnipes.get(message.channel.id).filter(x => x.member != target));
            } else if (message.member.roles.cache.get(config.discord.roles.botdev) != null && message.member.roles.cache.get(config.discord.roles.botdev) != null) {
                file = new Discord.MessageAttachment(Buffer.from(JSON.stringify(Array.from(client.messageSnipes)), "utf8"), "Snipe-Logs.json");

                client.messageSnipes.clear();
            } else {
                message.channel.send("You don't have permission to do this.");
                return;
            }

            client.channels.cache.get(config.discord.channels.snipelogs).send({
                content: `${message.member} purged ${target == '*'? `all messages`: `${target}'s messages in ${message.channel}`} for the reason: ${reason}.`,
                files: [file]
            })
            message.channel.send('purged.')
            return;
        }

        let isntNumber = isNaN(args[0])
        if (isntNumber == true) return message.channel.send({
            embeds: [new MessageEmbed().setDescription(`Please provide a number!`)]
        })
    }
    let embed3 = new MessageEmbed().setDescription(`Theres nothing to snipe`)

    let snipe = client.messageSnipes.get(message.channel.id)

    if (snipe == null) return message.channel.send({
        embeds: [embed3]
    })

    snipe = [...snipe.values()]

    //Reversing the array 
    snipe.reverse();

    // getting the number
    let number = 0;

    if (args[0] == null) number = 0;
    else number = (parseInt(args[0]) - 1);
    //setting a min and max
    if (number >= snipe.length) number = snipe.length - 1;
    if (number < 0) number = 0;

    // getting the message
    let snipedMessage = snipe[number];

    //console.log("SNIPE", snipedMessage, snipe, number);

    //sending the message
    const embed = new MessageEmbed()
        .setTitle(`Message ${snipedMessage.action} by ${snipedMessage.member.user.tag}`)
        .setDescription("`" + snipedMessage.message + "`")
        .setFooter({text: `${number + 1}/${snipe.length}`})
        .setTimestamp(snipedMessage.timestamp)
        .setColor("GREEN");
    message.channel.send({
        embeds: [embed]
    });
}


module.exports.info = {
    name: 'snipe',
    description: "Gets the messages that were deleted or edited."
}