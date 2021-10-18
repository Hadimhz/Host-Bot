const userdb = require('../../../database/schemas/UserData')
const config = require(ROOT_PATH + "/../config.json");;
const { panel } = require('../../../index');
const Discord = require('discord.js');
const { genPassword } = require('./user');
const Transporter = require('../../../utils/Transporter');

// Questions user needs to answer

module.exports.run = async (client, message, args) => {

    // Check to see if they already have an account
    const userData = await userdb.findOne({ userID: message.author.id });
    if (!userData) return message.reply({
        content: "You do not have a `panel account` linked to your discord!"
            + "\n" + `Use \`${config.discord.bot.prefix}user new\` to create an account and get started.`
    })

    const embed = new Discord.MessageEmbed()
        .setTitle("Password Reset").setColor("BLUE")
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

    if (res.success) {

        if (config.email.enabled) {
            embed.setDescription("Success! You're password has been changed and sent to your email.");
            new Transporter().setReceiver(userData.email).setSubject("Password Reset!")
                .setText("Your password has been reset!"
                    + "\n" + "new password is: " + password
                    + "\n\n" + "It is suggested that you change your password.").send();

        } else {
            embed.setDescription("Your new password is: ||" + password + "||"
                + "\n\n" + "*It is suggested that you change your password.*");
        }

        embed.setColor("GREEN");

    } else embed.setDescription("An error has occured while attempting to change your password.").setColor("DARK_RED");

    msg.edit({ embeds: [embed] });

}

module.exports.info = {
    name: "resetpassword",
    description: "Reset your account's password.",
    aliases: ['reset'],
}