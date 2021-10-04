const { client } = require("../index");
const config = require('../config.json')
client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (oldMessage.author == null || oldMessage.author.bot == true || !oldMessage.content || newMessage == null) return;

    let data = {
        message: oldMessage.content,
        member: oldMessage.member,
        timestamp: Date.now(),
        action: "edit"
    };

    if (client.messageSnipes.get(oldMessage.channel.id) == null) client.messageSnipes.set(oldMessage.channel.id, [data])
    else client.messageSnipes.set(oldMessage.channel.id, [...client.messageSnipes.get(oldMessage.channel.id), data]);

    client.messageSnipes.set(oldMessage.channel.id, client.messageSnipes.get(oldMessage.channel.id).filter(x => (Date.now() - x.timestamp) < 300000 && x != null));
})