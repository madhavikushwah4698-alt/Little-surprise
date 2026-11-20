export type UnlockMode = 'later-escapes' | 'yes-escapes';

export interface MemoryItem {
  id: string;
  index: string;
  title: string;
  dateLabel: string;
  location: string;
  caption: string;
  imageUrl: string;
  alt: string;
}

export interface WishNote {
  id: string;
  index: string;
  prompt: string;
  message: string;
}

export interface SurpriseData {
  hero: {
    dateLabel: string;
    editionLabel: string;
    heading: string;
    lead: string;
    ctaLabel: string;
    imageUrl: string;
    imageAlt: string;
  };
  letter: {
    heading: string;
    salutation: string;
    paragraphs: string[];
    closing: string;
    signature: string;
  };
  memories: MemoryItem[];
  wishes: WishNote[];
  celebration: {
    heading: string;
    subtitle: string;
    wishPrompt: string;
    wishGrantedText: string;
  };
}
