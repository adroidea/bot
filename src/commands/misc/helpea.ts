import {
  ApplicationCommand,
  Client,
  CommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder
} from "discord.js";
import { getRandomRGB } from "../../utils/botUtil";

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
      ?.map((cmd: ApplicationCommand) => `**/${cmd.name}** - ${cmd.description}`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(getRandomRGB())
      .setTitle(`<a:flocon:1107932689291554897> Voici toutes les commandes du bot !`)
      .setDescription(`${commandsList}`)
      .addFields({
        name: "version",
        value: `v${process.env.npm_package_version}`
      })
      .setFooter({ text: `< > = optionnel | [ ] = requis | (A ne pas inclure dans les commandes)` })
      .setThumbnail(client1.user?.avatarURL({ forceStatic: false })!);

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};
