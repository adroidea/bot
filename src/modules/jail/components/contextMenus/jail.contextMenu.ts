import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    GuildBasedChannel,
    GuildMember,
    PermissionsBitField,
    UserContextMenuCommandInteraction
} from 'discord.js';
import { IGuild, IJailModule } from 'adroi.d.ea';
import { CustomErrors } from '../../../../utils/errors';
import { hasBotPermission } from '../../../../utils/bot.util';
import jailQueue from '../../tasks/jail.queue';

export const jailContextMenu = new ContextMenuCommandBuilder()
    .setName('Séjour en Prison')
    .setType(ApplicationCommandType.User)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.MoveMembers);

export default {
    data: jailContextMenu.toJSON(),
    async execute(interaction: UserContextMenuCommandInteraction, guildSettings: IGuild) {
        const permissions: bigint[] = [
            PermissionsBitField.Flags.Connect,
            PermissionsBitField.Flags.MoveMembers,
            PermissionsBitField.Flags.MuteMembers,
            PermissionsBitField.Flags.DeafenMembers,
            PermissionsBitField.Flags.ViewChannel
        ];
        if (!hasBotPermission(interaction.guild!, permissions))
            throw CustomErrors.SelfNoPermissionsError(interaction.guild!, permissions);
        const { jail } = guildSettings.modules;

        // check if the jail module is enabled and if the jail channel is set
        if (!jail.enabled) throw CustomErrors.JailDisabledError;
        if (!jail.jailChannel) throw CustomErrors.JailChannelNotSetError;

        //fetch the jail channel
        const jailChannel = interaction.guild!.channels.cache.get(
            jail.jailChannel
        ) as GuildBasedChannel;

        //check if the channel is a voice channel
        if (!jailChannel?.isVoiceBased()) throw CustomErrors.JailChannelNotVoiceError;

        //check if the target is in a voice channel and not in the jail channel
        const target = interaction.targetMember as GuildMember;
        const targetVoiceChannel = target.voice.channel;
        if (!targetVoiceChannel) throw CustomErrors.JailTargetNotInVoiceError(target.toString());
        if (targetVoiceChannel.id === jailChannel.id)
            throw CustomErrors.JailTargetInPrisonError(target.user.displayName);

        // generate a random time for the jail
        const jailTime = Math.floor(
            Math.random() * (jail.maxTime - jail.minTime + 1) + jail.minTime
        );

        // move the target to the jail channel
        await target.voice.setChannel(jailChannel);
        await target.edit({ mute: true, deaf: true });

        const message = await jailChannel.send(setMessageContent(jail, target, jailTime));

        await jailQueue.add(
            'jailJob',
            {
                targetId: target.id,
                guildId: interaction.guild!.id,
                initialChannelId: targetVoiceChannel.id,
                jailChannelId: jailChannel.id,
                messageId: message ? message.id : null
            },
            { delay: jailTime * 1000 }
        );

        interaction.reply({
            content: `**${target.user.tag}** a été envoyé en prison pour **${jailTime}** secondes.`,
            ephemeral: true
        });
    }
};

const setMessageContent = (jail: IJailModule, target: GuildMember, timeJailed: number): string => {
    const timestamp = Math.floor(Date.now() / 1000) + timeJailed;
    return jail.customMessage
        .replace('{target}', target.toString())
        .replace('{timestamp}', `<t:${timestamp}:R>`)
        .replace('{time}', timeJailed.toString());
};
