const exec = require('child_process').exec;
module.exports.run = async (client, message, args) => {
    e = await message.channel.send('Pulling from github....');
    exec(`git pull`, (error, stdout) => {
        let response = (error || stdout);
        if (!error) {
            if (response.includes("Already up to date.")) {
                e.edit(`Bot is already up to date`)
            } else {
                e.edit(`Pulled From github\n\n\`\`\`js\n${response}\n\`\`\`\n\nRunning \`npm i\``)
                exec(`npm i`, (error, stdout) => {
                    let response = (error || stdout);
                    e.edit(`**NPM I Response**\n\n\`\`\`js${response}\`\`\``)
                })
            }
        }
    })
}

/**
 * This is completely optional...
 */

module.exports.info = {
    name: 'pull',
    description: "",
    requiredPermission: "ADMINISTRATOR",
    aliases: ['git-pull'],
    usage: ''
}