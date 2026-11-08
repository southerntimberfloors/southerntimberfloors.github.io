import manifest from './images.json';

export type Img = { src: string; thumb: string; name?: string };

export const productImages = manifest.products as Record<string, Img[]>;
export const projectImages = manifest.projects as Record<string, Img[]>;
export const siteImages = manifest.site as Record<string, Img>;
export const downloads = manifest.downloads as Record<string, string>;

/** Carpet gallery files are named like "Blairgowrie-Rockpool-1200-x-…"; pull out the colourway. */
export function colourwayName(img: Img, productName: string) {
  const raw = (img.name ?? '').replace(/^Product-Image-/, '').replace(/[-_](\d{3,}|\d+x\d+).*$/, '');
  const parts = raw.split('-').filter((p) => !/^(styled|pix|ppi|png)$/i.test(p));
  const first = productName.split(' ')[0].toLowerCase();
  const rest = parts.filter((p) => !['winslow', 'windslow', 'crossley', 'twist', first].includes(p.toLowerCase()));
  const label = rest.join(' ') || productName;
  return ({ Backbeach: 'Back Beach' } as Record<string, string>)[label] ?? label;
}
