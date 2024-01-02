const clientId = process.env.TWITCH_CLIENT_ID!;

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
    params.append('client_id', clientId);
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

        return (accessToken = {
            access_token: data.access_token,
            expiration_date: new Date(Date.now() + data.expires_in * 1000),
            token_type: 'bearer'
        });
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
                'Client-Id': clientId
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { data } = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        throw new Error('Fetch error:');
    }
};
