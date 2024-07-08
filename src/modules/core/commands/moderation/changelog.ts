import {
    APIEmbed,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Client,
    PermissionsBitField
} from 'discord.js';
import { CustomErrors } from '../../../../utils/errors';
import { OWNER_ID } from '../../../../utils/consts';
import { sendChangeLogRow } from '../../components/buttons/sendChangelog.button';

export default {
    data: {
        name: 'changelog',
        description: '[owner only] Envoie un message à tous les serveurs',
        options: [
            {
                name: 'embed',
                description: "json de l'embed à envoyer",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'ephemeral',
                description: 'Ne pas afficher le message',
                type: ApplicationCommandOptionType.Boolean,
                required: false,
                choices: [
                    {
                        name: 'true',
                        value: true
                    },
                    {
                        name: 'false',
                        value: false
                    }
                ]
            }
        ]
    },
    category: 'moderation',
    guildOnly: true,
    permissions: [PermissionsBitField.Flags.Administrator],
    usage: 'why do you care',
    examples: ['why do you care'],

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        if (interaction.user.id !== OWNER_ID) {
            throw CustomErrors.UserNoPermissionsError;
        }

        const defaultEmbed: APIEmbed = {
            color: 555,
            url: 'https://github.com/adan-ea/adroid_ea/releases',
            author: {
                name: interaction.user.username,
                icon_url: interaction.user.displayAvatarURL(),
                url: 'https://discord.gg/29URgahg'
            },
            footer: {
                text: client.user!.username,
                icon_url: client.user!.displayAvatarURL()
            },
            timestamp: new Date().toISOString()
        };

        const embed = JSON.parse(interaction.options.getString('embed', true)) as APIEmbed;
        const ephemeral = interaction.options.getBoolean('ephemeral', false) ?? true;
        const mergedEmbed: APIEmbed = {
            ...defaultEmbed,
            ...embed
        };

        await interaction.reply({
            embeds: [mergedEmbed],
            components: [sendChangeLogRow],
            ephemeral
        });
    }
};
