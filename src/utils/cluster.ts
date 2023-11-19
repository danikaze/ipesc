export function cluster<T>(
  nClusters: number,
  data: readonly Readonly<T>[],
  getValue: (item: T) => number,
  soft: boolean = false,
  softDelta: number = 0
): T[][] {
  if (!nClusters) return [];
  if (nClusters === 1) return [[...data]];

  // Using indexed+cached data instead of the real data list for calculations
  const indexedData: CachedItem<T>[] = data.map((item, index) => ({
    item,
    index,
    value: getValue(item),
  }));
  indexedData.sort(cachedItemComparer);
  const clusters = initializeClusters(nClusters, indexedData);

  /*
   * then iterate the remaining values around each initial one and add it to
   * the cluster where there's the closest item to it
   */
  const centers = clusters.map((cluster) => cluster[0].value);
  const centerIndices = clusters.map((cluster) => cluster[0].index);
  const otherItems = indexedData.filter(({ index }) => !centerIndices.includes(index));

  otherItems.forEach((item) => categorizeItem(clusters, centers, item, soft, softDelta));

  return clusters.map((cluster) => {
    cluster.sort(cachedItemComparer);
    return cluster.map((cached) => cached.item);
  });
}

/**
 * While doing calculations, real items are not used and instead a reference
 * to the item (to get it later) and a cached value are used, so `getValue`
 * is not called exponentially while comparing
 */
type CachedItem<T> = {
  item: Readonly<T>;
  index: number;
  value: number;
};

function cachedItemComparer<T>(a: CachedItem<T>, b: CachedItem<T>): number {
  return a.value - b.value;
}

/**
 * Just create one array for each cluster, and included the center of each
 * cluster in it as the initial content.
 *
 * Using `nClusters * 2` allows to pick not the edges of the data but more
 * centered values
 *
 * The idea is that the picked index is the center with its own radius,
 * while using just `nClusters` would divide the data list leaving the edges
 * unbalanced... if that makes any sense:
 *
 * using                 1111 2222222 3333  <- unbalanced edges
 * nClusters (3)     -> |--------|--------|
 *                      ^        ^        ^
 * using                 11111 22222 33333
 * nClusters (3) x 2 -> |--|--|--|--|--|--|
 *                         ^     ^     ^
 */
function initializeClusters<T>(
  nClusters: number,
  data: readonly CachedItem<T>[]
): CachedItem<T>[][] {
  const realNclusters = data.length < nClusters ? data.length : nClusters;
  const clusters: ReturnType<typeof initializeClusters<T>> = [];
  const clusterSize = data.length / (realNclusters * 2);

  for (let i = 1; i < realNclusters * 2; i += 2) {
    const index = Math.floor(i * clusterSize);
    clusters.push([data[index]]);
  }

  return clusters;
}

/**
 * Categorize a given item into the existing clusters by choosing the
 * "most similar" (closest) cluster to it.
 */
function categorizeItem<T>(
  clusters: readonly CachedItem<T>[][],
  centers: readonly number[],
  item: CachedItem<T>,
  soft: boolean,
  softDelta: number
): void {
  let minDelta = Infinity;

  // deltas to each cluster center
  const deltas = centers.map((center, i) => {
    const d = Math.abs(center - item.value);
    if (d < minDelta) {
      minDelta = d;
    }
    return { i, d };
  });

  const filterFn = soft
    ? ({ d }: { d: number }) => Math.abs(d - minDelta) <= softDelta
    : ({ d }: { d: number }) => d === minDelta;
  const closestClusters = deltas.filter(filterFn).map((c) => c.i);

  // if multiple clusters per item is allowed (soft),
  // just assign it to each of them
  if (soft) {
    for (const i of closestClusters) {
      clusters[i].push(item);
    }
    return;
  }

  // if only one cluster per item is allowed,
  // choose the cluster with less items to try to keep them balanced
  closestClusters.sort((a, b) => {
    const ca = clusters[a];
    const cb = clusters[b];
    return ca.length - cb.length;
  });
  const index = closestClusters[0];
  clusters[index].push(item);
}
