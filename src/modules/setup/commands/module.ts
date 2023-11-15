import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Client,
    PermissionsBitField,
    StringSelectMenuBuilder
} from 'discord.js';
import { buildQotdHubEmbed, qotdHubButtons, qotdHubSaveBtn } from '../components/buttons/';
import {
    buildQotdStep1Menu,
    buildTempVoiceDeleteMenu,
    buildTempVoiceHubEmbed,
    tempVoiceAddMenu
} from '../components/selectMenus';
import { IGuild } from '../../../models';
import { Modules } from '../../../utils/consts';
import { buildSelectMenu } from '../components/selectMenus/modulesMenu';

export default {
    data: {
        name: 'module',
        description:
            "Module à configurer. Si aucun module n'est donné, affiche la liste des modules disponibles",
        options: [
            {
                name: 'module',
                description: 'Le module à configurer',
                type: ApplicationCommandOptionType.String,
                required: false,
                choices: Object.values(Modules).map(module => ({
                    name: module.label,
                    value: module.name
                }))
            }
        ]
    },
    category: 'setup',
    guildOnly: false,
    permissions: [PermissionsBitField.Flags.ManageGuild, PermissionsBitField.Flags.ManageChannels],
    usage: 'module [module]',
    examples: ['module', 'module Twitch'],

    async execute(client: Client, interaction: ChatInputCommandInteraction, guildSettings: IGuild) {
        const moduleString = interaction.options.getString('module') ?? 'list';

        const selectMenu: ActionRowBuilder<StringSelectMenuBuilder> = buildSelectMenu();

        switch (moduleString) {
            case Modules.core.name:
                return interaction.reply({
                    content: 'Liste des menus du module Base',
                    ephemeral: true
                });
            case Modules.party.name:
                return interaction.reply({
                    content: 'Liste des menus du module Party',
                    ephemeral: true
                });
            case Modules.qotd.name:
                return interaction.reply({
                    content: '',
                    embeds: [buildQotdHubEmbed(guildSettings.modules.qotd)],
                    components: [qotdHubButtons(1), buildQotdStep1Menu(guildSettings.modules.qotd.channelId), qotdHubSaveBtn],
                    ephemeral: true
                });
            case Modules.scheduledEvents.name:
                return interaction.reply({
                    content: 'Liste des menus du module evenements',
                    ephemeral: true
                });
            case Modules.tempVoice.name:
                return interaction.reply({
                    content: '',
                    embeds: [buildTempVoiceHubEmbed(guildSettings.modules.temporaryVoice)],
                    components: [
                        tempVoiceAddMenu,
                        buildTempVoiceDeleteMenu(guildSettings.modules.temporaryVoice.hostChannels)
                    ],
                    ephemeral: true
                });
            case Modules.twitch.name:
                return interaction.reply({
                    content: 'Liste des menus du module Twitch Live',
                    ephemeral: true
                });
            default:
                return interaction.reply({
                    content: 'Modules disponibles',
                    components: [selectMenu],
                    ephemeral: true
                });
        }
    }
};
