import { ChatInputCommandInteraction, Client, GuildMember, PermissionsBitField } from 'discord.js';
import { CustomErrors } from '../../../utils/errors';
import { IGuild } from 'adroi.d.ea';
import { buildVoiceEmbed } from '../../../utils/voiceUtil';
import { isTempVoiceModuleEnabled } from '../../../utils/modulesUil';

export default {
    data: {
        name: 'voice',
        description: 'Gère ton salon vocal temporaire'
    },
    category: 'voice',
    cooldown: 30,
    permissions: [PermissionsBitField.Flags.SendMessages],
    usage: 'voice',
    examples: 'voice',
    guildOnly: false,

    async execute(client: Client, interaction: ChatInputCommandInteraction, guildSettings: IGuild) {
        if (!isTempVoiceModuleEnabled(guildSettings, true)) return;

        const member = interaction.member as GuildMember;
        const memberVoiceChannel = member.voice.channel;

        if (!memberVoiceChannel) {
            throw CustomErrors.NotVoiceOwnerError;
        }

        interaction.reply({ ...buildVoiceEmbed(), ephemeral: true });
    }
};
