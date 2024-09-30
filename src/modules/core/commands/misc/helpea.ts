import {
    ApplicationCommand,
    ApplicationCommandOptionType,
    Client,
    CommandInteraction,
    EmbedBuilder,
    PermissionsBitField
} from 'discord.js';
import { Colors, Emojis } from '../../../../utils/consts';
import {version} from './../../../../../package.json';

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

    async execute(client: Client, interaction: CommandInteraction) {
        let commandsList: string | undefined;
        const client1 = interaction.client;
        const cmd = await client1.application?.commands.fetch();

        commandsList = cmd
            ?.map((cmd: ApplicationCommand) => `**/${cmd.name}** - ${cmd.description}`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setColor(Colors.random)
            .setTitle(`${Emojis.aSnowflake} Voici toutes les commandes du bot !`)
            .setDescription(`${commandsList}`)
            .addFields({
                name: 'version',
                value: `[v${version}](https://github.com/adroidea/bot/blob/main/CHANGELOG.md)`
            })
            .setFooter({
                text: `< > = optionnel | [ ] = requis | (A ne pas inclure dans les commandes)`
            })
            .setThumbnail(client1.user.avatarURL({ forceStatic: false }));

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
