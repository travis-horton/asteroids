import { max2, getVectorLength } from './utils';

describe('#getVectorLength', () => {
  it('calculates the length of a vector', () => {
    const length = getVectorLength({ x: 3, y: 4 });
    expect(length).toBe(5);
  });
});

describe('#max2', () => {
  it(
    'returns a vector at most length 2 in same theta as original vector',
    () => {
      const shorterVector = max2({ x: 0, y: 3 });
      expect(shorterVector).toMatchObject({ x: 0, y: 2 });
    },
  );
});
