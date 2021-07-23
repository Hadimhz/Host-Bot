const { client } = require('../index.js')
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isButton()) return;
	interaction.update(interaction.user.username + ' Clicked on the button :D')
});
