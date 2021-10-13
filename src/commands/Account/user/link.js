const userdb = require('../../../database/schemas/UserData')
const validator = require('validator');
const config = require('../../../config.json');
const { panel } = require('../../../index');
const Discord = require('discord.js');
const { genPassword } = require('./user');
const Transporter = require('../../../utils/Transporter');

module.exports.run = async (client, message, args) => {

    if (!config.email.enabled) return;

    // Check to see if they already have an account
    const userData = await userdb.findOne({ userID: message.author.id });
    if (userData) return message.reply({
        content: "You already have a `panel account` linked to your discord account!"
    })

    // Locate the category
    let category = message.guild.channels.cache.get(config.discord.tickets.accountCreation)

    let channel = await message.guild.channels.create(message.author.tag, {
        parent: category.id,
        permissionOverwrites: [
            {
                id: message.author.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
            },
            {
                id: message.guild.id,
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
            }
        ]
    }).catch(e => { });

    // Tell the user to check the channel.
    message.reply(`Please check <#${channel.id}> to create an account.`);

    let code = genPassword(20);

    // Questions user needs to answer
    let questions = [
        {
            id: "email",
            question: "Whats your email? *(must be a valid email)*" + "\n\n" + "*This will unlink other accounts if you have them linked*",
            filter: (m) => m.author.id === message.author.id,
            afterChecks: [
                {
                    check: (msg) => validator.isEmail(msg.toLowerCase().trim()),
                    errorMessage: "The email must be valid.",
                },
                {
                    check: async (msg) => (await panel.fetchUsers({
                        filter: {
                            key: "email",
                            value: msg.trim().toLowerCase()
                        }
                    })).success,
                    errorMessage: "Couldn't find a panel account with that email.",
                }
            ],
            callback: (value) => {
                new Transporter().setSender(config.email.from)
                    .setReceiver(value).setSubject("Identity Verification!")
                    .setText("Someone has attempted to link their discord account to your " + message.guild.name + " panel account! Your code is: " + code
                        + "\n\n" + "If that was not you, safely ignore this message. ")
                    .send();

            },
            time: 30000,
            value: null
        }, {
            id: "code",
            question: "You have been sent an email with a code to confirm your identity."
                + "\n" + "You have 2 minutes to post the code in this channel.",
            filter: (m) => m.author.id === message.author.id,
            if: () => config.email.enabled,
            afterChecks: [
                {
                    check: (msg) => msg.trim() == code,
                    errorMessage: "The code must be the exact one sent to your email.",
                }
            ],
            time: 120000,
            value: null
        }
    ];

    // prompt the user with the questions.
    let msg = null;

    questions = questions.filter(q => q.if == null || q.if() == true);

    for (let question of questions) {
        if (msg == null) {
            msg = await channel.send({
                content: `<@!${message.member.id}>`,
                embeds: [new Discord.MessageEmbed()
                    .setColor(0x36393e)
                    .setDescription(question.question)
                    .setFooter("You can type 'cancel' to cancel the request")]
            });
        } else {
            msg.edit({
                content: `<@!${message.member.id}>`,
                embeds: [msg.embeds[0].setDescription(question.question)]
            });
        }

        let awaitMessages = await channel.awaitMessages({
            filter: (m) => m.author.id === message.author.id,
            max: 1,
            time: question.time,
            errors: ['time'],
        }).catch(x => {
            channel.send("User failed to provide an input!\nAccount Cancelled! :thumbsup:");
            setTimeout(() => {
                channel.delete();
            }, 5000);
            return;
        });
        if (!awaitMessages) return;

        // Log the value...

        question.value = awaitMessages.first().content.trim();

        await awaitMessages.first().delete();

        if (question.value == 'cancel') {

            msg.delete();
            channel.send("Cancelled! :thumbsup:");

            setTimeout(() => {
                channel.delete();
            }, 5000);
            return;
        }

        for (const aftercheck of question.afterChecks) {
            if ((await aftercheck.check(question.value)) == false) {
                channel.send(aftercheck.errorMessage);
                channel.send("Account Cancelled! :thumbsup:");
                setTimeout(() => {
                    channel.delete();
                }, 5000);
                return;
            };
        }

        if (question.callback != null) question.callback(question.value);

    }

    const { data } = await panel.fetchUsers({
        filter: {
            key: "email",
            value: questions.find(question => question.id == 'email').value.toLowerCase()
        }
    });



    msg.edit({
        content: `<@!${message.member.id}>`,
        embeds: [msg.embeds[0]
            .setDescription('Attempting to link your account...\n\n>>> '
                + questions.map(question => `**${question.id}:** ${question.value.toLowerCase()}`).join('\n'))
            .setFooter('').setTimestamp()]
    });

    await userdb.findOneAndRemove({ email: questions.find(question => question.id == 'email').value.toLowerCase() })
    await userdb.create({
        userID: message.author.id,
        consoleID: data.id,
        email: data.email,
        username: data.username,
        createdTimestamp: Date.now(),
    })


    msg.edit({
        content: "Hello! You created an new account, Heres the login information",
        embeds: [new Discord.MessageEmbed()
            .setColor("GREEN")
            .setDescription("URL: " + config.pterodactyl.hosturl + "\n" + "Username: " + data.username
                + "\n" + "Email: " + data.email)
            .setFooter("Please note: It is recommended that you change the password")]
    })

}

module.exports.info = {
    name: "link",
    description: "Links your account to a panel account.",
}
