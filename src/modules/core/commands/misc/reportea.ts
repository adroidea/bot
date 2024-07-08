import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    ForumChannel,
    GuildForumThreadMessageCreateOptions,
    PermissionsBitField
} from 'discord.js';
import { Channels, Colors, Guilds } from '../../../../utils/consts';
import { IGuild } from 'adroi.d.ea';
import { TranslationFunctions } from '../../../../locales/i18n-types';
import { addAuthor } from '../../../../utils/embeds.util';

export default {
    data: {
        name: 'reportea',
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
                required: false
            },
            {
                name: 'fichier',
                description: 'Les pièces jointes du bug',
                type: ApplicationCommandOptionType.Attachment,
                required: false
            }
        ]
    },
    category: 'utils',
    cooldown: 10,
    permissions: [PermissionsBitField.Flags.SendMessages],
    guildOnly: false,
    usage: 'report [type] [title] [description]',
    examples: ["report bug qdj s'envoie pas la qdj ne s'envoie pas dans le salon qdj"],

    async execute(
        client: Client,
        interaction: ChatInputCommandInteraction,
        _: IGuild,
        LL: TranslationFunctions
    ) {
        await interaction.deferReply({ ephemeral: true });
        const issue = interaction.options.getString('type', true);
        const title = interaction.options.getString('title', true);
        const description = interaction.options.getString('description', false);
        const attachment = interaction.options.getAttachment('fichier', false);
        const locale = LL.modules.core.commands.reportea;
        const embed = new EmbedBuilder()
            .setTitle(`**${title}**`)
            .setDescription(description ?? locale.embed.description())
            .setColor(Colors.random)
            .setTimestamp();

        addAuthor(embed, interaction.user);

        const message: GuildForumThreadMessageCreateOptions = {
            embeds: [embed]
        };

        if (attachment) {
            message.files = [attachment];
        }
        const bugChannel = client.guilds.cache
            .get(Guilds.adanLab)
            ?.channels.cache.get(Channels.issues) as ForumChannel;

        const thread = await bugChannel.threads.create({
            name: title,
            message,
            appliedTags: [bugChannel.availableTags.find(tag => tag.name === issue)!.id]
        });
        await interaction.editReply({
            content: locale.reply({ threadId: thread.id })
        });
    }
};
