import {
  ButtonInteraction,
  Collection,
  CommandInteraction,
  EmbedBuilder,
  Events,
  Interaction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  inlineCode
} from "discord.js";
import { CustomError, CustomErrors } from "../../utils/errors";
import { IDiscordClient } from "../../client";
import { IGuild } from "../../models";
import { checkMemberPermission } from "../../utils/memberUtil";
import guildService from "../../services/guildService";
import { Colors } from "../../utils/consts";

module.exports = {
  name: Events.InteractionCreate,
  async execute(client: IDiscordClient, interaction: Interaction) {
    if (interaction instanceof CommandInteraction) {
      let guildSettings: IGuild | null = await guildService.getGuildById(interaction.guildId!);
      if (!guildSettings) {
        guildSettings = await guildService.createGuild(interaction.guildId!);
      }

      try {
        const command = client.commands.get(interaction.commandName);
        if (!command) throw CustomErrors.UnknownCommandError;

        if (!checkMemberPermission(interaction.memberPermissions, command.permissions))
          throw CustomErrors.NoPermissionsError;

        if (!client.cooldowns.has(command.data.name)) {
          client.cooldowns.set(command.data.name, new Collection());
        }
        const now = Date.now();
        const timestamps = client.cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
        if (timestamps)
          if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
              const expiredTimestamp = Math.round(expirationTime / 1000);

              const cdError = `Comme dirait Orel San, ça va trop vite. la commande ${inlineCode(
                command.data.name
              )} est en cooldown, tu pourras l'utiliser <t:${expiredTimestamp}:R>.`;
              const cdEmbed = new EmbedBuilder().setTitle(cdError).setColor(Colors.error);

              return interaction.reply({
                embeds: [cdEmbed],
                ephemeral: true
              });
            }
          }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        if (interaction.isChatInputCommand()) {
          await command.execute(client, interaction, guildSettings);
        }

        if (interaction.isContextMenuCommand()) {
          await command.execute(client, interaction);
        }

        if (interaction.isAutocomplete()) {
          await command.autocomplete(interaction);
        }
      } catch (err) {
        if (err instanceof CustomError) {
          const embed = new EmbedBuilder().setTitle(err.message).setColor(Colors.error);
          interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          const embed = new EmbedBuilder()
            .setTitle(CustomErrors.UnknownError.message)
            .setColor(Colors.error);
          interaction.reply({ embeds: [embed], ephemeral: true });
          console.error(err);
        }
      }
    } else if (
      interaction instanceof ButtonInteraction ||
      interaction instanceof ModalSubmitInteraction ||
      interaction instanceof StringSelectMenuInteraction
    ) {
      if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId);
        if (!button) return;
        try {
          await button.execute(interaction);
        } catch (err) {
          if (err instanceof CustomError) {
            const embed = new EmbedBuilder().setTitle(err.message).setColor(Colors.error);
            interaction.reply({
              embeds: [embed],
              ephemeral: true
            });
          } else {
            const embed = new EmbedBuilder()
              .setTitle(CustomErrors.UnknownError.message)
              .setColor(Colors.error);
            interaction.reply({
              embeds: [embed],
              ephemeral: true
            });
            console.error(err);
          }
        }
      } else if (interaction.isAnySelectMenu()) {
        const selectMenu = client.selectMenus.get(interaction.customId);
        try {
          await selectMenu.execute(interaction);
        } catch (err) {
          if (err instanceof CustomError) {
            const embed = new EmbedBuilder().setTitle(err.message).setColor(Colors.error);
            interaction.update({ embeds: [embed], components: [] });
          } else {
            const embed = new EmbedBuilder()
              .setTitle(CustomErrors.UnknownError.message)
              .setColor(Colors.error);
            interaction.update({ embeds: [embed], components: [] });

            console.error(err);
          }
        }
      } else if (interaction.isModalSubmit()) {
        const modal = client.modals.get(interaction.customId);
        if (!modal) return;
        try {
          await modal.execute(interaction);
        } catch (err) {
          if (err instanceof CustomError) {
            const embed = new EmbedBuilder().setTitle(err.message).setColor(Colors.error);
            interaction.reply({ embeds: [embed], ephemeral: true });
          } else {
            const embed = new EmbedBuilder()
              .setTitle(CustomErrors.UnknownError.message)
              .setColor(Colors.error);
            interaction.reply({ embeds: [embed], ephemeral: true });

            console.error(err);
          }
        }
      }
    }
  }
};
