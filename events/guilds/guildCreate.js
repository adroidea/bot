const { Guild } = require('../../models/index');
//https://youtu.be/qujhAxQYXPw?t=412
module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(client, interaction) {
        if (interaction.isCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) {
                return interaction.reply('This command doesn\'t exist !');
            }
            cmd.runSlash(client, interaction);
        }
    }
};
