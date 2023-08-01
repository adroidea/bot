import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    PermissionsBitField,
    TextChannel,
    roleMention
} from 'discord.js';
import { liveStart, randomizeArray } from '../../modules/twitchLive/tasks/twitchAlert.cron';
import { Colors } from '../../utils/consts';
import { CustomErrors } from '../../utils/errors';
import { IGuild } from '../../models';

module.exports = {
    data: {
        name: 'kicklive',
        description: '[ADMIN] pour adan_ea ca te sert à rien bébou',
        options: [
            {
                name: 'title',
                description: 'stream title',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'game',
                description: 'stream game',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'gameid',
                description: 'stream gameid',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    category: 'moderation',
    cooldown: 30,
    permissions: [PermissionsBitField.Flags.Administrator],
    usage: 'channel [commande] [channel]',
    examples: 'channel list all',

    async execute(client: Client, interaction: ChatInputCommandInteraction, guildSettings: IGuild) {
        //Export const sendLiveEmbed = async (streamData: Stream, twitchLive: ITwitchLive, guild: Guild) => {

        const streamData = {
            game_id: interaction.options.getString('gameid')!,
            title: interaction.options.getString('title')!,
            game_name: interaction.options.getString('game')!
        };

        const { game_id, title } = streamData;
        const { infoLiveChannel, pingedRole } = guildSettings.modules.twitchLive;

        const channel: TextChannel | undefined = client.channels.cache.get(
            infoLiveChannel!
        ) as TextChannel;
        if (!channel) throw CustomErrors.ToDoError;

        const twitchAvatarURL: string = await (
            await fetch(`https://api.crunchprank.net/twitch/avatar/adan_ea/`)
        ).text();

        const embed = new EmbedBuilder()
            .setAuthor({
                iconURL: twitchAvatarURL,
                name: `adan_ea est en live sur KICK !`
            })
            .setTitle(`${title}`)
            .setURL(`https://kick.com/adan-ea`)
            .addFields([
                {
                    name: `**Jeu**`,
                    value: streamData.game_name,
                    inline: false
                }
            ])
            .setImage(
                `https://cdn.discordapp.com/attachments/1050382523261276210/1134499698804281534/image.png`
            )
            .setThumbnail(`https://static-cdn.jtvnw.net/ttv-boxart/${game_id}-144x192.jpg`)
            .setColor(Colors.kick);

        await channel.send({
            content: `${pingedRole ? roleMention(pingedRole) + ', ' : ''}adan_ea ${randomizeArray(
                liveStart
            )} **__${streamData.game_name}__**.`,
            embeds: [embed]
        });

        await interaction.guild!.setIcon(
            'https://cdn.discordapp.com/attachments/1050382523261276210/1134473543707529326/icone-live_kick.png'
        );
    }
};
