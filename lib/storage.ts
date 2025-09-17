import { Coffee, CoffeeRating } from '../types/coffee';

/** --- Runtime Guards & Consts --- */
const STORAGE_KEY = 'coffee-journal-data';
const VERSION_KEY = 'coffee-journal-version';
const CURRENT_VERSION = '2.0.0';
const isBrowser = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

/** --- Helpers --- */
export const toInt = (v: string) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
};
export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const safeDate = (v: any) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? new Date() : d;
};
function compareVersion(a: string, b: string): number {
  const pa = a.split('.').map(n => parseInt(n, 10));
  const pb = b.split('.').map(n => parseInt(n, 10));
  for (let i = 0; i < 3; i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d > 0 ? 1 : -1;
  }
  return 0;
}

/** --- Legacy Migration --- */
interface LegacyCoffee {
  id?: string;
  name: string;
  rating: number;
  dateAdded: Date | string;
}
const migrateLegacyData = (legacyData: any[]): Coffee[] =>
  legacyData.map((item: any, index: number) => {
    if (typeof item === 'string') {
      return {
        id: generateCoffeeId(),
        name: item,
        roastery: 'Unbekannte Rösterei',
        coffeeType: 'other',
        rating: { taste: 7, aroma: 7, aftertaste: 7, overall: 7 },
        averageRating: 7,
        notes: '',
        dateAdded: new Date()
      };
    }
    const legacyCoffee = item as LegacyCoffee;
    const oldRating = legacyCoffee.rating || 7;
    return {
      id: legacyCoffee.id || generateCoffeeId(),
      name: legacyCoffee.name || `Kaffee ${index + 1}`,
      roastery: 'Unbekannte Rösterei',
      coffeeType: 'other',
      rating: { taste: oldRating, aroma: oldRating, aftertaste: oldRating, overall: oldRating },
      averageRating: oldRating,
      notes: '',
      dateAdded: safeDate(legacyCoffee.dateAdded)
    };
  });

/** --- Ratings --- */
export const calculateAverageRating = (r: CoffeeRating): number =>
  Math.round(((r.taste + r.aroma + r.aftertaste + r.overall) / 4) * 10) / 10;

/** --- Persist Shapes --- */
type PersistCoffee = Omit<Coffee, 'dateAdded'> & { dateAdded: string };

/** --- Storage API --- */
export const storageUtils = {
  saveCoffees(coffees: Coffee[]): void {
    if (!isBrowser()) return;
    try {
      const payload: PersistCoffee[] = coffees.map(c => ({ ...c, dateAdded: c.dateAdded.toISOString() }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    } catch (error) {
      console.error('Error saving coffees to localStorage:', error);
    }
  },

  loadCoffees(): Coffee[] {
    if (!isBrowser()) return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const version = localStorage.getItem(VERSION_KEY) ?? '0.0.0';
      if (!stored) return [];
      const parsed = JSON.parse(stored);

      if (compareVersion(version, CURRENT_VERSION) < 0) {
        console.log('Migrating legacy coffee data…');
        const migrated = migrateLegacyData(parsed);
        this.saveCoffees(migrated);
        return migrated;
      }
      return (parsed as PersistCoffee[]).map(c => ({ ...c, dateAdded: safeDate(c.dateAdded) }));
    } catch (error) {
      console.error('Error loading coffees from localStorage:', error);
      return [];
    }
  },

  clearCoffees(): void {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VERSION_KEY);
    } catch (error) {
      console.error('Error clearing coffees from localStorage:', error);
    }
  }
};

/** --- IDs --- */
export const generateCoffeeId = (): string => {
  try {
    const a = crypto.getRandomValues(new Uint32Array(2));
    return `c_${Date.now().toString(36)}_${a[0].toString(36)}${a[1].toString(36)}`;
  } catch {
    return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
  }
};

export const createCoffeeRating = (taste: number, aroma: number, aftertaste: number, overall: number): CoffeeRating =>
  ({ taste, aroma, aftertaste, overall });
