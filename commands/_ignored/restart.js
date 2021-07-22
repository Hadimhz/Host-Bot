module.exports.run = async (client, message, args) => {
    message.channel.send(`Restarting bot, New changes will take effect after restart`)
    setTimeout(() => {
        process.exit();
    }, 1000)
}

module.exports.info = {
    name: 'restart',
    description: "",
    requiredPermission: "ADMINISTRATOR",
    aliases: [''],
    usage: ''
}