import { bold, roleMention, underscore } from 'discord.js';
import { ITMAlerts } from 'adroi.d.ea';

export let accessToken = {
    access_token: '',
    expiration_date: new Date(),
    token_type: 'bearer'
};

export interface Stream {
    id: string;
    user_id: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
}

const createToken = async () => {
    const params = new URLSearchParams();
    params.append('client_id', process.env.TWITCH_CLIENT_ID!);
    params.append('client_secret', process.env.TWITCH_CLIENT_SECRET!);
    params.append('grant_type', 'client_credentials');

    try {
        const response = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        accessToken = {
            access_token: data.access_token,
            expiration_date: new Date(Date.now() + data.expires_in * 1000),
            token_type: 'bearer'
        };
        return accessToken;
    } catch (error: any) {
        console.error('Request error:', error.message);
    }
};

export const getAccessToken = async () => {
    if (accessToken.access_token === '' || accessToken.expiration_date < new Date()) {
        await createToken();
    }
    return accessToken.access_token;
};

/**
 * Randomly selects and returns an element from the given array.
 * @param array - The array to be randomized.
 * @returns The randomly selected element from the array.
 */
export const randomizeArray = (array: string[]): string => {
    const randomNumber = Math.floor(Math.random() * array.length);
    return array[randomNumber];
};

export const fetchTwitchStream = async (userLogin: string): Promise<Stream[]> => {
    const accessToken = await getAccessToken();

    const apiUrl = `https://api.twitch.tv/helix/streams?user_login=${userLogin}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID!
            }
        });

        if (!response.ok) {
            throw new Error(`status: ${response.status} ${response.statusText}`);
        }

        const { data } = await response.json();

        return data;
    } catch (error: any) {
        throw new Error(`Fetch error for __${userLogin}__. ${error.message}`);
    }
};

export const buildLiveStartTitle = (streamData: Stream, alerts: ITMAlerts): string => {
    let template: string = randomizeArray(alerts.message.streamStart);

    if (!template)
        template =
            "{role}, **{streamer.name}** est en live ! C'est l'heure de laisser la réalité derrière toi et de plonger dans le monde de {game.name} !";

    template = template
        .replace('{role}', alerts.pingedRole ? roleMention(alerts.pingedRole) : '')
        .replace('{streamer.id}', streamData.user_id)
        .replace('{streamer.name}', streamData.user_name)
        .replace('{game.id}', streamData.game_id)
        .replace('{game.name}', underscore(bold(streamData.game_name)));
    return template;
};
