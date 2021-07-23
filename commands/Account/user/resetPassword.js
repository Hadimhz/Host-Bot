const userdb = require('../../../database/schemas/UserData')
const config = require('../../../config.json');
const { panel } = require('../../../index');
const Discord = require('discord.js');
const { genPassword } = require('./user');

// Questions user needs to answer

module.exports.run = async (client, message, args) => {

    // Check to see if they already have an account
    const userData = await userdb.findOne({ userID: message.author.id });
    if (!userData) return message.reply({
        content: "You do not have a `panel account` linked to your discord!"
            + "\n" + `Use \`${config.discord.bot.prefix}user new\` to create an account and get started.`
    })

    const embed = new Discord.MessageEmbed()
        .setTitle("Password Reset")
        .setDescription("Resetting your password...")
        .setTimestamp()

    let msg = await message.author.send({
        embeds: [embed]
    }).catch(e => {
        message.channel.send({ content: "Failed to send you a DM, please Make sure your dms are open." });
        return;
    });

    message.reply("Check your DMs! 📬");

    const password = genPassword();

    let res = await panel.updateUser(userData.consoleID, { password });

    if (res.success) embed.setDescription("Your new password is: ||" + password + "||").setColor("BLUE");
    else embed.setDescription("An error has occured while attempting to change your password.").setColor("DARK_RED");

    msg.edit({ embeds: [embed] });

}

module.exports.info = {
    name: "resetpassword",
    description: "Reset your account's password.",
    aliases: ['reset'],
}