import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  GuildMember
} from "discord.js";
import { checkVoiceOwnership, checkVoicePrivacy, switchVoicePrivacy } from "../../utils/voiceUtil";
import { NotVoiceChannelOwnerError } from "../../utils/errors";

module.exports = {
  data: {
    name: `voicePrivacyBtn`
  },
  async execute(interaction: ButtonInteraction) {
    const member = interaction.member as GuildMember;
    const voiceChannel = member!.voice.channel;

    if (!voiceChannel || !(await checkVoiceOwnership(voiceChannel, member)))
      throw NotVoiceChannelOwnerError;

    let isPublic: boolean = await checkVoicePrivacy(voiceChannel);

    const newButton = new ButtonBuilder()
      .setCustomId("voicePrivacyBtn")
      .setLabel(isPublic ? "Déverrouiller" : "Verrouiller")
      .setEmoji(isPublic ? "🔓" : "🔒")
      .setStyle(isPublic ? ButtonStyle.Success : ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      newButton,
      new ButtonBuilder()
        .setCustomId("voiceOwnerTransferBtn")
        .setLabel("Transférer la propriété")
        .setEmoji("🤝")
        .setStyle(ButtonStyle.Danger)
    );

    switchVoicePrivacy(member);
    await interaction.update({ components: [row] });
  }
};
