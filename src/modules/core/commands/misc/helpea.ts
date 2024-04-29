import {
    ApplicationCommand,
    ApplicationCommandOptionType,
    Client,
    CommandInteraction,
    EmbedBuilder,
    PermissionsBitField
} from 'discord.js';
import { Colors } from '../../../../utils/consts';
import { IGuild } from 'adroi.d.ea';
import L from './../../../../locales/i18n-node';
import { TranslationFunctions } from '../../../../locales/i18n-types';
import { version } from './../../../../../package.json';

export default {
    data: {
        name: 'helpea',
        description: L.en.modules.core.commands.helpea.description(),
        options: [
            {
                name: L.en.modules.core.commands.helpea.options.command.name(),
                description: L.en.modules.core.commands.helpea.options.command.description(),
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ]
    },
    category: 'utils',
    module: 'core',
    permissions: [PermissionsBitField.Flags.SendMessages],
    usage: 'helpea <command>',
    guildOnly: false,
    examples: ['helpea', 'helpea pingea'],

    async execute(
        _: Client,
        interaction: CommandInteraction,
        __: IGuild,
        LL: TranslationFunctions
    ) {
        let commandsList: string | undefined;
        const client1 = interaction.client;
        const cmd = await client1.application?.commands.fetch();
        const locale = LL.modules.core.commands.helpea;

        commandsList = cmd
            ?.map((cmd: ApplicationCommand) => `**/${cmd.name}** - ${cmd.description}`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setColor(Colors.random)
            .setTitle(locale.embed.title())
            .setDescription(`${commandsList}`)
            .addFields({
                name: 'version',
                value: `v${version}`
            })
            .setFooter({
                text: locale.embed.footer()
            })
            .setThumbnail(client1.user.avatarURL({ forceStatic: false }));

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
