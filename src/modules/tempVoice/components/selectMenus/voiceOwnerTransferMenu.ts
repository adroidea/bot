import { GuildMember, StringSelectMenuInteraction, userMention } from 'discord.js';
import { isMemberVoiceOwner, switchVoiceOwner } from '../../../../utils/voiceUtil';
import { CustomErrors } from '../../../../utils/errors';
import { IGuild } from '../../../../models';

export default {
    data: {
        name: `voiceOwnerTransferMenu`
    },
    async execute(interaction: StringSelectMenuInteraction, guildSettings: IGuild) {
        const targetId = interaction.values[0];
        const target: GuildMember = await interaction.guild!.members.fetch(targetId);
        const user = interaction.member as GuildMember;
        if (target.user.bot)
            return interaction.update({
                content: `L'IA est pas encore assez intelligente pour avoir ce rôle.\nAu cas où c'était un miss click :`
            });

        if (target.id === user.id) {
            return interaction.update({
                content: `Tu es déjà propriétaire, quel intérêt de faire ça ?\nAu cas où c'était un miss click :`
            });
        }

        await interaction.deferUpdate();
        const voiceChannel = (interaction.member as GuildMember)!.voice.channel;
        if (!voiceChannel || !isMemberVoiceOwner(user.id, voiceChannel.id)) {
            throw CustomErrors.NotVoiceOwnerError;
        }

        switchVoiceOwner(user, target, guildSettings.modules.temporaryVoice);

        return interaction.editReply({
            content: `La propriété du salon a été transféré à ${userMention(target.id)}.`,
            components: []
        });
    }
};
