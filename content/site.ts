/**
 * Site content — copied from angleo.pl (Webflow). Edit here; every section reads from this
 * file, so there is no copy hard-coded in components.
 */
export const site = {
  name: 'Angleo',
  owner: 'Nicole Kurek',
  role: 'Trener języka angielskiego',
  title: 'Angleo – Nicole Kurek, trener angielskiego',
  description:
    'Angielski w pracy i biznesie. Praktyczne porady, materiały i lekcje z Nicole Kurek, trenerką języka angielskiego.',

  nav: [
    { label: 'O mnie', href: '#o-mnie' },
    { label: 'Tematy', href: '#tematy' },
    { label: 'Kontakt', href: '#kontakt' },
  ],

  hero: {
    eyebrow: 'Angielski w pracy i biznesie',
    heading: 'Cześć, jestem Nicole!',
    lead: 'Pomagam osobom, które chcą z łatwością używać angielskiego w pracy i biznesie. Dzielę się praktycznymi poradami, wskazówkami i materiałami, które pomogą Ci w komunikacji w języku angielskim.',
    image: {
      src: '/images/nicole-kurek.jpg',
      alt: 'Nicole Kurek, trenerka języka angielskiego',
      width: 1200,
      height: 900,
    },
  },

  about: {
    heading: 'O mnie',
    paragraphs: [
      'Moja przygoda z językiem zaczęła się na Uniwersytecie Śląskim, gdzie ukończyłam Filologię Angielską z dwoma specjalizacjami: Angielski w Biznesie (licencjat) oraz Media i Translacja (magister).',
      'Wierzę, że wspólnie znajdziemy sposób, by komunikacja w języku angielskim stała się dla Ciebie łatwiejsza. Jeśli masz jakieś pytania lub pomysły na tematy, o których powinnam napisać, daj znać!',
    ],
  },

  offer: {
    heading: 'Czego się nauczysz?',
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
    heading: 'Tematy',
    lead: 'Angielski dopasowany do sytuacji, w których naprawdę go używasz.',
    items: [
      'HR',
      'Finanse',
      'Spotkanie biznesowe',
      'Podróż służbowa',
      'Project management',
      'Marketing',
      'Logistyka',
      'Rozmowa o pracę',
    ],
  },

  contact: {
    heading: 'Kontakt',
    lead: 'Kliknij w poniższy przycisk i wybierz dogodny termin!',
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
  },

  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nicolekurekinfo/' },
    { label: 'YouTube', href: 'https://www.youtube.com/@nicolekurek' },
  ],
} as const;
