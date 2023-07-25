import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    GuildMember,
    MessageType,
    PermissionsBitField
} from 'discord.js';
import { Colors } from '../../utils/consts';

module.exports = {
    data: {
        name: 'qdj',
        description: "Envoie la question du jour et l'épingle",
        options: [
            {
                name: 'question',
                description: 'question du jour',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'auteur',
                description: 'Auteur de la question',
                type: ApplicationCommandOptionType.User,
                required: false
            }
        ]
    },
    category: 'misc',
    permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageMessages],
    usage: 'qdj [question] <auteur>',
    examples: ['qdj Pâtes ou riz ?', 'qdj pain au chocolat ou croissant ? @Adan_ea#3000'],

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const question = interaction.options.getString('question');
        const author = interaction.options.getUser('auteur');
        const user = (interaction.member as GuildMember).user;

        const questionEmbed = new EmbedBuilder()
            .setTitle(question)
            .setColor(Colors.random)
            .setFooter({ text: 'Question du jour' })
            .setTimestamp();

        if (author) {
            questionEmbed.setAuthor({
                name: `${author.username}`,
                iconURL: author.displayAvatarURL()
            });
        } else {
            questionEmbed.setAuthor({
                name: `${user.username}`,
                iconURL: user.displayAvatarURL()
            });
        }

        await interaction.reply({
            content: 'Question du jour envoyée !',
            ephemeral: true
        });

        const pinnedMessages = await interaction.channel!.messages.fetchPinned();

        for (const pinnedMessage of pinnedMessages) {
            if (pinnedMessage[1].author.bot === true) await pinnedMessage[1].unpin();
        }

        const sentMessage = await interaction.channel!.send({
            embeds: [questionEmbed]
        });
        await sentMessage.pin();

        const pinMessages = await interaction.channel!.messages.fetch({ limit: 5 });
        for (const pinMessage of pinMessages) {
            if (
                pinMessage[1].type === MessageType.ChannelPinnedMessage &&
                pinMessage[1].id !== sentMessage.id
            )
                pinMessage[1].delete();
        }
    }
};
