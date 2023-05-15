import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";

module.exports = {
  data: {
    name: `explainMood`
  },
  async execute(interaction: ModalSubmitInteraction) {
    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`${interaction.user.username}'s emotion`)
      .setDescription(`${interaction.fields.getTextInputValue("explain_mood")}`)
      .setThumbnail(interaction.user?.avatarURL({ forceStatic: false })!);
    await interaction.reply({ embeds: [embed] });
  }
};
