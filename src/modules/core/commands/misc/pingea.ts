import {
    Client,
    CommandInteraction,
    EmbedBuilder,
    PermissionsBitField,
    codeBlock
} from 'discord.js';
import { IGuild } from 'adroi.d.ea';
import { TranslationFunctions } from '../../../../locales/i18n-types';

export default {
    data: {
        name: 'pingea',
        description: 'Renvoie le ping du bot'
    },
    category: 'utils',
    cooldown: 10,
    permissions: [PermissionsBitField.Flags.SendMessages],
    guildOnly: false,
    usage: 'pingea',
    examples: ['pingea'],

    async execute(
        client: Client,
        interaction: CommandInteraction,
        _: IGuild,
        LL: TranslationFunctions
    ) {
        const sentMessage = await interaction.reply({
            content: 'Pong !',
            fetchReply: true,
            ephemeral: true
        });
        const locale = LL.commands.pingea;
        const botLantency = sentMessage.createdTimestamp - interaction.createdTimestamp;
        const embed = new EmbedBuilder()
            .setThumbnail(client.user!.displayAvatarURL())
            .setTitle('🏓 Pong !')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .addFields([
                {
                    name: locale.botLatency(),
                    value: codeBlock('sci', `${botLantency.toString()}ms`),
                    inline: true
                },
                {
                    name: locale.apiLatency(),
                    value: codeBlock('sci', `${client.ws.ping.toString()}ms`),
                    inline: true
                }
            ])
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();
        return interaction.editReply({ embeds: [embed] });
    }
};
