export type UserRating = 1 | 2 | 3 | 4 | 5;

const STORAGE_KEY = 'utw_ratings_v1';

type RatingsStore = {
  [productId: string]: {
    ratings: UserRating[];
    // Optionally track a single user rating by device (for UX)
    my?: UserRating;
  };
};

function readStore(): RatingsStore {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RatingsStore) : {};
  } catch {
    return {};
  }
}

function writeStore(store: RatingsStore) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {}
}

export function getRatingSummary(productId: string): { average: number; count: number } {
  const store = readStore();
  const entry = store[productId];
  const ratings = entry?.ratings || [];
  const count = ratings.length;
  const average = count ? ratings.reduce((a, b) => a + b, 0) / count : 0;
  return { average, count };
}

export function getMyRating(productId: string): UserRating | undefined {
  const store = readStore();
  return store[productId]?.my;
}

export function setMyRating(productId: string, stars: UserRating) {
  const store = readStore();
  const entry = store[productId] || { ratings: [] };
  // Replace previous rating effect in aggregate
  if (entry.my) {
    const idx = entry.ratings.indexOf(entry.my);
    if (idx >= 0) entry.ratings.splice(idx, 1);
  }
  entry.my = stars;
  entry.ratings.push(stars);
  store[productId] = entry;
  writeStore(store);
}
