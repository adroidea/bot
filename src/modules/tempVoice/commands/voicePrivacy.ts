import { ChatInputCommandInteraction, Client, GuildMember, PermissionsBitField } from 'discord.js';
import { CustomErrors } from '../../../utils/errors';
import { IGuild } from '../../../models';
import { buildVoiceEmbed } from '../../../utils/voiceUtil';
import { isTemporaryVoiceModuleEnabled } from '../../../utils/modulesUil';

export default {
    data: {
        name: 'voice',
        description: 'Gère ton salon vocal temporaire'
    },
    category: 'voice',
    cooldown: 10,
    permissions: [PermissionsBitField.Flags.SendMessages],
    usage: 'voice',
    examples: 'voice',
    guildOnly: false,

    async execute(client: Client, interaction: ChatInputCommandInteraction, guildSettings: IGuild) {
        if (!isTemporaryVoiceModuleEnabled(guildSettings, true)) return;

        const member = interaction.member as GuildMember;
        const memberVoiceChannel = member.voice.channel;

        if (!memberVoiceChannel) {
            throw CustomErrors.NotVoiceOwnerError;
        }

        interaction.reply({ ...buildVoiceEmbed(interaction.user.id), ephemeral: true });
    }
};
