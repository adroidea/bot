import { Guild, GuildMember, Role, roleMention } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import { GuildModel } from "../models";
import TwitchApi from "node-twitch";
import { client } from "../../index";
import cron from "node-cron";

const twitch = new TwitchApi({
  client_id: process.env.TWITCH_CLIENT_ID!,
  client_secret: process.env.TWITCH_CLIENT_SECRET!
});

const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const randomizeArray = (array: string[]) => {
  const randomNumber = Math.floor(Math.random() * array.length);
  return array[randomNumber];
};

let IsLiveMemory = false;
let currentGame = "";

export default function (): void {
  if(!process.env.TWITCH_CLIENT_ID) return;
  cron.schedule("* * * * *", async () => {
    
    //Fetch all the guilds in the database
    const guilds = await GuildModel.find().exec();
    
    for (const guild of guilds) {
      //FIXME: DELETE THIS BEFORE PROD
      if (guild.id === "814621177770541076") continue;
      
      //Fetch the actual guild from discord and checks if it exists
      const guildData: Guild = client.guilds.cache.get(guild.id);
      if (!guildData) return;

      const { twitchLive } = guild.modules.notifications;
      const { streamerName, streamers, streamingRoleId, infoLiveChannel } = twitchLive;
      
      if (streamers && streamingRoleId) {
        for (const { streamer, memberId } of streamers) {
          //Fetch the member affiliated with the streamer and checks if they're still in the guild
          const member: GuildMember | undefined = guildData.members.cache.get(memberId);
          if (!member) return;

          //Fetch the role and checks if it exists
          const role: Role | undefined = guildData.roles.cache.get(streamingRoleId);
          if (!role) return;

          const hasRole: boolean = member.roles.cache.some(role => role.id === streamingRoleId);

          //Fetch the streamer
          const response: Promise<string> = (
            await fetch(`https://api.crunchprank.net/twitch/uptime/${streamer}`)
          ).text();

          if ((await response) === `${streamer} is offline`) {
            if (hasRole) {
              member.roles.remove(role);
            }
            continue;
          } else {
            if (hasRole) {
              continue;
            }
            member.roles.add(role);
          }
        }
      }

      try {
        await twitch.getStreams({ channel: streamerName }).then(async data => {
          const channelMessage = client.channels.cache.get(infoLiveChannel);
          const streamData = data.data[0];

          if (streamData !== undefined) {
            if (streamData.type === "live") {
              if (IsLiveMemory === false || IsLiveMemory === undefined) {
                const twitchAvatarURL: string = await (
                  await fetch(`https://api.crunchprank.net/twitch/avatar/${streamData.user_name}`)
                ).text();

                const embed = new EmbedBuilder()
                  .setAuthor({
                    iconURL: twitchAvatarURL,
                    name: `${streamData.user_name} est en live !`
                  })
                  .setTitle(`${streamData.title}`)
                  .setURL(`https://twitch.tv/${streamData.user_name}`)
                  .addFields([
                    {
                      name: `**Jeu**`,
                      value: streamData.game_name,
                      inline: false
                    }
                  ])
                  .setImage(`${streamData.getThumbnailUrl()}?r=${streamData.id}?`)
                  .setThumbnail(
                    `https://static-cdn.jtvnw.net/ttv-boxart/${streamData.game_id}-144x192.jpg`
                  )
                  .setColor([176, 32, 32]);
                channelMessage.send({
                  content: `${
                    twitchLive.pingedRole ? `${roleMention(twitchLive.pingedRole)}, ` : ""
                  }${streamData.user_name} ${randomizeArray(liveStart)} **__${
                    streamData.game_name
                  }__**.`,
                  embeds: [embed]
                });
                if (twitchLive.liveProfilePicture) {
                  await guildData.setIcon(twitchLive.liveProfilePicture);
                }
                IsLiveMemory = true;
                currentGame = streamData.game_name;
                await sleep(900000);
              }
              if (streamData.game_name !== currentGame) {
                const gameChangeEmbed = new EmbedBuilder()
                  .setDescription(
                    `${randomizeArray(gameChangePartOne)} **${currentGame}**. ${randomizeArray(
                      gameChangePartTwo
                    )} **${streamData.game_name}**. ${randomizeArray(gameChangePartThree)}`
                  )
                  .setColor([176, 32, 32]);
                channelMessage.send({ embeds: [gameChangeEmbed] });
                currentGame = streamData.game_name;
              }
            } else if (IsLiveMemory === true) {
              if (twitchLive.defaultProfilePicture) {
                await guildData.setIcon(twitchLive.defaultProfilePicture);
              }
              IsLiveMemory = false;
              currentGame = "";
            }
          } else if (IsLiveMemory === true) {
            if (twitchLive.defaultProfilePicture) {
              await guildData.setIcon(twitchLive.defaultProfilePicture);
            }
            IsLiveMemory = false;
            currentGame = "";
          }
        });
      } catch (err: any) {
        console.error(err);
      }
    }
  });
}

const liveStart = [
  "vient tout juste de lancer un stream ! Viens pour voir du",
  "stream actuellement, il manque plus que toi. Rejoins nous pour du",
  "a enfin lancé son stream ! Go prendre tes snacks et regarder du",
  "est enfin en live ! J'espère que t'as de quoi manger pour regarder du",
  "vient de lancer son stream, alors ramène ton petit boule qui chamboule pour du",
  "est en live ! Rejoins le pour du",
  "va te montrer ses skills (ou pas) en stream ! Viens vite pour ne pas le rater sur",
  "est pas là! Mais il est où ? Bah sur",
  "vient d'arriver ksksks, et si toi aussi tu arrivais ? On va tous s'amuser sur",
  "a une absence incroyable de skill à te présenter sur",
  "a ou n'a pas un burger chèvre miel, à toi de le découvrir en venant, tu pourras profiter pour regarder du non skill sur",
  "Viens. C'est pas une demande, c'est un ordre",
  "est en direct pour vous offrir des moments de folie. Lâchez tout ce que vous faites pour",
  "est sur le point de vous en mettre plein les yeux sur",
  "est en direct. C'est le moment de laisser votre journée de côté et de vous plonger dans l'aventure",
  "est là pour vous si vous êtes à la recherche d'une dose de divertissement sur",
  "est en live ! C'est l'heure de laisser la réalité derrière toi et de plonger dans le monde de",
  "est là. Bouge ton cul merci. On est sur"
];

const gameChangePartOne = [
  "Bon, on a eu marre de faire du",
  "Votre streamer vient tout juste de rage quit",
  "On veut plus faire de",
  "On a été fatigué par",
  "Le petit alt f4 des familles a été fait sur",
  "On suit le planning (ca m'étonnerai que ce soit vrai) donc on quitte",
  "Adieu",
  "Au revoir",
  "Après avoir dit au revoir à",
  "Dernier round pour",
  "Notre voyage touche à sa fin sur",
  "L'heure est venue de dire au revoir à"
];

const gameChangePartTwo = [
  "On passe sur",
  "On va donc faire un petit tour sur",
  "En échange ca te tente un peu de",
  "Place au prochain jeu :",
  "On accueille à bras ouverts",
  "Changeons pour",
  "Préparons-nous pour",
  "Le moment est venu de jouer à",
  "Nouveau jeu, nouveaux défis :"
];

const gameChangePartThree = [
  "(Adan est pas fou en vrai sur ça, mais on l'aime bien quand même)",
  "Quelle aventure nous attend cette fois-ci ?",
  "Prêts ?",
  "Accrochez-vous, ça va être intense.",
  "Préparez-vous à une nouvelle aventure.",
  "Préparez-vous pour un divertissement de haut niveau",
  "",
  "",
  "",
  ""
];
