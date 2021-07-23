const config = require("../config.json");
const { client } = require("../index");

client.on('messageDelete', async (client) => {
    client.snipes.set(message.channel.id, {
      content: message.content,
      author: message.author.tag,
      member: message.member,
    })
});
