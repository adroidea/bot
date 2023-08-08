import {
    AnySelectMenuInteraction,
    BaseInteraction,
    ButtonInteraction,
    Collection,
    CommandInteraction,
    Events,
    Interaction,
    ModalSubmitInteraction,
    PermissionsBitField,
    StringSelectMenuInteraction
} from 'discord.js';
import { CustomError, CustomErrors } from '../../../../utils/errors';
import { Embed } from '../../../../utils/embedsUtil';
import { IDiscordClient } from '../../../../client';
import { IGuild } from '../../../../models';
import { checkMemberPermission } from '../../../../utils/memberUtil';
import { client } from '../../../../';
import guildService from '../../../../services/guildService';
import { timestampToDate } from '../../../../utils/botUtil';

module.exports = {
    name: Events.InteractionCreate,
    async execute(client: IDiscordClient, interaction: Interaction) {
        if (interaction instanceof CommandInteraction) {
            await handleCommandInteraction(client, interaction);
        } else if (
            interaction instanceof ButtonInteraction ||
            interaction instanceof ModalSubmitInteraction ||
            interaction instanceof StringSelectMenuInteraction
        ) {
            await handleComponentInteraction(client, interaction);
        }
    }
};

const handleCommandInteraction = async (
    client: IDiscordClient,
    interaction: CommandInteraction
) => {
    const guildSettings: IGuild = await guildService.getorCreateGuild(interaction.guildId!);
    const command = client.commands.get(interaction.commandName);

    try {
        if (!command) throw CustomErrors.UnknownCommandError;

        checkCommandPermissions(
            interaction.member?.permissions as PermissionsBitField,
            command.permissions
        );

        const cooldownAmount = calculateCooldownAmount(command);
        handleCooldown(interaction.user.id, command.data.name, cooldownAmount);

        if (interaction.isChatInputCommand()) {
            await command.execute(client, interaction, guildSettings);
        }
    } catch (err) {
        handleError(interaction, err);
    }
};

const checkCommandPermissions = (
    memberPermissions: PermissionsBitField,
    commandPermissions: PermissionsBitField[]
) => {
    if (!checkMemberPermission(memberPermissions, commandPermissions)) {
        throw CustomErrors.UserNoPermissionsError;
    }
};

const calculateCooldownAmount = (command: any): number => {
    const defaultCooldownDuration = 5;
    return (command.cooldown ?? defaultCooldownDuration) * 1000;
};

const handleCooldown = (userId: string, commandName: string, cooldownAmount: number) => {
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

const handleComponentInteraction = async (client: IDiscordClient, interaction: BaseInteraction) => {
    if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId);
        if (button) {
            await executeButtonInteraction(button, interaction);
        }
    } else if (interaction.isAnySelectMenu()) {
        const selectMenu = client.selectMenus.get(interaction.customId);
        if (selectMenu) {
            await executeSelectMenuInteraction(selectMenu, interaction);
        }
    } else if (interaction.isModalSubmit()) {
        const modal = client.modals.get(interaction.customId);
        if (modal) {
            await executeModalSubmitInteraction(modal, interaction);
        }
    }
};

const executeButtonInteraction = async (button: any, interaction: ButtonInteraction) => {
    try {
        await button.execute(interaction);
    } catch (err) {
        handleError(interaction, err);
    }
};

const executeSelectMenuInteraction = async (
    selectMenu: any,
    interaction: AnySelectMenuInteraction
) => {
    try {
        await selectMenu.execute(interaction);
    } catch (err) {
        handleError(interaction, err);
    }
};

const executeModalSubmitInteraction = async (modal: any, interaction: ModalSubmitInteraction) => {
    try {
        await modal.execute(interaction);
    } catch (err) {
        handleError(interaction, err);
    }
};

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
