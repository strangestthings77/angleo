/**
 * Site-wide copy. Facts and the about text come from angleo.pl; headlines and short
 * section intros were written for the redesign (see `.altalogy/BUILD.md`) — client to review.
 */
export const site = {
  name: 'Angleo',
  owner: 'Nicole Kurek',
  role: 'Trener języka angielskiego',
  title: 'Angleo – Nicole Kurek, Twój trener angielskiego',
  description:
    'Angielski w pracy i biznesie z Nicole Kurek. Lekcje, praktyczne frazy i wskazówki: e-maile, prezentacje, spotkania i negocjacje po angielsku.',

  nav: [
    { label: 'Blog', href: '/blog' },
    { label: 'Tematy', href: '/#tematy' },
    { label: 'O mnie', href: '/o-mnie' },
  ],
  cta: { label: 'Umów lekcję', href: '/umow-lekcje' },

  portrait: {
    src: '/images/nicole-kurek.jpg',
    alt: 'Nicole Kurek, trenerka języka angielskiego',
    width: 1200,
    height: 900,
  },

  hero: {
    eyebrow: 'Business English · Nicole Kurek',
    /** `*word*` renders as the italic brass accent. */
    heading: 'Angielski w pracy i biznesie — *z łatwością.*',
    lead: 'Pomagam profesjonalistom mówić i pisać po angielsku z pewnością siebie: od e-maili i prezentacji, przez spotkania, po negocjacje. Konkretnie, praktycznie i bez korpo-spiny.',
    badge: { title: 'Filologia Angielska', detail: 'Uniwersytet Śląski' },
  },

  credentials: [
    { title: 'Angielski w Biznesie', detail: 'Licencjat · Uniwersytet Śląski' },
    { title: 'Media i Translacja', detail: 'Magisterium · Uniwersytet Śląski' },
  ],

  offer: {
    eyebrow: 'Czego się nauczysz',
    heading: 'Angielski, który *działa* — w mailu, na spotkaniu i przy negocjacjach.',
    items: [
      {
        title: 'Praktyczne wskazówki',
        body: 'Jak pisać profesjonalne e-maile, prezentować pomysły i negocjować po angielsku.',
      },
      {
        title: 'Negocjacje i networking',
        body: 'Skuteczne strategie prowadzenia negocjacji i nawiązywania kontaktów po angielsku.',
      },
      {
        title: 'Kulturowe różnice',
        body: 'Jak zrozumieć i uwzględnić niuanse komunikacyjne różnych kultur.',
      },
      {
        title: 'Materiały językowe',
        body: 'Listy przydatnych fraz, słownictwa i inne materiały dla profesjonalistów.',
      },
    ],
  },

  topics: {
    eyebrow: 'Tematy',
    heading: 'Słownictwo i frazy *dla Twojej* codzienności w pracy.',
  },

  quote: {
    text: 'Wierzę, że wspólnie znajdziemy sposób, by komunikacja w języku angielskim stała się dla Ciebie łatwiejsza.',
  },

  blog: {
    eyebrow: 'Blog',
    heading: 'Angielski do pracy, *na luzie.*',
    lead: 'Na moim blogu znajdziesz niezbędne wskazówki i metody. Zapraszam do czytania i nauki!',
  },

  about: {
    heading: 'Cześć, jestem *Nicole!*',
    lead: '… a to jest mój blog dla osób, które chcą z łatwością używać angielskiego w pracy i biznesie. Stworzyłam tę stronę, aby dzielić się praktycznymi poradami, wskazówkami i materiałami, które pomogą Ci w komunikacji w języku angielskim.',
    education:
      'Moja przygoda z językiem zaczęła się na Uniwersytecie Śląskim, gdzie ukończyłam Filologię Angielską z dwoma specjalizacjami.',
    closing:
      'Jeśli masz jakieś pytania lub pomysły na tematy, o których powinnam napisać, daj znać!',
  },

  /** Author box under posts. */
  authorBio:
    'Trenerka angielskiego biznesowego. Absolwentka Filologii Angielskiej na Uniwersytecie Śląskim (Angielski w Biznesie, Media i Translacja). Pomaga używać angielskiego w pracy z łatwością.',

  booking: {
    eyebrow: 'Umów lekcję',
    heading: 'Zrób pierwszy krok do *pewnego* angielskiego.',
    lead: 'Kliknij w poniższy przycisk i wybierz dogodny termin! Wolisz porozmawiać najpierw? Napisz albo zadzwoń.',
  },

  contact: {
    email: 'nicolekurek.info@gmail.com',
    phone: '+48 502 968 538',
    phoneHref: 'tel:+48502968538',
    calendarUrl:
      'https://script.google.com/macros/s/AKfycbyZ5Cb77iHqLp0mVz2Z4KR5cgUza0_Tdvyl3b736-cytxmdVktr7zCdnSuuoV9fgmZy/exec',
  },

  company: {
    street: 'ul. Wrocławska 110A/1',
    city: '41-902 Bytom',
    nip: '6262972227',
    linkedin: 'https://www.linkedin.com/in/nicolekurekinfo/',
  },

  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nicolekurekinfo/' },
    { label: 'YouTube', href: 'https://www.youtube.com/@nicolekurek' },
  ],
} as const;
