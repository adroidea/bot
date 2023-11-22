import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    ForumChannel,
    PermissionsBitField
} from 'discord.js';
import { Channels, Guilds } from '../../../../utils/consts';

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
            .setTitle(`**${title}**`)
            .setDescription(description ?? '')
            .setColor(0xff0000)
            .setTimestamp()
            .setFooter({ text: `ID : ${interaction.user.id}` });

        const bugChannel = client.guilds.cache
            .get(Guilds.adanLab)
            ?.channels.cache.get(Channels.issues) as ForumChannel;

        bugChannel.threads.create({
            name: title,
            message: {
                content: description ?? '',
                embeds: [embed]
            },
            appliedTags: [bugChannel.availableTags.find(tag => tag.name === issue)!.id]
        });
        await interaction.editReply({
            content: `Le message a bien été envoyé`
        });
    }
};
