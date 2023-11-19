import { cluster } from '../src/utils/cluster';

describe('cluster', () => {
  // linear data
  const DATA_A = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // grouped data
  const DATA_B = [1, 2, 3, /* 4 */ 5, 6, 7, /* 8 */ 9, 10, 11];
  // data from objects
  const DATA_C = [{ d: 1 }, { d: 2 }, { d: 5 }, { d: 6 }, { d: 9 }, { d: 10 }];

  const nId = (x: number) => x;
  const oId = (o: { d: number }) => o.d;

  it('if no groups are specified it should return an empty array', () => {
    const res = cluster(0, DATA_A, nId);
    expect(res).toEqual([]);
  });

  it('should return the same data (copy) if only 1 group is specified', () => {
    const resA = cluster(1, DATA_A, nId);
    expect(resA).toEqual([DATA_A]);

    const resB = cluster(1, DATA_B, nId);
    expect(resB).toEqual([DATA_B]);

    const resC = cluster(1, DATA_C, oId);
    expect(resC).toEqual([DATA_C]);
  });

  it('should group the data in their own clusters if the number of clusters is the same as the number of data', () => {
    const res = cluster(3, [1, 2, 3], nId);
    expect(res).toEqual([[1], [2], [3]]);
  });

  it('should group data in 2 clusters', () => {
    const resA = cluster(2, DATA_A, nId);
    expect(resA).toEqual([
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
    ]);

    const resB = cluster(2, DATA_B, nId);
    expect(resB).toEqual([
      [1, 2, 3, 5],
      [6, 7, 9, 10, 11],
    ]);

    const resC = cluster(2, DATA_C, oId);
    expect(resC).toEqual([
      [{ d: 1 }, { d: 2 }, { d: 5 }],
      [{ d: 6 }, { d: 9 }, { d: 10 }],
    ]);
  });

  it('should group data in 3 clusters', () => {
    const resA = cluster(3, DATA_A, nId);
    expect(resA).toEqual([
      [1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10],
    ]);

    const resB = cluster(3, DATA_B, nId);
    expect(resB).toEqual([
      [1, 2, 3],
      [5, 6, 7],
      [9, 10, 11],
    ]);

    const resC = cluster(3, DATA_C, oId);
    expect(resC).toEqual([
      [{ d: 1 }, { d: 2 }],
      [{ d: 5 }, { d: 6 }],
      [{ d: 9 }, { d: 10 }],
    ]);
  });

  it('should soft group data in multiple clusters', () => {
    const resA = cluster(3, DATA_A, nId, true);
    expect(resA).toEqual([
      [1, 2, 3, 4],
      [4, 5, 6, 7],
      [8, 9, 10],
    ]);

    const resB = cluster(3, DATA_B, nId, true);
    expect(resB).toEqual([
      [1, 2, 3],
      [5, 6, 7],
      [9, 10, 11],
    ]);

    const resC = cluster(3, DATA_C, oId, true);
    expect(resC).toEqual([
      [{ d: 1 }, { d: 2 }],
      [{ d: 5 }, { d: 6 }],
      [{ d: 9 }, { d: 10 }],
    ]);

    const soft = cluster(2, [1, 2, 3, 4, 5], nId, true);
    expect(soft).toEqual([
      [1, 2, 3],
      [3, 4, 5],
    ]);
  });
});
