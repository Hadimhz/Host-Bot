
const { client } = require('../index.js');
const config = require(ROOT_PATH + "/../config.json");

client.on('guildMemberAdd', member => {
	const wChannel = bot.channels.cache.get(config.channels.welcome);
	wChannel.send(`<@${member.id}> Welcome`);
	let joinRole = member.guild.roles.cache.get(config.roles.member);
	member.roles.add(joinRole).catch(console.error);
 }); 
