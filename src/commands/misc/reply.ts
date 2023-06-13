import {
  ChatInputCommandInteraction,
  Client,
  PermissionsBitField,
  SlashCommandBuilder
} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("r")
    .setDescription("r")
    .addStringOption(option => option.setName("r").setDescription("r").setRequired(true)),
  category: "misc",
  permissions: [PermissionsBitField.Flags.Administrator],
  usage: "idk dude.",
  examples: ["still don't know"],

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const message = interaction.options.getString("r")!;

    await interaction.channel?.sendTyping();
    await interaction.channel!.send(message);
    return interaction.reply({ content: "done", ephemeral: true });
  }
};
