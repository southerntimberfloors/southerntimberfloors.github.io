import raw from './products.json';
import { tones, type CategoryKey } from './site';
import { productImages, type Img } from './images';

export type Tone = keyof typeof tones;
export type Pattern = 'strip' | 'herringbone' | 'chevron' | 'loop' | 'twist';

export type Product = {
  slug: string;
  name: string;
  category: CategoryKey;
  species: string | null;
  color: string;
  tone: Tone;
  pattern: Pattern;
  herringbone: boolean;
  specs: [string, string][];
  /** Description from the previous site, kept verbatim for SEO (missing for 14 products). */
  originalDescription?: string;
  /** Product photos (first is the board/swatch shot, then room shots or carpet colourways). See images.json. */
  images: Img[];
  description: string;
  highlights: string[];
};

// Short, factual notes about each species. Used to build product descriptions.
const speciesNotes: Record<string, string> = {
  'American Oak': 'American Oak is known for its bold, swirling cathedral grain and straw-to-honey colouring. It is one of the most versatile feature floors available.',
  'Tasmanian Oak': 'Tasmanian Oak is a long-time Australian favourite: pale, warm and straight-grained, with a calm look that suits modern and classic homes.',
  'Spotted Gum': 'Spotted Gum is one of Australia\'s hardest and most durable species, with rich colour variation from pale brown to deep chocolate and a distinctive wavy grain.',
  Blackbutt: 'Blackbutt is a hard-wearing east-coast hardwood with an even golden-straw tone and few features. It is a clean, contemporary choice.',
  'NSW Blackbutt': 'NSW Blackbutt is a hard-wearing east-coast hardwood with an even golden-straw tone and few features. It is a clean, contemporary choice.',
  'Southern Blackbutt': 'Southern Blackbutt has a warm pinkish-brown to golden tone and a gently varied grain. It is a hard, practical Australian hardwood.',
  'Grey Ironbark': 'Grey Ironbark is among the densest timbers in the world. Its deep red-brown colouring makes a striking, extremely tough floor.',
  'Gympie Messmate': 'Gympie Messmate is a Queensland hardwood with honey-to-golden tones and natural character, sought after for its durability.',
  'Queensland Wormy Chestnut': 'Queensland Wormy Chestnut celebrates natural character, with gum veins and insect trails that give each board a story.',
  'Mixed Tasmanian species': 'A blend of Tasmanian hardwoods selected for soft, varied colour and a light scattering of natural features. Exclusive to Southern Timber Floors.',
  'European Oak': 'European Oak is prized for its fine, open grain and stability, and it takes colour beautifully. That is why it leads modern wide-plank design.',
  'Victorian Ash': 'Victorian Ash has a light, creamy-blonde tone and straight grain. It takes stains well and suits a Scandinavian look.',
  'Australian hardwood': 'An Australian hardwood engineered board with lively, warm colour movement across the floor.',
};

const toneWords: Record<Tone, string> = {
  light: 'light, airy',
  natural: 'natural honey',
  rich: 'rich, warm',
  dark: 'deep, moody',
  grey: 'cool, washed',
};

function describe(p: Omit<Product, 'description' | 'highlights' | 'images'>): { description: string; highlights: string[] } {
  const tone = toneWords[p.tone];
  const spec = Object.fromEntries(p.specs);
  // The old site sometimes lists the species as "Engineered Oak"; avoid "engineered Engineered Oak".
  const species = (p.species ?? 'timber').replace(/^Engineered\s+/i, '');
  const highlights: string[] = [];
  let description = '';

  switch (p.category) {
    case 'solid':
      description = `${speciesNotes[p.species ?? ''] ?? `${p.name} is a solid Australian hardwood floor.`} Supplied as solid tongue-and-groove boards and sanded and coated on site, so you choose the final sheen and colour.`;
      highlights.push('Can be re-sanded many times', 'Coated on site to your chosen sheen', 'Natural, sustainably sourced hardwood');
      break;
    case 'engineered':
      description = `${p.name} is a ${tone} engineered ${species.toLowerCase() === 'oak' ? 'oak' : species} floor. ${speciesNotes[p.species ?? ''] ?? ''} A genuine hardwood surface on a stable multi-layer core means wide boards that stay flat, and they arrive pre-finished and ready to live on.`;
      highlights.push('Genuine timber surface', 'Cross-laminated core for stability', 'Pre-finished');
      if (spec['Also available'] || p.herringbone) highlights.push('Also available in herringbone');
      break;
    case 'parquetry':
      // Names on the old site now read "Jetty - Herringbone"; drop the suffix so the sentence doesn't repeat it.
      description = `${p.name.replace(/\s+-\s+(herringbone|chevron)$/i, '')} is a ${tone} ${p.pattern} parquetry in engineered ${species}. ${speciesNotes[p.species ?? ''] ?? ''} The short blocks create a rhythmic, tailored pattern that brings character to living areas and entries.`;
      highlights.push(`Classic ${p.pattern} layout`, 'Engineered for stability');
      if (spec['Matching planks']) highlights.push(`Matching ${spec['Matching planks']} planks for adjoining rooms`);
      else if (/strip/i.test(spec['Pattern'] ?? '')) highlights.push('Also available as strip boards');
      break;
    case 'hybrid':
      description = `${p.name} is a ${tone} hybrid plank with a realistic timber visual over a durable, water-resistant core. It suits busy family life and is installed as a floating floor.`;
      highlights.push('Water-resistant core', 'Durable, hard-wearing surface', 'Floating click-lock installation');
      if (spec['Also available']) highlights.push(`Also available in ${spec['Also available'].toLowerCase()}`);
      break;
    case 'carpet':
      description = `${p.name} is an Australian-made ${(spec['Pile style'] ?? 'carpet').toLowerCase()} in ${spec['Fibre'] ?? 'quality fibre'}, rated ${(spec['Grade'] ?? 'residential').toLowerCase()}. It comes in several colours chosen to sit comfortably beside our timber range.`;
      highlights.push('Australian made', 'Multiple colourways, so see the full card in store', spec['Grade'] ?? 'Residential rated');
      break;
  }
  // Prefer the original wording from the previous site where it exists.
  const finalDescription = p.originalDescription ?? description.replace(/\s+/g, ' ').trim();
  return { description: finalDescription, highlights: highlights.slice(0, 4) };
}

export const products: Product[] = (raw as Omit<Product, 'description' | 'highlights' | 'images'>[])
  .map((p) => ({ ...p, images: productImages[p.slug] ?? [], ...describe(p) }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const bySlug = new Map(products.map((p) => [p.slug, p]));

export function productsIn(category: CategoryKey) {
  return products.filter((p) => p.category === category);
}

export function productPath(p: Product) {
  return `/flooring/${p.slug}`;
}

export function related(p: Product, n = 4) {
  return products
    .filter((x) => x.slug !== p.slug && x.category === p.category)
    .sort((a, b) => Number(b.tone === p.tone) - Number(a.tone === p.tone))
    .slice(0, n);
}
