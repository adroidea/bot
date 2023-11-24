import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    ForumChannel,
    PermissionsBitField
} from 'discord.js';
import { Channels, Colors, Guilds } from '../../../../utils/consts';

export default {
    data: {
        name: 'report',
        description: "Notifie le propriétaire du bot d'un bug ou d'une suggestion",
        options: [
            {
                name: 'type',
                description: 'bug ou suggestion',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: 'bug',
                        value: 'Bug'
                    },
                    {
                        name: 'suggestion',
                        value: 'Feature'
                    }
                ]
            },
            {
                name: 'title',
                description: 'Le titre du bug',
                max_length: 100,
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'description',
                description: 'La description du bug',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    category: 'utils',
    cooldown: 10,
    permissions: [PermissionsBitField.Flags.SendMessages],
    guildOnly: false,
    usage: 'report [type] [title] [description]',
    examples: ["report bug qdj s'envoie pas la qdj ne s'envoie pas dans le salon qdj"],

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });
        const issue = interaction.options.getString('type', true);
        const title = interaction.options.getString('title', true);
        const description = interaction.options.getString('description', true);

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `ID : ${interaction.user.username} (${interaction.user.id})`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTitle(`**${title}**`)
            .setDescription(description ?? '*Aucune description*')
            .setColor(Colors.Random)
            .setTimestamp();

        const bugChannel = client.guilds.cache
            .get(Guilds.adanLab)
            ?.channels.cache.get(Channels.issues) as ForumChannel;

        const thread = await bugChannel.threads.create({
            name: title,
            message: {
                embeds: [embed]
            },
            appliedTags: [bugChannel.availableTags.find(tag => tag.name === issue)!.id]
        });
        await interaction.editReply({
            content: `Ton message a bien été envoyé. Tu peux le retrouver dans <#${thread.id}> sur ce serveur: https://discord.gg/29URgahg\nMerci pour ta contribution !`
        });
    }
};
