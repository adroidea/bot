import { EmbedBuilder, Guild, TextChannel, roleMention } from 'discord.js';
import { IGuild, ITwitchModule } from 'adroi.d.ea';
import { Stream, fetchTwitchStream, randomizeArray } from '../../../utils/twitchUtil';
import { Colors } from '../../../utils/consts';
import { client } from '../../../index';
import cron from 'node-cron';
import { guildsCache } from '../../core/tasks/createCache.cron';
import logger from '../../../utils/logger';
import path from 'path';

const filePath = path.join(__dirname, __filename);

interface LiveStatus {
    isLive: boolean;
    currentGame: string;
    cooldown: number | null;
}

const streamersList = new Map<string, LiveStatus>();

export default function (): cron.ScheduledTask {
    return cron.schedule('* * * * *', async () => {
        try {
            for (const guild of guildsCache) {
                await handleGuild(guild);
            }
        } catch (err: any) {
            logger.error('Error :', err, filePath);
        }
    });
}

/**
 * Handles the guild for Twitch live stream alerts.
 * @param guild - The guild object.
 * @returns A Promise that resolves when the guild is handled.
 */
const handleGuild = async (guild: IGuild) => {
    const guildData: Guild = client.guilds.cache.get(guild.id);
    if (!guildData) return;

    const { twitch: twitchModule } = guild.modules;
    const { enabled, alerts } = twitchModule;
    if (!enabled) return;

    const liveStatus: LiveStatus = streamersList.get(guild.id) ?? {
        isLive: false,
        currentGame: '',
        cooldown: null
    };
    const data = await fetchTwitchStream(alerts.streamerName);
    const streamData = data[0];
    if (streamData?.type === 'live') {
        await handleLiveStream(streamData, liveStatus, twitchModule, guildData);
    } else {
        await handleOfflineStream(liveStatus, twitchModule, guildData);
    }
    streamersList.set(guild.id, liveStatus);
};

/**
 * Handles the live stream event.
 * @param streamData - The stream data.
 * @param liveStatus - The live status.
 * @param twitchModule - The Twitch Live object.
 * @param guildData - The guild data.
 */
const handleLiveStream = async (
    streamData: Stream,
    liveStatus: LiveStatus,
    twitchModule: ITwitchModule,
    guildData: Guild
) => {
    if (!liveStatus.isLive && !liveStatus.cooldown) {
        await sendLiveEmbed(streamData, twitchModule, guildData);
        liveStatus.isLive = true;
        liveStatus.currentGame = streamData.game_name;
        liveStatus.cooldown = 30;
    }
    if (streamData.game_name !== liveStatus.currentGame) {
        await sendGameChangeEmbed(streamData, twitchModule, guildData.id);
        liveStatus.currentGame = streamData.game_name;
    }
    liveStatus.cooldown = liveStatus.cooldown ? --liveStatus.cooldown : liveStatus.cooldown;
};

/**
 * Handles the offline stream event.
 * If the stream is currently live, it updates the guild's icon to the default profile picture,
 * and resets the live status properties.
 * @param liveStatus - The current live status.
 * @param twitchModule - The Twitch live data.
 * @param guildData - The guild data.
 */
const handleOfflineStream = async (
    liveStatus: LiveStatus,
    twitchModule: ITwitchModule,
    guildData: Guild
) => {
    if (liveStatus.isLive) {
        if (twitchModule.alerts.defaultProfilePicture) {
            await guildData.setIcon(twitchModule.alerts.defaultProfilePicture);
        }
        liveStatus.isLive = false;
        liveStatus.currentGame = '';
        liveStatus.cooldown = null;
    }
};

/**
 * Sends a live embed message to a specified channel with information about a Twitch stream.
 * @param streamData - The data of the Twitch stream.
 * @param twitchModule - The Twitch live configuration.
 * @param guild - The guild where the live embed message will be sent.
 */
export const sendLiveEmbed = async (
    streamData: Stream,
    twitchModule: ITwitchModule,
    guild: Guild
) => {
    const { user_name, game_id, title } = streamData;
    const { alerts } = twitchModule;
    const { infoLiveChannel, pingedRole } = alerts;

    const channel: TextChannel | undefined = client.channels.cache.get(
        infoLiveChannel
    ) as TextChannel;
    if (!channel) return;

    const twitchAvatarURL: string = await (
        await fetch(`https://decapi.me/twitch/avatar/${user_name}`)
    ).text();

    const image = `${streamData.thumbnail_url.replace('{width}x{height}', '1920x1080')}?r=${
        streamData.id
    }?`;
    const embed = new EmbedBuilder()
        .setAuthor({
            iconURL: twitchAvatarURL,
            name: `${user_name} est en live sur Twitch !`
        })
        .setTitle(`${title}`)
        .setURL(`https://twitch.tv/${user_name}`)
        .addFields([
            {
                name: `**Jeu**`,
                value: streamData.game_name,
                inline: false
            }
        ])
        .setImage(image)
        .setThumbnail(`https://static-cdn.jtvnw.net/ttv-boxart/${game_id}-144x192.jpg`)
        .setColor(Colors.twitch);

    await channel.send({
        content: `${pingedRole ? roleMention(pingedRole) + ', ' : ''}${
            streamData.user_name
        } ${randomizeArray(liveStart)} **__${streamData.game_name}__**.`,
        embeds: [embed]
    });

    if (twitchModule.alerts.liveProfilePicture) {
        await guild.setIcon(twitchModule.alerts.liveProfilePicture);
    }
};

/**
 * Sends a game change embed message to the specified Twitch live channel.
 * @param streamData The stream data containing information about the current stream.
 * @param twitchModule The Twitch live object.
 * @param guildId The ID of the guild.
 */
const sendGameChangeEmbed = async (
    streamData: Stream,
    twitchModule: ITwitchModule,
    guildId: string
) => {
    const currentGame = streamersList.get(guildId)?.currentGame;
    const channelMessage = client.channels.cache.get(twitchModule.alerts.infoLiveChannel);
    const gameChangeEmbed = new EmbedBuilder()
        .setDescription(
            `${randomizeArray(gameChangePartOne)} **${currentGame}**. ${randomizeArray(
                gameChangePartTwo
            )} **${streamData.game_name}**. ${randomizeArray(gameChangePartThree)}`
        )
        .setThumbnail(`https://static-cdn.jtvnw.net/ttv-boxart/${streamData.game_id}-144x192.jpg`)
        .setColor(Colors.red);

    await channelMessage.send({ embeds: [gameChangeEmbed] });
};

const liveStart = [
    'vient tout juste de lancer un stream ! Viens pour voir du',
    'stream actuellement, il manque plus que toi. Rejoins nous pour du',
    'a enfin lancé son stream ! Go prendre tes snacks et regarder du',
    "est enfin en live ! J'espère que t'as de quoi manger pour regarder du",
    'vient de lancer son stream, alors ramène ton petit boule qui chamboule pour du',
    'est en live ! Rejoins le pour du',
    'va te montrer ses skills (ou pas) en stream ! Viens vite pour ne pas le rater sur',
    'est pas là! Mais il est où ? Bah sur',
    "vient d'arriver ksksks, et si toi aussi tu arrivais ? On va tous s'amuser sur",
    'a une absence incroyable de skill à te présenter sur',
    "a ou n'a pas un burger chèvre miel, à toi de le découvrir en venant, tu pourras profiter pour regarder du non skill sur",
    "Viens. C'est pas une demande, c'est un ordre",
    'est en direct pour vous offrir des moments de folie. Lâchez tout ce que vous faites pour',
    'est sur le point de vous en mettre plein les yeux sur',
    "est en direct. C'est le moment de laisser votre journée de côté et de vous plonger dans l'aventure",
    "est là pour vous si vous êtes à la recherche d'une dose de divertissement sur",
    "est en live ! C'est l'heure de laisser la réalité derrière toi et de plonger dans le monde de",
    'est là. Bouge ton cul merci. On est sur'
];

const gameChangePartOne = [
    'Bon, on a eu marre de faire du',
    'Votre streamer vient tout juste de rage quit',
    'On veut plus faire de',
    'On a été fatigué par',
    'Le petit alt f4 des familles a été fait sur',
    "On suit le planning (ca m'étonnerai que ce soit vrai) donc on quitte",
    'Adieu',
    'Au revoir',
    'Après avoir dit au revoir à',
    'Dernier round pour',
    'Notre voyage touche à sa fin sur',
    "L'heure est venue de dire au revoir à"
];

const gameChangePartTwo = [
    'On passe sur',
    'On va donc faire un petit tour sur',
    'En échange ca te tente un peu de',
    'Place au prochain jeu :',
    'On accueille à bras ouverts',
    'Changeons pour',
    'Préparons-nous pour',
    'Le moment est venu de jouer à',
    'Nouveau jeu, nouveaux défis :'
];

const gameChangePartThree = [
    '(On est pas fou en vrai sur ça, mais on aime bien quand même)',
    'Quelle aventure nous attend cette fois-ci ?',
    'Prêts ?',
    'Accrochez-vous, ça va être intense.',
    'Préparez-vous à une nouvelle aventure.',
    'Préparez-vous pour un divertissement de haut niveau',
    '',
    '',
    '',
    ''
];
