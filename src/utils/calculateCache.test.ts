import { calculateCache, Interval } from './calculateCache';

afterAll(() => {
  jest.useRealTimers();
});

describe('calculateCache', () => {
  describe('when using 22mins 40 seconds', () => {
    beforeAll(() => {
      jest.useFakeTimers('modern');
      jest.setSystemTime(new Date(2020, 3, 1, 10, 22, 40));
    });
    afterAll(() => {
      jest.useRealTimers();
    });

    it('returns minutes to 15 when SMALL', () => {
      const interval = calculateCache(Interval.SMALL);
      expect(interval).toEqual('440 seconds');
    });
    it('returns minutes to 30 when MEDIUM', () => {
      const interval = calculateCache(Interval.MEDIUM);
      expect(interval).toEqual('440 seconds');
    });
    it('returns minutes to 60 when LARGE', () => {
      const interval = calculateCache(Interval.LARGE);
      expect(interval).toEqual('2240 seconds');
    });
  });

  describe('when using 34mins 0 seconds', () => {
    beforeAll(() => {
      jest.useFakeTimers('modern');
      jest.setSystemTime(new Date(2020, 3, 1, 10, 34, 0));
    });
    afterAll(() => {
      jest.useRealTimers();
    });

    it('returns minutes to 15 when SMALL', () => {
      const interval = calculateCache(Interval.SMALL);
      expect(interval).toEqual('660 seconds');
    });
    it('returns minutes to 30 when MEDIUM', () => {
      const interval = calculateCache(Interval.MEDIUM);
      expect(interval).toEqual('1560 seconds');
    });
    it('returns minutes to 60 when LARGE', () => {
      const interval = calculateCache(Interval.LARGE);
      expect(interval).toEqual('1560 seconds');
    });
  });
});
