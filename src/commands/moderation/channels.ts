import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Client,
    CommandInteraction,
    PermissionsBitField
} from 'discord.js';
import { CustomErrors } from '../../utils/errors';
import { IGuild } from '../../models';
import { checkTemporaryVoiceModule } from '../../utils/botUtil';

module.exports = {
    data: {
        name: 'channel',
        description: '[ADMIN] Gère les salons du serveur',
        options: [
            {
                name: 'edit',
                description: 'Configure les différents salons',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'channels-to-edit',
                        description: 'Configuration des différents salons',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        choices: [
                            { name: 'all', value: 'all' },
                            { name: 'public-log', value: 'public-log' },
                            { name: 'private-log', value: 'private-log' },
                            { name: 'protected-voice', value: 'protected-voice' },
                            { name: 'host-voice', value: 'host-voice' },
                            { name: 'not-logged-channel', value: 'not-logged-channel' }
                        ]
                    }
                ]
            },
            {
                name: 'list',
                description: 'Liste des différents salons',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'channels-list',
                        description: 'Salons à lister',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        choices: [
                            { name: 'all', value: 'all' },
                            { name: 'host-voice', value: 'host-voice' },
                            { name: 'protected-voice', value: 'protected-voice' },
                            { name: 'textual-logs', value: 'textual-logs' }
                        ]
                    }
                ]
            }
        ]
    },
    category: 'moderation',
    cooldown: 30,
    permissions: [PermissionsBitField.Flags.Administrator],
    usage: 'channel [commande] [channel]',
    examples: 'channel list all',

    async execute(client: Client, interaction: CommandInteraction, guildSettings: IGuild) {
        if (!checkTemporaryVoiceModule(guildSettings)) throw CustomErrors.ModuleDisabledError;

        const subcommand = (interaction as ChatInputCommandInteraction).options.getSubcommand();

        switch (subcommand) {
            case 'ban': {
                return interaction.reply({
                    content: `Booh il est banni`,
                    ephemeral: true
                });
            }

            case 'unban': {
                return interaction.reply({
                    content: `https://media.tenor.com/31nachzhSKQAAAAd/did-you-say-free.gif`,
                    ephemeral: true
                });
            }

            default: {
                throw CustomErrors.UnknownCommandError;
            }
        }
    }
};
