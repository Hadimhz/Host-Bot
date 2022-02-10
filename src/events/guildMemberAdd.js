
const { client } = require('../index.js');
const config = require(ROOT_PATH + "/../config.json");

client.on('guildMemberAdd', member => {

	if(config.discord.channels.welcome == null) return;
	if(config.discord.roles.member == null) return;

	const wChannel = client.channels.cache.get(config.discord.channels.welcome);
	const joinRole = member.guild.roles.cache.get(config.discord.roles.member);
	const wmsg = config.discord.welcomeMessage ? config.discord.welcomeMessage : "Welcome to the server, {member}!";
	if(!wChannel) return;
	if(!joinRole) return;

	wChannel.send(wmsg.replace("{member}", member));

	member.roles.add(joinRole).catch(console.error);
 }); 
