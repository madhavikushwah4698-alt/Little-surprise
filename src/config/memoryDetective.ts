import memoryOneImg from '../../The Memory Detective Image/1.jpeg';
import memoryTwoImg from '../../The Memory Detective Image/2.jpeg';
import memoryThreeImg from '../../The Memory Detective Image/3.jpeg';
import memoryFourImg from '../../The Memory Detective Image/4.jpeg';
import memoryFiveImg from '../../The Memory Detective Image/5.jpeg';
import memorySixImg from '../../The Memory Detective Image/6.jpeg';

export interface MemoryDetectivePhoto {
  /** Unique identifier referenced by MEMORY_DETECTIVE_CORRECT_ORDER */
  id: string;
  /** Replaceable image import or URL path */
  src: string;
  /** Accessible photo description */
  alt: string;
  /** Optional short caption shown on the Polaroid bottom border */
  label?: string;
}

/**
 * List of the 6 actual photographs used in "The Memory Detective"
 * following the exact uploaded sequence (1.jpeg through 6.jpeg).
 */
export const MEMORY_DETECTIVE_PHOTOS: readonly MemoryDetectivePhoto[] = [
  {
    id: 'memory-1',
    src: memoryOneImg,
    alt: 'Entrance arch of Maa Chamunda Temple in Dewas with pedestrians and a motorbike passing underneath',
    label: 'Maa Chamunda Gate',
  },
  {
    id: 'memory-2',
    src: memoryTwoImg,
    alt: 'Room interior with ceiling fan, glowing tube light, garlanded portrait on wall, switchboard, and doorway',
    label: 'The quiet room',
  },
  {
    id: 'memory-3',
    src: memoryThreeImg,
    alt: 'Steel thali with dal katori, sliced onions, and baatis on a blue elephant bedsheet beside black earbuds',
    label: 'Dal baati on blue sheet',
  },
  {
    id: 'memory-4',
    src: memoryFourImg,
    alt: 'Two glossy gulab jamuns in syrup with a spoon inside a steel bowl held in hand',
    label: 'Two gulab jamuns',
  },
  {
    id: 'memory-5',
    src: memoryFiveImg,
    alt: 'Steel thali with baati, spiced dal with spoon, lemon, red onion slices, green chutney, and cucumber slices',
    label: 'Baati & green chutney',
  },
  {
    id: 'memory-6',
    src: memorySixImg,
    alt: 'Phone gallery grid from June showing thumbnails of mango, poha, meals, coffee, laptop setup, and campus walk',
    label: 'June camera roll',
  },
];

/**
 * True chronological sequence matching the uploaded numbered images (1 -> 6).
 */
export const MEMORY_DETECTIVE_CORRECT_ORDER: readonly string[] = [
  'memory-1',
  'memory-2',
  'memory-3',
  'memory-4',
  'memory-5',
  'memory-6',
];

export const MEMORY_DETECTIVE_COPY = {
  title: 'The Memory Detective',
  subtitle:
    'Every picture holds a little clue. Can you put our moments back in order?',
  beginButton: "Let's Begin",
  wrongFeedback: 'Not quite this moment...',
  solvedTitle: 'CASE SOLVED',
  solvedSubtitle: 'Some memories are too special to forget.',
} as const;

/**
 * Returns a shuffled copy of the photos that is guaranteed NOT to match
 * the true chronological order, keeping each game start/restart genuinely mixed.
 */
export function shuffleDetectivePhotos(
  photos: readonly MemoryDetectivePhoto[],
  correctOrder: readonly string[]
): MemoryDetectivePhoto[] {
  const pool = [...photos];
  if (pool.length <= 1) return pool;

  const isSameAsCorrect = (candidate: MemoryDetectivePhoto[]) =>
    candidate.every((item, idx) => item.id === correctOrder[idx]);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    if (!isSameAsCorrect(pool) && pool[0].id !== correctOrder[0]) {
      return pool;
    }
  }

  // Deterministic fallback rotation if random passes collide
  return [...pool.slice(1), pool[0]];
}
