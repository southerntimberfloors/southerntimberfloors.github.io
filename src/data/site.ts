// Business facts and site-wide content. Edit here; every page reads from this file.
// Page wording is carried over from the previous southerntimberfloors.com site to preserve SEO.

export const business = {
  name: 'Southern Timber Floors',
  tagline: 'Mornington & Melbourne Timber Floor Specialists',
  // Original homepage meta description (kept verbatim for SEO).
  description:
    'Southern Timber Floors located on the beautiful Mornington Peninsula specialises in the supply, installation and finishing of Solid and Engineered Timber flooring. Since our inception in 2005, we have built a reputation as one of the true market leaders in all aspects of timber flooring.',
  founded: 2005,
  phone: '(03) 5973 6936',
  phoneHref: 'tel:+61359736936',
  email: 'enquiries@southerntimberfloors.com',
  address: { street: '30 Watt Rd', suburb: 'Mornington', state: 'VIC', postcode: '3931', country: 'AU' },
  geo: { lat: -38.2316, lng: 145.0604 },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=30+Watt+Rd+Mornington+VIC+3931',
  mapEmbed: 'https://www.google.com/maps?q=30+Watt+Rd,+Mornington+VIC+3931&output=embed',
  // 0 = Sunday … 6 = Saturday. Times are 24h, Melbourne time.
  hours: [
    { days: 'Monday – Friday', open: '8.30am', close: '4.00pm' },
    { days: 'Saturday', note: 'By appointment only' },
    { days: 'Sunday & public holidays', note: 'Closed' },
  ],
  hoursSchedule: { 1: [8.5, 16], 2: [8.5, 16], 3: [8.5, 16], 4: [8.5, 16], 5: [8.5, 16] } as Record<number, [number, number]>,
  social: {
    instagram: { handle: 'southern_timber_floors', url: 'https://www.instagram.com/southern_timber_floors/' },
    facebook: { handle: '@southerntimberfloors', url: 'https://www.facebook.com/southerntimberfloors/' },
  },
  // Same tracking as the previous site, so analytics history and conversions continue.
  tracking: { gtm: 'GTM-5DLDXN6G', ga4: 'G-R22YQ50297' },
  // Enquiry form delivery. Pick ONE:
  //  • Web3Forms (free, 250/month): get a key at https://web3forms.com using enquiries@… and paste it in formAccessKey.
  //  • Formspree (free, 50/month): create a form at https://formspree.io and paste its URL in formEndpoint.
  // If both are empty, the form falls back to opening the visitor's email app.
  formAccessKey: '',
  formEndpoint: '',
};

// URLs kept identical to the previous site.
export const paths = {
  contact: '/about-us/frequently-asked-questions/contact',
  thanks: '/about-us/frequently-asked-questions/contact/thanks',
  faq: '/about-us/frequently-asked-questions',
  showroom: '/about-us/mornington-showroom',
  catalogues: '/about-us/catalogues-guides',
  sustainability: '/about-us/sustainability',
};

export type CategoryKey = 'solid' | 'engineered' | 'parquetry' | 'hybrid' | 'carpet';

/** Intro used on /timber and Solid Timber on the previous site. */
export const rangeIntro = [
  'Since 2005, Southern Timber Floors has built a strong reputation for the supply and installation of quality timber flooring across the Mornington Peninsula and beyond.',
  'With over 20 years of industry experience, we work alongside homeowners, renovators, architects, interior designers, builders and developers, bringing together product knowledge, technical expertise and skilled craftsmanship.',
  'We stay informed on the latest flooring innovations, products and design developments, combining contemporary knowledge with practical experience to provide considered advice and flooring solutions suited to each project.',
];

export const categories: Record<
  CategoryKey,
  { key: CategoryKey; name: string; path: string; short: string; intro: string[]; bestFor: string[]; considerations: string[] }
> = {
  solid: {
    key: 'solid',
    name: 'Solid Timber',
    path: '/timber/solid-timber',
    short: 'Milled from a single piece of hardwood, so it can be sanded and refinished for generations.',
    intro: rangeIntro,
    bestFor: ['Forever homes and heritage renovations', 'Custom stain and coating choices', 'Floors laid over timber joists'],
    considerations: ['Sanded and polished on site after installation (allow 2–5 extra days)', 'Moves with seasonal humidity'],
  },
  engineered: {
    key: 'engineered',
    name: 'Engineered Timber',
    path: '/timber/engineered-timber',
    short: 'A real timber wear layer over a cross-laminated core: wide boards, stable and pre-finished.',
    intro: [
      "Engineered timber flooring combines the natural beauty of solid timber with the stability of modern construction. Featuring a genuine timber surface bonded to a multi-layer, cross-laminated plywood core, engineered boards allow for wider plank formats with greater dimensional stability. Available in a considered selection of colours, tones and finishes, there's an option to complement a wide range of interior styles.",
    ],
    bestFor: ['Wide-plank European Oak looks', 'Concrete slabs and apartments', 'Renovations: can often float over existing level floors'],
    considerations: ['Re-sanding is limited by wear-layer thickness', 'Finish is factory applied, so choose it carefully'],
  },
  parquetry: {
    key: 'parquetry',
    name: 'Parquetry Timber',
    path: '/timber/parquetry-timber',
    short: 'Herringbone and chevron blocks, with matching planks for seamless transitions.',
    intro: [
      'Parquetry has a timeless quality and has adapted to fit in beautifully with our modern lifestyles and brings a sense of grandeur and style to any interior.',
    ],
    bestFor: ['Statement living and entry spaces', 'Period and contemporary homes alike', 'Pairing with matching straight planks'],
    considerations: ['More labour-intensive to install than planks', 'Allow extra material for pattern cuts'],
  },
  hybrid: {
    key: 'hybrid',
    name: 'Hybrid timber',
    path: '/timber/hybrid-timber',
    short: 'Water-resistant rigid-core planks with a realistic timber look. Tough, quiet, family-friendly.',
    intro: [
      'Hybrid flooring captures the look and feel of a timber floor while offering the convenience and durability of modern materials.',
      'Hybrid flooring is made using either a stone polymer composite (SPC) core or a sustainable wood plastic composite (WPC) core.',
    ],
    bestFor: ['Kitchens and busy family areas', 'Kids, pets and rentals', 'Renovations: can often float over existing level floors'],
    considerations: ['Cannot be sanded and refinished', 'Feels and sounds different underfoot to real timber'],
  },
  carpet: {
    key: 'carpet',
    name: 'Carpet',
    path: '/timber/carpet',
    short: 'Australian-made wool and solution-dyed carpets to soften bedrooms and living spaces.',
    intro: [
      'Southern timber floors is pleased to offer the best of Australian made Carpets to provide our builders and clients a beautiful selection to bring warmth and softness into the home. Our focus has been to find the best quality and durability to offer a selection of on-trend colours and styles.',
    ],
    bestFor: ['Bedrooms, retreats and media rooms', 'Matching a whole-home timber palette', 'Warmth and softness underfoot'],
    considerations: ['Ask to see the full colour card in the showroom', 'Choose underlay to suit the room'],
  },
};

export const categoryOrder: CategoryKey[] = ['solid', 'engineered', 'parquetry', 'hybrid', 'carpet'];

export const tones = {
  light: { label: 'Light & blonde', swatch: '#d8c3a3' },
  natural: { label: 'Natural & honey', swatch: '#a8835a' },
  rich: { label: 'Rich & red', swatch: '#8a4f33' },
  dark: { label: 'Dark & smoked', swatch: '#4a382b' },
  grey: { label: 'Grey & washed', swatch: '#9a948c' },
} as const;

/** The four promo blocks that appeared on the homepage and service pages. */
export const promos = [
  {
    title: 'Book a Free One Hour Consultation',
    body: 'Whether you’re building, renovating or elevating your space, we guide you in making confident design decisions—starting from the ground up.',
    link: { label: 'Consultations', href: '/our-services/consultations' },
  },
  {
    title: '100% Melbourne Owned & Operated',
    body: 'Located in south-east Melbourne, Southern Timber Floors have been building dreams across Australia for over 15 years.',
    link: { label: 'About us', href: '/about-us' },
  },
  {
    title: 'Support, Resources & Downloads',
    body: 'Access our comprehensive catalogues, guides, and PDFs for detailed product info, installation tips, and design inspiration.',
    link: { label: 'Catalogues & Guides', href: paths.catalogues },
  },
  {
    title: 'Sustainably Sourced, Quality Timber',
    body: 'Southern Timber Floors specialises in premium timber flooring, crafted from sustainably sourced wood, ensuring both exceptional quality and environmental responsibility.',
    link: { label: 'Sustainability', href: paths.sustainability },
  },
];

/** Shared "choosing a floor" text used on the homepage and product pages. */
export const choosingCopy = {
  heading: 'Beautiful flooring solutions for modern Australian homes',
  body: [
    'Choosing a timber floor that is right for you is an important decision and we encourage you to find out as much information as possible before making your final choice.',
    'Over time we have found that the most effective way to do this is to visit our showroom to see and touch the range of timber species and finishes under various light sources',
  ],
};
export const ctaLine = 'Let us bring your architectural vision to life. Get in touch with our dedicated team to request samples, spec sheets and presentations.';

export type Service = {
  slug: string;
  /** Short name for menus and cards. */
  name: string;
  /** Original page H1. */
  h1: string;
  h2: string;
  /** Short line for menus. */
  short: string;
  /** Wording from the original Our Services overview page. */
  summary: string[];
  /** Wording from the original service page. */
  body: string[];
  list?: { intro?: string; items: string[] };
  audience?: 'homeowner' | 'trade';
};

export const services: Service[] = [
  {
    slug: 'consultations',
    name: 'Consultations',
    h1: 'Book a free one hour Interior Design consultation',
    h2: 'Your floors set the tone for everything.',
    short: 'A free one-hour timber & design consultation in our showroom.',
    summary: [
      'Whether you’re building, renovating or elevating your space, we guide you in making confident design decisions—starting from the ground up.',
    ],
    body: [
      "Choosing the right timber flooring is about more than selecting a colour. It's about how the grain, tone and finish work together with the natural light, proportions and finishes of your home.",
      'Our Timber & Design Consultation offers a considered approach to choosing your floors. Explore our beautifully curated showroom, featuring an extensive range of timber flooring and large-format displays that bring each option to life.',
    ],
    list: {
      intro: "We'll help you:",
      items: [
        'Select timber flooring to complement your home and overall design',
        'Coordinate tones, textures and finishes',
        'Create a cohesive look that feels natural, balanced and considered',
      ],
    },
  },
  {
    slug: 'installation',
    name: 'Installation',
    h1: 'Installation',
    h2: 'Seamless Installation: Perfect Fit, Quick and Hassle-Free',
    short: 'Professional installers working to best building practice.',
    summary: [
      'Our professional Installers work within the Building Practices and tolerances to ensure your timber flooring is installed with best building practices.',
      'Our timbers are kiln dried to Victorian standards and are checked for moisture and size and documented by Southern Timber Floors. We take pride in our workmanship and this shows with our happy customers.',
    ],
    body: [
      'Our solid timber flooring is dried to meet Victorian requirements and is checked by our installers prior to installation. We assess the moisture content of both the timber and the subfloor to ensure conditions are suitable for installation and comply with relevant Australian Standards.',
      'Our experienced installation team is skilled across a wide range of projects, from detailed staircase work to specialised installations in lifts and other challenging spaces. Attention to detail at every stage helps ensure a quality installation built to last.',
      "Once your floor is complete, we'll provide clear care and maintenance instructions to help you protect its finish and enjoy it for years to come.",
    ],
  },
  {
    slug: 'sanding-polishing',
    name: 'Sanding & Polishing',
    h1: 'Sanding & Polishing',
    h2: 'Expert Sanding & Polishing: Perfect Preparation for Longevity and Beauty',
    short: 'Beautiful finishes, from hard waxes to water-based and polyurethanes.',
    summary: [
      'Southern Timber Floors Sanders and Polishers are the most experienced in the industry producing beautiful finishes for your new floor that will look stunning for years to come.',
      'We offer many finish alternatives from Hard waxes to Water-based and Polyurethanes. We invite you to come into our showroom and have a look at the choices.',
    ],
    body: [
      'At Southern Timber Floors, we take pride in achieving exceptional floor finishes that bring out the natural beauty of timber. Our experienced team uses professional floor sanding equipment and proven techniques to carefully prepare each surface, creating the ideal foundation for a smooth, even and beautifully finished floor.',
      "Visit our showroom to explore the different polish options and see how they complement individual timber species. We're happy to offer advice on selecting the right finish for your space, along with guidance on the care and maintenance of your timber floors.",
    ],
  },
  {
    slug: 'home-renovations',
    name: 'Home Renovations',
    h1: 'Home Renovations',
    h2: 'Timber Flooring to Bring Your Renovation Together',
    short: 'Practical advice and craftsmanship to bring your renovation together.',
    summary: [
      'Renovating your home is an opportunity to create something truly special, and choosing the right flooring plays an important part in bringing it all together.',
      'With over 20 years of experience, Southern Timber Floors understands that renovations can come with their own set of challenges. From working with existing floors and subfloors to navigating different levels, layouts and site conditions, we bring the experience and practical knowledge to find the right solution.',
      'Our reputation has been built on quality craftsmanship, attention to detail and honest advice. We take the time to understand your project, your priorities and your budget, making the process as straightforward and enjoyable as possible.',
    ],
    body: [
      'Our experienced team works closely with you throughout your renovation, from initial planning and product selection through to installation. Combining practical knowledge with skilled craftsmanship and attention to detail, we help ensure every aspect of your flooring is carefully considered.',
      'From marked-up plans and complimentary site inspections to expert product advice, we provide the guidance and support needed to make informed decisions and keep your project on track. Our aim is to make the process straightforward and deliver quality timber flooring that complements your home and stands the test of time.',
    ],
  },
  {
    slug: 'owner-builders',
    name: 'Owner Builders',
    h1: 'Owner Builders',
    h2: 'Beautiful flooring solutions for modern Australian homes',
    short: 'Supply-only or complete supply and installation, quoted from your plans.',
    summary: [
      "Whether you're looking for a supply-only solution or a complete flooring service, Southern Timber Floors offers the flexibility and expertise to suit your project.",
      'We can provide detailed quotes from your building plans and arrange site visits to assess subfloor conditions and discuss installation requirements ahead of time.',
      'With over 20 years of industry experience, we pride ourselves on delivering quality products, knowledgeable advice and a professional, reliable service from the initial enquiry through to completion.',
    ],
    body: [
      'We offer flexible timber flooring solutions for owner-builders, from supply-only options through to complete supply and installation.',
      'Working from your building plans, we can prepare detailed quotes, arrange site inspections and assess subfloor conditions to help ensure your project is ready for installation. With experienced advice, practical knowledge and careful attention to detail, we make choosing and installing your flooring a straightforward process.',
    ],
  },
  {
    slug: 'builders-developers',
    name: 'Builders & Developers',
    h1: 'Builders & Developers',
    h2: 'Quality Timber Flooring for Builders & Developers',
    short: 'Quotes from plans, site visits and scheduling that fits your build.',
    summary: [
      'With over 20 years of experience working alongside builders and developers, Southern Timber Floors delivers quality timber flooring solutions across a diverse range of residential and commercial projects.',
      'Our expertise spans a wide range of installations, including timber flooring, detailed staircases and stair nosings. We work closely with builders and project teams, providing quotes from plans, complimentary site visits and flexible scheduling to align with construction timelines.',
      'We understand the importance of reliability, clear communication and quality workmanship at every stage. Our team takes pride in being a dependable partner throughout the building process, providing practical advice, responsive service and quality results you can rely on.',
    ],
    body: [
      'Builders and developers have been at the heart of Southern Timber Floors for over 20 years. We understand the importance of reliable trades, clear communication and efficient project coordination to keep projects running smoothly and installations on schedule.',
      'We offer a complete flooring service, from supply only through to supply, installation, sanding and polishing. Our timber products are carefully selected, milled and kiln dried to meet high standards, with competitive pricing across our range.',
      "Our experienced team takes pride in quality workmanship, an organised approach and attention to detail. We also offer builders and their clients access to our beautifully presented showroom, featuring an extensive range of timber flooring options, finishes, carpet and samples. It's a welcoming space to explore different styles, compare selections and discuss project requirements with our team.",
    ],
    audience: 'trade',
  },
  {
    slug: 'decorators',
    name: 'Decorators',
    h1: 'Decorators',
    h2: 'Beautiful flooring solutions for modern Australian homes',
    short: 'Showroom, samples and sample boards for design professionals.',
    summary: [
      'We invite Interior Designers and Architects to use our spacious Showroom and large work surface for client colour appointments.',
      "If busy, notify us, and we'll assist your clients per your instructions. Services include hand samples, library sample showcases, and large format sample boards for site and client meetings.",
    ],
    body: [
      'We enjoy working with architects, interior designers and other design professionals, and welcome the opportunity to collaborate on your projects.',
      "Our spacious, beautifully presented showroom offers a welcoming setting to meet with clients, explore our timber flooring collections, carpet selections and finishes, and compare samples. If you're unable to attend, we're happy to meet with your clients and guide them through the selection process, working to your design direction and specifications.",
    ],
    list: {
      intro: 'Services for Design Professionals',
      items: [
        'Hand samples – A selection of samples for you and your clients to review.',
        'Sample displays – We can provide a curated sample showcase for your material library.',
        'Large-format sample boards – Available to borrow for client presentations, site visits and design meetings.',
      ],
    },
    audience: 'trade',
  },
];

export type Project = {
  slug: string;
  name: string;
  location: string;
  summary: string;
  story: string[];
  productSlugs: string[];
  /** "Featured Timber" text from the original project page. */
  featured?: string;
  details: [string, string][];
};

export const projects: Project[] = [
  {
    slug: 'rye-residence',
    name: 'Gilpip Residence',
    location: 'Mount Martha',
    summary: 'Tasmanian Oak floors in a generous wide 185mm board with a satin matt water-based finish.',
    story: [
      'This superb home features Tasmanian Oak floors in a generous Wide 185mm board with a Water based 2 Pac Coating in a Satin Matt which highlights the timbers soft and natural tones. We love the warm modern look created with the versatility of Solid timber.',
    ],
    productSlugs: ['tasmanian-oak'],
    featured:
      'Tasmanian Oak has stood the test of time with its classic style. Valued for its light warm colour, straight grain and versatility within the modern home. Our new popular extra wide 185 wide boards look stunning with a water based coating.',
    details: [
      ['Product', 'Solid Tasmanian Oak'],
      ['Board width', '185mm'],
      ['Finish', 'Water based 2 Pac, Satin Matt'],
    ],
  },
  {
    slug: 'yacht-court-house',
    name: 'Country Home',
    location: 'Gippsland',
    summary: 'A Tasmanian Driftwood feature floor in a modern country home.',
    story: [
      'This stunning Tasmanian Driftwood feature floor suits this modern Country home to perfection. Combined with soft whites and natural stone, and lots of light, this home instantly putting friends and family at ease with its soft lived in feel. This flooring complements the natural elements of this home with its stone and soft linens.',
    ],
    productSlugs: ['tasmanian-driftwwod'],
    featured:
      'We are excited to introduce this beautiful new solid timber flooring from Tasmania. Tasmanian Driftwood is created from a mix of species and exclusive to Southern Timber Floors. It’s easy to fall in love with its subtle colourways and lightly featured nature. Perfect for contemporary and country style homes alike. You will be surprised by how reasonably priced Tasmanian Driftwood is to have installed in your home.',
    details: [['Product', 'Solid Tasmanian Driftwood']],
  },
  {
    slug: 'yarralumla-house',
    name: 'Latitude 37',
    location: 'Mornington',
    summary: 'A project with the decorators at Latitude 37.',
    story: [],
    productSlugs: [],
    details: [],
  },
  {
    slug: 'south-yarra-apparentment',
    name: 'Mornington Peninsula',
    location: 'Mornington Peninsula',
    summary: 'White Haven engineered European Oak, a perfect complement to beachside living.',
    story: [
      'This beautiful Engineered oak floor in "White Haven" is a perfect complement to Beachside living with its subtle white wash over a modern timber coloured European Oak. A winning combination the decorators at Latitude 37 have created for this comfortable home near the bay.',
    ],
    productSlugs: ['white-haven'],
    details: [
      ['Product', 'White Haven engineered European Oak'],
      ['Decorators', 'Latitude 37'],
    ],
  },
];

export type Faq = { q: string; a: string[]; topic: 'Choosing' | 'Installation' | 'Care' | 'Ordering' };

export const faqs: Faq[] = [
  // The four original FAQs, verbatim.
  {
    topic: 'Installation',
    q: 'How long does the flooring installation process take?',
    a: [
      'Installation typically takes between a few days and one week, depending on the flooring type, project size and site conditions. This applies to engineered, hybrid and solid timber flooring.',
      'For solid timber flooring, allow an additional 2–5 days following installation for sanding and polishing to complete the floor.',
    ],
  },
  {
    topic: 'Installation',
    q: 'Can timber floors be installed over existing flooring?',
    a: [
      'Hybrid and engineered timber flooring offer flexible installation options and can often be floated over existing level tiles or timber floors, provided the existing surface is suitable. This can make them a practical solution for renovations, with less preparation required.',
      'Solid timber flooring generally requires more preparation. Existing tiles must be removed before installation. Depending on the subfloor, solid timber can be trowel-glued and secret-nailed directly onto a suitable yellow tongue particleboard subfloor.',
      'When installing solid timber over a concrete slab, a moisture barrier is installed first, followed by plywood mechanically fixed to the slab. The selected timber flooring is then installed over the plywood.',
      'Our team can assess your existing floors and subfloor conditions to recommend the most suitable installation method for your home.',
    ],
  },
  {
    topic: 'Care',
    q: 'How do I maintain and clean my timber floors?',
    a: [
      'We recommend using a pH-neutral cleaner specifically formulated for timber flooring, such as Bona or Loba, with a spray mop and removable microfibre pad.',
      'These ready-to-use cleaning solutions gently and effectively clean your floors while helping to protect their finish. A washable microfibre pad is ideal, as it can be removed and washed after each use.',
    ],
  },
  {
    topic: 'Care',
    q: 'What should I do if my timber floors get scratched or damaged?',
    a: [
      'A timber floor is an investment to be enjoyed for many years, becoming part of the character and everyday life of your home.',
      'A few simple precautions can help minimise scratches and wear. We recommend using entrance mats to catch dirt and grit, placing felt protectors under furniture legs and avoiding shoes that may carry stones or gravel onto the floor.',
      'Minor surface marks can often become less noticeable over time as the floor is lived on. There are also a range of specialist timber floor care and refresh products available to help maintain the appearance of your floor between professional services.',
      'One of the greatest advantages of solid timber flooring is its ability to be sanded and polished in the future, restoring its appearance and giving it a new lease on life.',
    ],
  },
  // Additional questions.
  { topic: 'Choosing', q: 'What is the difference between solid, engineered and hybrid flooring?', a: ['Solid timber is one piece of hardwood throughout and can be sanded and polished again in the future. Engineered timber has a genuine timber surface bonded to a multi-layer, cross-laminated plywood core, allowing wider boards with greater stability. Hybrid flooring captures the look of timber with a stone polymer composite (SPC) or wood plastic composite (WPC) core. The comparison table on our Flooring page sets them side by side.'] },
  { topic: 'Choosing', q: 'Which flooring is best for kitchens and busy family areas?', a: ['Hybrid flooring is a practical choice thanks to its durable, water-resistant core. Engineered and solid timber also work well in kitchens when spills are wiped up promptly. Visit our showroom and we can talk through the options for your home.'] },
  { topic: 'Choosing', q: 'Can I see the floors before I decide?', a: ['Yes. Our Mornington showroom has one of the largest displays of solid timber, engineered timber and hybrid flooring, plus our carpet range. You can also book a free one hour consultation.'] },
  { topic: 'Ordering', q: 'Can I get samples?', a: ['Yes. Add products to your sample list from any product page, then send the request through our contact form, or pick samples up from the Mornington showroom.'] },
  { topic: 'Ordering', q: 'Do you supply only, or do you also install?', a: ['Both. We offer supply-only through to complete supply, installation, sanding and polishing.'] },
  { topic: 'Ordering', q: 'Can you quote from plans?', a: ['Yes. We can prepare detailed quotes from your building plans and arrange site visits to assess subfloor conditions.'] },
];

export const catalogues = [
  { title: 'Engineered Flooring Maintenance & Care', cover: 'guide-engineered', href: '/guides/engineered-care', download: '/downloads/STF-Engineered-Floors-Maintenance.docx' },
  { title: 'Hybrid Flooring Maintenance & Care', cover: 'guide-hybrid', href: '/guides/hybrid-care', download: '/downloads/STF-Hybrid-Flooring-Fact-Sheet.docx' },
  { title: 'General Flooring Installation & Care', cover: 'guide-general', href: '/guides/installation-care', download: '/downloads/STF-Timber-Flooring-Fact-Sheet.docx' },
];

export const nav = [
  {
    label: 'Products',
    href: '/timber',
    children: categoryOrder.map((k) => ({ label: categories[k].name, href: categories[k].path, desc: categories[k].short })),
  },
  {
    label: 'Our Services',
    href: '/our-services',
    children: services.map((s) => ({ label: s.name, href: `/our-services/${s.slug}`, desc: s.short })),
  },
  { label: 'Projects', href: '/projects' },
  {
    label: 'About Us',
    href: '/about-us',
    children: [
      { label: 'About Us', href: '/about-us', desc: 'Established in 2005 on the Mornington Peninsula.' },
      { label: 'Visit our Showroom', href: paths.showroom, desc: '30 Watt Rd, Mornington.' },
      { label: 'Catalogues & Guides', href: paths.catalogues, desc: 'Care and installation guides.' },
      { label: 'Sustainability', href: paths.sustainability, desc: 'Responsible timber sourcing.' },
      { label: 'FAQ', href: paths.faq, desc: 'Answers to common questions.' },
    ],
  },
  { label: 'Contact Us', href: paths.contact },
];
