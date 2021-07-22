
module.exports.run = (client, message, args) => {
    message.channel.send('TWO!');
}


/**
 * This is completely optional...
 */

module.exports.info = {
    name: 'two', // default = file name (without the extention)
    description: "subcommands example 2", // default is "None"
    requiredPermission: "ADMINISTRATOR", // default is null
    aliases: ['2'], // default is null
    usage: '' // default is null
}