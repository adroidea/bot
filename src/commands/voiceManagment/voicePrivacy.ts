import {
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  CommandInteraction,
  GuildChannel,
  GuildMember,
  PermissionsBitField,
  SlashCommandBuilder
} from "discord.js";
import {
  ModuleNotEnabledError,
  NotVoiceChannelOwnerError,
  SelfBanError,
  ToDoError,
  UnknownCommandError
} from "../../utils/errors";
import { IGuild } from "../../models";
import { checkTemporaryVoiceModule } from "../../utils/botUtil";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("voice")
    .setDescription("Gère ton salon vocal temporaire")

    .addSubcommand(subcommand =>
      subcommand
        .setName("ban")
        .setDescription("Bannir un membre de ton salon")
        .addUserOption(option =>
          option
            .setName("membre")
            .setDescription("Le membre à bannir")
            .setRequired(true)
        )
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("unban")
        .setDescription("Débannir un utilisateur de ton salon")
        .addUserOption(option =>
          option
            .setName("membre")
            .setDescription("Le membre à débannir")
            .setRequired(true)
        )
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("limite")
        .setDescription("Limiter le nombre de membres dans ton salon")
        .addIntegerOption(option =>
          option
            .setName("limite")
            .setDescription("1 à 99, 0 retire la limite")
            .setMaxValue(99)
            .setRequired(true)
        )
    ),
  category: "voice",
  cooldown: 30,
  permissions: [PermissionsBitField.Flags.SendMessages],
  usage: "voice [commande] [member] ou [option]",
  examples: "voice ban @adan_ea#3945",

  async execute(
    client: Client,
    interaction: CommandInteraction,
    guildSettings: IGuild
  ) {
    if (!checkTemporaryVoiceModule(guildSettings)) throw ModuleNotEnabledError;

    const member = interaction.member as GuildMember;

    const memberVoiceChannel = member.voice.channel;

    if (!memberVoiceChannel) {
      throw NotVoiceChannelOwnerError;
    }

    const voiceChannel = await interaction.guild!.channels.fetch(
      memberVoiceChannel.id
    );

    const subcommand = (
      interaction as ChatInputCommandInteraction
    ).options.getSubcommand();

    switch (subcommand) {
      case "ban": {
        const target = interaction.options.getMember("membre") as GuildMember;

        if (isMembersInSameVoice(member, target)) {
          await target.voice.disconnect();
        }

        await (voiceChannel as GuildChannel).permissionOverwrites.edit(
          target.id,
          {
            ViewChannel: false,
            Connect: false
          }
        );

        return interaction.reply({
          content: `${target} a été banni du salon.`,
          ephemeral: true
        });
      }

      case "unban": {
        const target = interaction.options.getMember("membre") as GuildMember;
        await (voiceChannel as GuildChannel).permissionOverwrites.edit(
          target.id,
          {
            ViewChannel: null,
            Connect: null
          }
        );

        return interaction.reply({
          content: `${target} a été débanni du salon.`,
          ephemeral: true
        });
      }

      case "limite": {
        const userLimit = (
          interaction as ChatInputCommandInteraction
        ).options.getInteger("limite", true);

        if (voiceChannel && voiceChannel.type === ChannelType.GuildVoice) {
          await voiceChannel.setUserLimit(userLimit);
          if (userLimit > 0) {
            return interaction.reply({
              content: `Le nombre de place dans le salon est maintenant limité à ${userLimit}.`,
              ephemeral: true
            });
          } else {
            return interaction.reply({
              content: `La limite d'utilisateurs a été supprimée.`,
              ephemeral: true
            });
          }
        }

        break;
      }

      default: {
        throw UnknownCommandError;
      }
    }
  }
};

const isMembersInSameVoice = (member: GuildMember, target: GuildMember) => {
  const memberVoiceChannel = member.voice.channel;
  const targetVoiceChannel = target.voice.channel;

  if (member.id === target.id) {
    throw SelfBanError;
  }

  if (!memberVoiceChannel || !targetVoiceChannel) {
    return false;
  }

  if (memberVoiceChannel.id !== targetVoiceChannel.id) {
    return false;
  }

  const isAdmin = target.permissions.has(
    PermissionsBitField.Flags.Administrator
  );
  if (isAdmin) {
    throw ToDoError;
  }

  return true;
};
