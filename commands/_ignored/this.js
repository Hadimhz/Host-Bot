module.exports.run = (client, message, args) => {

    message.channel.send('this command is not visible on the help list');

}


/**
 * This is completely optional...
 */

module.exports.info = {
    name: 'this',// default = file name (without the extention)
    description: "",// default is "None"
    requiredPermission: null,// default is null
    aliases: [], // default is null
    usage: '' // default is null
}