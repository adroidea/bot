import {
  ChatInputCommandInteraction,
  Client,
  CommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder
} from "discord.js";
import { ModuleNotEnabledError, UnknownCommandError } from "../../utils/errors";
import { IGuild } from "../../models";
import { checkTemporaryVoiceModule } from "../../utils/botUtil";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("channel")
    .setDescription("[ADMIN] Gère les salons du serveur")

    .addSubcommand(subcommand =>
      subcommand
        .setName("edit")
        .setDescription("Configure les différents salons")
        .addStringOption(option =>
          option
            .setName("channels-to-edit")
            .setDescription("Configuration des différents salons")
            .setRequired(true)
            .addChoices(
              { name: "all", value: "all" },
              { name: "public-log", value: "public-log" },
              { name: "private-log", value: "private-log" },
              { name: "protected-voice", value: "protected-voice" },
              { name: "host-voice", value: "host-voice" },
              { name: "not-logged-channel", value: "not-logged-channel" }
            )
        )
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("list")
        .setDescription("Liste des différents salons")
        .addStringOption(option =>
          option
            .setName("channels-list")
            .setDescription("Salons à lister")
            .setRequired(true)
            .addChoices(
              { name: "all", value: "all" },
              { name: "host-voice", value: "host-voice" },
              { name: "protected-voice", value: "protected-voice" },
              { name: "textual-logs", value: "textual-logs" }
            )
        )
    ),
  category: "moderation",
  cooldown: 30,
  permissions: [PermissionsBitField.Flags.Administrator],
  usage: "channel [commande] [channel]",
  examples: "channel list all",

  async execute(client: Client, interaction: CommandInteraction, guildSettings: IGuild) {
    if (!checkTemporaryVoiceModule(guildSettings)) throw ModuleNotEnabledError;

    const subcommand = (interaction as ChatInputCommandInteraction).options.getSubcommand();

    switch (subcommand) {
      case "ban": {
        return interaction.reply({
          content: ``,
          ephemeral: true
        });
      }

      case "unban": {
        return interaction.reply({
          content: ``,
          ephemeral: true
        });
      }

      default: {
        throw UnknownCommandError;
      }
    }
  }
};
