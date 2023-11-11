import { dropUndefinedFields } from '../src/utils/drop-undefined-fields';

describe('dropUndefinedFields', () => {
  const fn = () => {};

  const obj = {
    s: 'str',
    i: 123,
    r: 12.34,
    fn,
    o: {
      a: 1,
      b: 'b',
      c: undefined,
    },
    a: [1, 2, 3],
    ao: [{ a: 1, n: null, u: undefined }],
    u: undefined,
    n: null,
  };
  const copy = { ...obj };
  const expected = {
    s: 'str',
    i: 123,
    r: 12.34,
    fn,
    o: {
      a: 1,
      b: 'b',
    },
    a: [1, 2, 3],
    ao: [{ a: 1 }],
  };

  it('should return a copy without undefined/null fields', () => {
    expect(dropUndefinedFields(obj)).toEqual(expected);
  });

  it('should not modify the original input', () => {
    dropUndefinedFields(obj);
    expect(obj).toEqual(copy);
  });

  it('should provide copies for objects and arrays', () => {
    const res = dropUndefinedFields(obj);

    expect(res).not.toBe(obj);
    expect(res.o).not.toBe(obj.o);
    expect(res.a).not.toBe(obj.a);

    // functions are references
    expect(res.fn).toBe(obj.fn);
  });
});
