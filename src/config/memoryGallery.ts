import retroBoyImg from '../../our memories/WhatsApp Image 2026-11-19 at 6.29.34 PM.jpeg';
import retroGirlImg from '../../our memories/WhatsApp Image 2026-11-20 at 2.27.51 PM (10).jpeg';
import kurtaJacketImg from '../../our memories/WhatsApp Image 2026-11-19 at 6.29.42 PM (1).jpeg';
import silkKurtaImg from '../../our memories/WhatsApp Image 2026-11-20 at 2.27.51 PM (3).jpeg';
import pinkShirtImg from '../../our memories/WhatsApp Image 2026-11-20 at 2.27.51 PM (2).jpeg';
import checkeredShirtImg from '../../our memories/WhatsApp Image 2026-11-20 at 2.27.51 PM (13).jpeg';
import whiteTopImg from '../../our memories/WhatsApp Image 2026-11-20 at 2.27.51 PM (11).jpeg';
import greenDressImg from '../../our memories/WhatsApp Image 2026-11-20 at 2.27.51 PM (12).jpeg';
import kittenLookUpImg from '../../our memories/p2.jpeg';
import kittenLapImg from '../../our memories/WhatsApp Image 2026-11-19 at 6.29.33 PM.jpeg';
import birdOpenPalmImg from '../../our memories/WhatsApp Image 2026-11-19 at 6.29.39 PM.jpeg';
import birdBalconyCareImg from '../../our memories/WhatsApp Image 2026-11-19 at 6.29.40 PM.jpeg';
import birdCradledImg from '../../our memories/WhatsApp Image 2026-11-19 at 6.29.40 PM (1).jpeg';
import birdSafeInPalmImg from '../../our memories/WhatsApp Image 2026-11-19 at 6.29.41 PM.jpeg';
import birdFeedingImg from '../../our memories/WhatsApp Image 2026-11-19 at 6.29.42 PM.jpeg';
import birdCalmIndoorsImg from '../../our memories/WhatsApp Image 2026-11-19 at 6.29.41 PM (1).jpeg';
import smoodhTreatImg from '../../our memories/7.jpeg';
import pattiesChaatImg from '../../our memories/WhatsApp Image 2026-11-20 at 2.27.51 PM (4).jpeg';
import choleBhaturaImg from '../../our memories/WhatsApp Image 2026-11-20 at 2.27.51 PM (6).jpeg';
import cholePuriImg from '../../our memories/WhatsApp Image 2026-11-20 at 2.27.51 PM (8).jpeg';
import comfortThaliImg from '../../our memories/WhatsApp Image 2026-11-20 at 2.27.51 PM (7).jpeg';
import homeMealPlateImg from '../../our memories/WhatsApp Image 2026-11-20 at 2.27.51 PM (9).jpeg';

export interface MemoryGalleryPhoto {
  id: string;
  src: string;
  alt: string;
}

/**
 * All 22 actual photographs from the "our memories" folder arranged in sequence:
 * 1–2: First two opening photos (preserved)
 * 3–8: Clothes / outfit selection photos
 * 9–14: Food-related photos
 * 15–16: Terrace kitten moments
 * 17–22: Tailorbird rescue & care moments
 */
export const OUR_MEMORIES_PHOTOS: readonly MemoryGalleryPhoto[] = [
  {
    id: 'memory-1',
    src: retroBoyImg,
    alt: 'Vintage 90s-inspired portrait sitting in denim jacket beside a boombox at dusk',
  },
  {
    id: 'memory-2',
    src: retroGirlImg,
    alt: 'Vintage 90s-inspired portrait in denim jacket and pink scrunchie with a boombox behind',
  },
  {
    id: 'memory-3',
    src: kurtaJacketImg,
    alt: 'Mirror selfie in a cream kurta and navy waistcoat at home',
  },
  {
    id: 'memory-4',
    src: silkKurtaImg,
    alt: 'Mirror selfie wearing an off-white festive silk kurta',
  },
  {
    id: 'memory-5',
    src: pinkShirtImg,
    alt: 'Mirror selfie in a soft pastel pink shirt inside a clothing shop',
  },
  {
    id: 'memory-6',
    src: checkeredShirtImg,
    alt: 'Full-length mirror selfie in a cream checkered shirt at the store',
  },
  {
    id: 'memory-7',
    src: whiteTopImg,
    alt: 'Mirror selfie wearing an embroidered white cotton top and black trousers',
  },
  {
    id: 'memory-8',
    src: greenDressImg,
    alt: 'Mirror selfie wearing a sage-green floral dress over white sleeves',
  },
  {
    id: 'memory-9',
    src: choleBhaturaImg,
    alt: 'Steel thali with golden puffed bhatura, spiced chole, chopped onions, lemon, and green chutney',
  },
  {
    id: 'memory-10',
    src: cholePuriImg,
    alt: 'Two warm puffed puris served with rich chole masala and sliced onions',
  },
  {
    id: 'memory-11',
    src: comfortThaliImg,
    alt: 'Home-cooked comfort thali with folded rotis, steamed rice, yellow dal, and crisp roasted potatoes',
  },
  {
    id: 'memory-12',
    src: homeMealPlateImg,
    alt: 'Evening meal plate with rotis, kadhi, dal, dry sabzi, and green chutney',
  },
  {
    id: 'memory-13',
    src: pattiesChaatImg,
    alt: 'Crispy patties topped with sev, green chutney, and sweet red sauce on a steel plate',
  },
  {
    id: 'memory-14',
    src: smoodhTreatImg,
    alt: 'Hand holding a chilled blue Parle Agro Smoodh chocolate drink bottle',
  },
  {
    id: 'memory-15',
    src: kittenLookUpImg,
    alt: 'Smiling on the terrace while an orange tabby kitten perches on his lap looking up',
  },
  {
    id: 'memory-16',
    src: kittenLapImg,
    alt: 'Gently petting the tiny orange tabby kitten curled up on his jeans',
  },
  {
    id: 'memory-17',
    src: birdOpenPalmImg,
    alt: 'Tiny green-and-rufous tailorbird resting calmly on an open palm beside a steel water dish',
  },
  {
    id: 'memory-18',
    src: birdBalconyCareImg,
    alt: 'Tending gently to the little tailorbird on the balcony ledge at twilight',
  },
  {
    id: 'memory-19',
    src: birdCradledImg,
    alt: 'Close-up cradling the tiny green tailorbird carefully in both hands',
  },
  {
    id: 'memory-20',
    src: birdSafeInPalmImg,
    alt: 'Holding the rescued tailorbird warmly in cupped palms indoors',
  },
  {
    id: 'memory-21',
    src: birdFeedingImg,
    alt: 'Feeding tiny crumbs to the little olive-green bird resting in hand',
  },
  {
    id: 'memory-22',
    src: birdCalmIndoorsImg,
    alt: 'The little bird sitting peacefully inside gentle cupped hands',
  },
];
