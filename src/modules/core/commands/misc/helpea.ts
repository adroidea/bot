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
import { TranslationFunctions } from '../../../../i18n/i18n-types';
import { version } from './../../../../../package.json';

export default {
    data: {
        name: 'helpea',
        description: 'Affiche un message avec toutes les commandes du bot',
        options: [
            {
                name: 'commande',
                description: 'La méchante commande qui te pose souci',
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ]
    },
    category: 'utils',
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
        const locale = LL.modules.core.commands.helpea;
        let commandsList: string | undefined;
        const client1 = interaction.client;
        const cmd = await client1.application?.commands.fetch();

        commandsList = cmd
            ?.filter((cmd: ApplicationCommand) => cmd.type !== 2)
            .map(
                (cmd: ApplicationCommand) =>
                    `**/${cmd.name}** - ${cmd.description ?? LL.common.noDescription()}`
            )
            .join('\n');

        const embed = new EmbedBuilder()
            .setColor(Colors.random)
            .setTitle(locale.embed.title())
            .setDescription(`${commandsList}`)
            .addFields({
                name: 'version',
                value: `[v${version}](https://github.com/adroidea/bot/blob/main/CHANGELOG.md)`
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
