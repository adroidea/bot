import { Stream, buildLiveStartTitle, randomizeArray } from './../../../src/utils/twitchUtil';
import { ITMAlerts } from 'adroi.d.ea';

describe('randomizeArray', () => {
    it('should return undefined for an empty array', () => {
        const result = randomizeArray([]);
        expect(result).toBeUndefined();
    });

    it('should return a valid element from the array', () => {
        const array = ['one', 'two', 'three', 'four'];
        const result = randomizeArray(array);
        expect(array).toContain(result);
    });
});

describe('buildLiveStartTitle', () => {
    const streamData: Stream = {
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

    const alerts: ITMAlerts = {
        enabled: true,
        defaultProfilePicture: '',
        liveProfilePicture: '',
        streamerName: 'test_streamer_name',
        infoLiveChannel: '123456789',
        notifyChange: true,
        ignoredCategories: ['test_category'],
        message: {
            streamStart: ['{role}, {streamer} started streaming {game}!'],
            gameChange: []
        },
        pingedRole: '987654321'
    };

    it('should build a valid live start title', () => {
        const result = buildLiveStartTitle(streamData, alerts);

        const expected = '<@&987654321>, test_user_name started streaming test_game_name!';

        expect(result).toEqual(expected);
    });

    it('should build a valid live start title without a pinged role', () => {
        alerts.pingedRole = '';
        const result = buildLiveStartTitle(streamData, alerts);

        const expected = 'test_user_name started streaming test_game_name!';

        expect(result).toEqual(expected);
    });

    it('should build a valid live start title without a custom message', () => {
        alerts.message.streamStart = [];
        const result = buildLiveStartTitle(streamData, alerts);

        const expected = '<@&987654321>, test_user_name started streaming test_game_name!';

        expect(result).toEqual(expected);
    });
});
