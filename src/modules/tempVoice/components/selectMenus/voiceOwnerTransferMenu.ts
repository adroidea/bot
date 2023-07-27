import { GuildMember, StringSelectMenuInteraction, userMention } from 'discord.js';
import { checkVoiceOwnership, switchVoiceOwner } from '../../../../utils/voiceUtil';
import { CustomErrors } from '../../../../utils/errors';

module.exports = {
    data: {
        name: `voiceOwnerTransferMenu`
    },
    async execute(interaction: StringSelectMenuInteraction) {
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
        const voiceChannel = (interaction.member as GuildMember)!.voice.channel;
        if (!voiceChannel || !(await checkVoiceOwnership(voiceChannel, user))) {
            throw CustomErrors.NotVoiceOwnerError;
        }

        switchVoiceOwner(user, target);

        return interaction.update({
            content: `La propriété du salon a été transféré à ${userMention(target.id)}.`,
            components: []
        });
    }
};
