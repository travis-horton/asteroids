import { vLength } from './utils';

describe('#vLength', () => {
  it('calculates the length of a vector', () => {
    const length = vLength({ x: 3, y: 4 });
    expect(length).toBe(5);
  });
});
