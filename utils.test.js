import { max2, getVectorLength, rotate } from './utils';

describe('#rotate', () => {
  it('rotates a point around the origin theta degrees', () => {
    const originalPoint = { x: 0, y: 1 };
    const rotatedPoint = rotate(originalPoint, 180);
    // Because of floating point numbers, these will be imprecise.
    expect(rotatedPoint).toMatchObject(
      { x: expect.closeTo(0, 5), y: expect.closeTo(-1, 5) },
    );
  });
});

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
