import {
  ActionRowBuilder,
  ApplicationCommand,
  ButtonBuilder,
  ButtonStyle,
  Client,
  CommandInteraction,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  PermissionsBitField,
  SlashCommandBuilder
} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("helpea")
    .setDescription("Affiche un message avec toutes les commandes du bot")
    .addStringOption(option =>
      option
        .setName("commande")
        .setDescription("La méchante commande qui te pose souci")
        .setRequired(false)
    ),
  category: "utils",
  permissions: [PermissionsBitField.Flags.SendMessages],
  usage: "helpea <command>",
  examples: ["helpea", "helpea pingea"],

  async execute(client: Client, interaction: CommandInteraction) {
    let commandsList: string | undefined;
    const client1 = interaction.client;
    const cmd = await client1.application?.commands.fetch();

    commandsList = cmd
      ?.map(
        (cmd: ApplicationCommand) => `**/${cmd.name}** - ${cmd.description}`
      )
      .join("\n");

    const row =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("botInfo")
          .setEmoji("🤖")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Bot Info")
      );

    const embed = new EmbedBuilder()
      .setColor(`#6bde36`)
      .setTitle(`${client1.user?.username}'s commands`)
      .setDescription(`${commandsList}`)
      .setThumbnail(client1.user?.avatarURL({ forceStatic: false })!);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  }
};
