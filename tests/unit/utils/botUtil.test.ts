import { timestampToDate } from '../../../src/utils/botUtil';

describe('timestampToDate', () => {
    it('correctly converts a timestamp to a date in seconds', () => {
        const timestamp = 1630473600000;
        const expectedResult = 1630473600;

        const result = timestampToDate(timestamp);

        expect(result).toBe(expectedResult);
    });

    it('correctly handles negative timestamps', () => {
        const timestamp = -1630473600000;
        const expectedResult = -1630473600;

        const result = timestampToDate(timestamp);

        expect(result).toBe(expectedResult);
    });

    it('correctly handles a null timestamp', () => {
        const timestamp = 0;
        const expectedResult = 0;

        const result = timestampToDate(timestamp);

        expect(result).toBe(expectedResult);
    });
});
