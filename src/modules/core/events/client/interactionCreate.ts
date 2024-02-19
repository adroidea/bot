import {
    AnySelectMenuInteraction,
    BaseInteraction,
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    Collection,
    CommandInteraction,
    Events,
    Interaction,
    MentionableSelectMenuInteraction,
    ModalSubmitInteraction,
    PermissionsBitField,
    RoleSelectMenuInteraction,
    StringSelectMenuInteraction,
    UserSelectMenuInteraction
} from 'discord.js';
import { CustomError, CustomErrors } from '../../../../utils/errors';
import { Locales, TranslationFunctions } from '../../../../locales/i18n-types';
import { Embed } from '../../../../utils/embedsUtil';
import { IDiscordClient } from '../../../../client';
import { IGuild } from 'adroi.d.ea';
import { client } from '../../../../';
import guildService from '../../../../services/guild.service';
import { hasMemberPermission } from '../../../../utils/memberUtil';
import { i18nObject } from '../../../../locales/i18n-util';
import { loadLocaleAsync } from '../../../../locales/i18n-util.async';
import { timestampToDate } from '../../../../utils/botUtil';

async function loadLL(locale: Locales): Promise<TranslationFunctions> {
    await loadLocaleAsync(locale);
    return i18nObject(locale);
}

export default {
    name: Events.InteractionCreate,
    async execute(client: IDiscordClient, interaction: Interaction) {
        if (!interaction.guildId) return;
        if (interaction instanceof CommandInteraction) {
            await handleCommandInteraction(client, interaction);
        } else if (
            interaction instanceof ButtonInteraction ||
            interaction instanceof ModalSubmitInteraction ||
            interaction instanceof StringSelectMenuInteraction ||
            interaction instanceof UserSelectMenuInteraction ||
            interaction instanceof RoleSelectMenuInteraction ||
            interaction instanceof MentionableSelectMenuInteraction ||
            interaction instanceof ChannelSelectMenuInteraction
        ) {
            await handleComponentInteraction(client, interaction);
        }
    }
};

/**
 * Handles a command interaction.
 * @param client - The Discord client.
 * @param interaction - The command interaction.
 */
const handleCommandInteraction = async (
    client: IDiscordClient,
    interaction: CommandInteraction
) => {
    const guildSettings: IGuild = await guildService.getOrCreateGuild(interaction.guild!);
    const command = client.commands.get(interaction.commandName);

    const LL = await loadLL((guildSettings.locale as Locales) ?? 'en');

    try {
        if (!command) throw CustomErrors.UnknownCommandError;

        checkCommandPermissions(
            interaction.member?.permissions as PermissionsBitField,
            command.permissions
        );

        const cooldownAmount = calculateCooldownAmount(command);
        handleCooldown(interaction.user.id, command.data.name, cooldownAmount);

        if (interaction.isChatInputCommand()) {
            await command.execute(client, interaction, guildSettings, LL);
        }
    } catch (err) {
        handleError(interaction, err);
    }
};

/**
 * Checks if the member has the required permissions to execute a command.
 * @param memberPermissions The permissions of the member.
 * @param commandPermissions The required permissions for the command.
 * @throws {CustomErrors.UserNoPermissionsError} If the member does not have the required permissions.
 */
const checkCommandPermissions = (
    memberPermissions: PermissionsBitField,
    commandPermissions: PermissionsBitField[]
) => {
    if (!hasMemberPermission(memberPermissions, commandPermissions)) {
        throw CustomErrors.UserNoPermissionsError;
    }
};

/**
 * Calculates the cooldown amount for a command.
 * If the command has a custom cooldown, it will be used.
 * Otherwise, the default cooldown duration will be used.
 * @param command - The command object.
 * @returns The cooldown amount in milliseconds.
 */
const calculateCooldownAmount = (command: any): number => {
    const defaultCooldownDuration = 5;
    return (command.cooldown ?? defaultCooldownDuration) * 1000;
};

/**
 * Handles cooldown for a command.
 * @param userId - The ID of the user.
 * @param commandName - The name of the command.
 * @param cooldownAmount - The cooldown duration in milliseconds.
 */
export const handleCooldown = (userId: string, commandName: string, cooldownAmount: number) => {
    if (!client.cooldowns.has(commandName)) {
        client.cooldowns.set(commandName, new Collection());
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(commandName);
    if (timestamps?.has(userId)) {
        const expirationTime = timestamps.get(userId) + cooldownAmount;
        if (now < expirationTime) {
            const expiredTimestamp = timestampToDate(expirationTime);
            throw CustomErrors.CooldownError(expiredTimestamp);
        }
    }
    timestamps.set(userId, now);
    setTimeout(() => timestamps.delete(userId), cooldownAmount);
};

/**
 * Handles component interactions from the client.
 * @param client - The Discord client.
 * @param interaction - The base interaction object.
 */
const handleComponentInteraction = async (client: IDiscordClient, interaction: BaseInteraction) => {
    const guildSettings: IGuild = await guildService.getOrCreateGuild(interaction.guild!);

    const LL = await loadLL((guildSettings.locale as Locales) ?? 'en');
    if (interaction.isButton()) {
        try {
            const button = client.buttons.get(interaction.customId);
            if (button) {
                const cooldownAmount = calculateCooldownAmount(button);
                handleCooldown(interaction.user.id, button.data.name, cooldownAmount);
                await executeButtonInteraction(button, interaction, guildSettings, LL);
            }
        } catch (err) {
            handleError(interaction, err);
        }
    } else if (interaction.isAnySelectMenu()) {
        try {
            const selectMenu = client.selectMenus.get(interaction.customId);
            if (selectMenu) {
                const cooldownAmount = calculateCooldownAmount(selectMenu);
                handleCooldown(interaction.user.id, selectMenu.data.name, cooldownAmount);
                await executeSelectMenuInteraction(selectMenu, interaction, guildSettings, LL);
            }
        } catch (err) {
            handleError(interaction, err);
        }
    } else if (interaction.isModalSubmit()) {
        try {
            const modal = client.modals.get(interaction.customId);
            if (modal) {
                await executeModalSubmitInteraction(modal, interaction, guildSettings, LL);
            }
        } catch (err) {
            handleError(interaction, err);
        }
    }
};

/**
 * Executes a button interaction.
 * @param button - The button to execute.
 * @param interaction - The button interaction.
 * @param guildSettings - The guild settings.
 * @param LL - The translation functions.
 */
const executeButtonInteraction = async (
    button: any,
    interaction: ButtonInteraction,
    guildSettings: IGuild,
    LL: TranslationFunctions
) => {
    try {
        await button.execute(interaction, guildSettings, LL);
    } catch (err) {
        handleError(interaction, err);
    }
};

/**
 * Executes a select menu interaction.
 * @param selectMenu - The select menu to execute.
 * @param interaction - The select menu interaction.
 * @param guildSettings - The guild settings.
 * @param LL - The translation functions.
 */
const executeSelectMenuInteraction = async (
    selectMenu: any,
    interaction: AnySelectMenuInteraction,
    guildSettings: IGuild,
    LL: TranslationFunctions
) => {
    try {
        await selectMenu.execute(interaction, guildSettings, LL);
    } catch (err) {
        handleError(interaction, err);
    }
};

/**
 * Executes the modal submit interaction.
 * @param modal - The modal object.
 * @param interaction - The modal submit interaction.
 * @param guildSettings - The guild settings.
 * @param LL - The translation functions.
 * @returns A promise that resolves when the execution is complete.
 */
const executeModalSubmitInteraction = async (
    modal: any,
    interaction: ModalSubmitInteraction,
    guildSettings: IGuild,
    LL: TranslationFunctions
) => {
    try {
        await modal.execute(interaction, guildSettings, LL);
    } catch (err) {
        handleError(interaction, err);
    }
};

/**
 * Handles errors that occur during interaction handling.
 * @param interaction - The interaction object.
 * @param err - The error object.
 */
const handleError = async (
    interaction:
        | CommandInteraction
        | AnySelectMenuInteraction
        | ModalSubmitInteraction
        | ButtonInteraction,
    err: any
) => {
    if (err instanceof CustomError) {
        const embed = Embed.error(err.message);
        interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
        const embed = Embed.error(CustomErrors.UnknownError.message);
        interaction.reply({ embeds: [embed], ephemeral: true });
        console.error(err);
    }
};
