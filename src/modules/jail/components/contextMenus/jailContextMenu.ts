import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    PermissionsBitField,
    UserContextMenuCommandInteraction
} from 'discord.js';
import { CustomErrors } from '../../../../utils/errors';
import { IGuild } from 'adroi.d.ea';

export const jailContextMenu = new ContextMenuCommandBuilder()
    .setName('Prison pour temps aléatoire')
    .setType(ApplicationCommandType.User)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.MoveMembers);

export default {
    data: jailContextMenu.toJSON(),
    async execute(interaction: UserContextMenuCommandInteraction, guildSettings: IGuild) {
        const { jail } = guildSettings.modules;

        if (!jail.enabled) throw CustomErrors.JailDisabledError;
    }
};
