import { timestampToDate } from '../../../src/utils/botUtil';

describe('timestampToDate', () => {
    it('correctly converts a timestamp to a date in seconds', () => {
        const timestamp = 1630473600000; // A timestamp in milliseconds (e.g., 1630473600000 corresponds to 2021-09-01T00:00:00Z)
        const expectedResult = 1630473600; // The corresponding date in seconds

        const result = timestampToDate(timestamp);

        expect(result).toBe(expectedResult);
    });

    it('correctly handles negative timestamps', () => {
        const timestamp = -1630473600000; // A negative timestamp in milliseconds
        const expectedResult = -1630473600; // The corresponding date in seconds (negative)

        const result = timestampToDate(timestamp);

        expect(result).toBe(expectedResult);
    });

    it('correctly handles a null timestamp', () => {
        const timestamp = 0; // Null timestamp
        const expectedResult = 0; // Expected result is also null

        const result = timestampToDate(timestamp);

        expect(result).toBe(expectedResult);
    });
});
