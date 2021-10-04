const { client } = require('../index.js')
const config = require('../config.json');
const { MessageEmbed } = require('discord.js');

client.on('guildBanAdd', async (ban) => {
	setTimeout(async() => {
		let guild = ban.guild;
	let user = ban.user;
	const fetchedLogs = await guild.fetchAuditLogs({
		limit: 10,
		type: 'MEMBER_BAN_ADD',
	});
	const banLog = fetchedLogs.entries.first();

	if (!banLog) return client.channels.cache.get(config.discord.channels.modLogs).send({content: `The Audit logs Didn't show anything about the ban.`})

	const { executor, target, reason } = banLog;
	if (target.id === user.id) {
		let r = reason
		let e = ' '
		if(r === null) e = `${executor} You didn't add a reason, Please provide proof and a reason in the proof channel`
		if(r === null) r = "**There was No reason**" 
		const embed = new MessageEmbed()
		.setTitle('New Ban!')
		.addField("User Banned:", `${user.tag} (${user.id})`)
		.addField("Banned By:", `${executor} (${executor.id})`)
		.addField("Reason", r.toString())
		.setColor("ORANGE")
		.setTimestamp()
		client.channels.cache.get(config.discord.channels.modLogs).send({content: `${e}`, embeds:[embed]})
	}
	}, 1000);
});