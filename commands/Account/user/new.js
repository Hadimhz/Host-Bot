const UserData = require('../../../database/schemas/UserData')
const validator = require('validator');
const config = require('../../../config.json');
const { panel } = require('../../../index');
const Discord = require('discord.js');
const { genPassword } = require('./user');

// Questions user needs to answer
let questions = [
    {
        id: "username",
        question: "What should your username be? (**Please dont use spaces or special characters**)", // The questions...
        filter: (m) => m.author.id === message.author.id, // Filter to use...
        afterChecks: [{
            check: (msg) => msg.trim().split(" ").length == 1,
            errorMessage: "username must not contain any spaces",
        }],
        time: 30000, // how much time a user has to answer the question before it times out
        value: null // The user's response.
    }, {
        id: "email",
        question: "Whats your email? *(must be a valid email)*",
        filter: (m) => m.author.id === message.author.id,
        afterChecks: [
            {
                check: (msg) => validator.isEmail(msg.toLowerCase().trim()),
                errorMessage: "the email must be valid.",
            }
        ],
        time: 30000,
        value: null
    }
];

module.exports.run = async (client, message, args) => {

    // Check to see if they already have an account
    const userData = await UserData.findOne({ userID: message.author.id });
    if (userData) return message.reply({
        content: "You already have a `panel account` linked to your discord account!"
    })

    // Locate the category
    let category = message.guild.channels.cache.get(config.discord.categories.accountCreation)

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
    }).catch(e => console.error(e));

    // channel.updateOverwrite(message.author, {
    //     VIEW_CHANNEL: true,
    //     SEND_MESSAGES: true,
    //     READ_MESSAGE_HISTORY: true
    // })

    // Tell the user to check the channel.
    message.reply(`Please check <#${channel.id}> to create an account.`);

    let msg = null;

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
            if (aftercheck.check(question.value) == false) {
                channel.send(aftercheck.errorMessage);
                channel.send("Account Cancelled! :thumbsup:");
                setTimeout(() => {
                    channel.delete();
                }, 5000);
                return;
            };
        }

    }

    msg.edit({
        content: `<@!${message.member.id}>`,
        embeds: [msg.embeds[0]
            .setDescription('Attempting to create an account for you...\n\n>>> '
                + questions.map(question => `**${question.id}:** ${question.value.toLowerCase()}`).join('\n'))
            .setFooter('').setTimestamp()]
    });

    const data = {
        "username": questions.find(question => question.id == 'username').value.toLowerCase(),
        "email": questions.find(question => question.id == 'email').value.toLowerCase(),
        "first_name": questions.find(question => question.id == 'username').value,
        "last_name": ".",
        "password": genPassword(),
        "root_admin": false,
        "language": "en"
    }

    panel.createUser(data.username, data.password, data.email, data.first_name, data.last_name, data.root_admin, data.language)
        .then(async (user) => {

            if (user.success) {
                await UserData.create({
                    userID: message.author.id,
                    consoleID: user.data.id,
                    email: user.data.email,
                    username: user.data.username,
                    createdTimestamp: Date.now(),
                    domains: []
                })

                msg.edit({
                    content: "Hello! You created an new account, Heres the login information",
                    embeds: [new Discord.MessageEmbed()
                        .setColor("GREEN")
                        .setDescription("URL: " + config.pterodactyl.hosturl + "\n" + "Username: " + data.username
                            + "\n" + "Email: " + data.email + " \nPassword: " + data.password)
                        .setFooter("Please note: It is recommended that you change the password")]
                })

                channel.send('**You have 30mins to keep note of this info before the channel is deleted.**')
                message.guild.members.cache.get(message.author.id).roles.add(config.discord.roles.client);
                setTimeout(function () {
                    channel.delete();
                }, 1800000);

            } else {
                let errEmbed = new Discord.MessageEmbed();
                if (user.error.length > 1) {
                    errEmbed
                        .setColor("RED")
                        .setTitle("An error has occured:")
                        .setDescription("**ERRORS:**\n\n● " + user.error.map(error => error.detail.replace('\n', ' ')).join('\n● '))
                        .setTimestamp().setFooter('Deleting in 30 seconds...')
                } else {
                    errEmbed
                        .setColor("RED")
                        .setTitle("An error has occured:")
                        .setDescription("**ERROR:**\n\n● " + user.error.detail)
                        .setTimestamp().setFooter('Deleting in 30 seconds...')
                }

                msg.edit({
                    content: '\u200b',
                    embeds: [errEmbed]
                })
                setTimeout(() => channel.delete(), 30000);
            }
        })
}

module.exports.info = {
    name: "new",
    description: "Creates a new panel account",
    aliases: ['n'],
}