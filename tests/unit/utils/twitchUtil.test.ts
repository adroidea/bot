import { Stream, buildLiveStartTitle, randomizeArray } from './../../../src/utils/twitchUtil';
import { ITMAlerts } from 'adroi.d.ea';

describe('randomizeArray', () => {
    it('should return empty string for an empty array', () => {
        const result = randomizeArray([]);
        expect(result).toEqual('');
    });

    it('should return the only element for an array with one element', () => {
        const result = randomizeArray(['one']);
        expect(result).toEqual('one');
    });

    it('should return a valid element from the array', () => {
        const array = ['one', 'two', 'three', 'four'];
        const result = randomizeArray(array);
        expect(array).toContain(result);
    });
});

describe('buildLiveStartTitle', () => {
    let streamData: Stream;
    let alerts: ITMAlerts;

    beforeEach(() => {
        streamData = {
            id: 'test_id',
            user_id: 'test_user_id',
            user_name: 'test_user_name',
            game_id: 'test_game_id',
            game_name: 'test_game_name',
            type: 'test_type',
            title: 'test_title',
            viewer_count: 65,
            started_at: 'test_started_at',
            language: 'test_language',
            thumbnail_url: 'test_thumbnail_url',
            tag_ids: []
        };

        alerts = {
            enabled: true,
            defaultProfilePicture: '',
            liveProfilePicture: '',
            streamerName: 'test_streamer_name',
            infoLiveChannel: '123456789',
            notifyChange: true,
            ignoredCategories: ['test_category'],
            message: {
                streamStart: ['{role}, {streamer.name} started streaming {game.name}!'],
                gameChange: []
            },
            pingedRole: '987654321'
        };
    });

    it('should build a valid live start title', () => {
        const result = buildLiveStartTitle(streamData, alerts);

        const expected = '<@&987654321>, test\\_user\\_name started streaming test_game_name!';

        expect(result).toEqual(expected);
    });

    it('should build a valid live start title without a pinged role', () => {
        alerts.pingedRole = '';
        const result = buildLiveStartTitle(streamData, alerts);

        const expected = ', test\\_user\\_name started streaming test_game_name!';

        expect(result).toEqual(expected);
    });

    it('should use default template when streamStart message array is empty', () => {
        alerts.message.streamStart = [];
        const result = buildLiveStartTitle(streamData, alerts);

        const expected =
            "<@&987654321>, **test\\_user\\_name** est en live ! C'est l'heure de laisser la réalité derrière toi et de plonger dans le monde de **__test_game_name__** !";

        expect(result).toEqual(expected);
    });
});
