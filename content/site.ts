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
    { label: 'Jak to działa', href: '/#jak-to-dziala' },
    { label: 'Blog', href: '/blog' },
    { label: 'O mnie', href: '/o-mnie' },
    { label: 'FAQ', href: '/#faq' },
  ],
  cta: { label: 'Umów lekcję', href: '/umow-lekcje' },
  account: { label: 'Strefa ucznia', href: '/panel' },

  portrait: {
    src: '/images/nicole-kurek-professional-retouched.png',
    alt: 'Nicole Kurek, trenerka języka angielskiego',
    width: 1122,
    height: 1402,
  },

  hero: {
    eyebrow: 'Business English · Nicole Kurek',
    /** `*word*` renders as the italic brass accent. */
    heading: 'Angielski w pracy i biznesie — *z łatwością.*',
    lead: 'Pomagam profesjonalistom mówić i pisać po angielsku z pewnością siebie: od e-maili i prezentacji, przez spotkania, po negocjacje. Konkretnie, praktycznie i bez korpo-spiny.',
    badge: { title: 'Filologia Angielska', detail: 'Uniwersytet Śląski' },
    /** Speech bubbles around the portrait — phrases from the blog posts. */
    phrases: [
      { en: 'Let’s break this down.', pl: 'Bo w całości wygląda groźnie.' },
      { en: 'Let’s take this offline.', pl: 'Omówmy to osobno.' },
    ],
  },

  /** Static row under the hero. */
  specialties: [
    'E-maile',
    'Prezentacje',
    'Spotkania',
    'Negocjacje',
    'Small talk',
    'Rozmowy o pracę',
    'Korpomowa',
    'Podróże służbowe',
  ],

  audiences: {
    eyebrow: 'Dla kogo',
    heading: 'Dla profesjonalistów, którzy *pracują* po angielsku.',
    items: [
      {
        icon: 'briefcase',
        title: 'Specjaliści i managerowie',
        body: 'Spotkania, maile i prezentacje po angielsku bez stresu i tłumaczenia w głowie.',
        categories: ['spotkanie-biznesowe', 'project-management'],
      },
      {
        icon: 'chat',
        title: 'Przed rozmową o pracę',
        body: 'Przygotowanie do pytań rekruterów — od mocnych stron po pewne odpowiedzi.',
        categories: ['rozmowa-o-prace', 'hr'],
      },
      {
        icon: 'chart',
        title: 'Branże i działy',
        body: 'Słownictwo, którego naprawdę używasz: finanse, logistyka, marketing, HR.',
        categories: ['finanse', 'logistyka-2', 'marketing'],
      },
    ],
  },

  process: {
    eyebrow: 'Jak to działa',
    heading: 'Od rezerwacji do pierwszej lekcji — *w trzech krokach.*',
    steps: [
      {
        title: 'Wybierz termin',
        body: 'W kalendarzu na stronie wybierasz dzień i godzinę — terminy są dostępne na dwa tygodnie do przodu.',
      },
      {
        title: 'Spotkajmy się online',
        body: 'Lekcja odbywa się przez Google Meet. Link dostajesz od razu w e-mailu z potwierdzeniem.',
      },
      {
        title: 'Ćwicz to, czego potrzebujesz',
        body: 'Pracujemy na sytuacjach z Twojej pracy, a frazy i materiały z bloga pomagają utrwalić efekty.',
      },
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    heading: 'Najczęstsze *pytania*',
    lead: 'Nie znalazłeś odpowiedzi? Napisz albo zadzwoń.',
    items: [
      {
        q: 'Jak wyglądają lekcje?',
        a: 'Lekcje odbywają się online przez Google Meet. Link do spotkania znajdziesz w e-mailu z potwierdzeniem rezerwacji.',
      },
      {
        q: 'Jak umówić lekcję?',
        a: 'Wybierz dzień i godzinę w kalendarzu na stronie „Umów lekcję”. Terminy są dostępne na dwa tygodnie do przodu, a potwierdzenie przychodzi od razu na e-mail.',
      },
      {
        q: 'Czy mogę zmienić termin lub odwołać lekcję?',
        a: 'Tak — w e-mailu z potwierdzeniem znajdziesz link do zmiany terminu lub odwołania lekcji.',
      },
      {
        q: 'Czego będziemy się uczyć?',
        a: 'Angielskiego, którego używasz w pracy: e-maili, prezentacji, spotkań, negocjacji i rozmów o pracę. Przy rezerwacji możesz opisać, na czym chcesz się skupić.',
      },
      {
        q: 'Nie ma pasującego terminu — co dalej?',
        a: 'Napisz e-mail albo zadzwoń — postaramy się znaleźć termin, który Ci pasuje.',
      },
    ],
  },

  credentials: [
    { title: 'Angielski w Biznesie', detail: 'Licencjat · Uniwersytet Śląski' },
    { title: 'Media i Translacja', detail: 'Magisterium · Uniwersytet Śląski' },
  ],

  offer: {
    eyebrow: 'Czego się nauczysz',
    intro: 'Konkretne narzędzia do codziennej pracy — bez wkuwania gramatyki dla samej gramatyki.',
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
    lead: 'Wybierz dogodny termin w kalendarzu — potwierdzenie dostaniesz od razu e-mailem. Wolisz porozmawiać najpierw? Napisz albo zadzwoń.',
    /** Booking page (`/umow-lekcje`). */
    pageEyebrow: 'Rezerwacja',
    pageHeading: 'Umów *lekcję.*',
    pageLead:
      'Angielski w pracy i biznesie — dopasowany do sytuacji, w których naprawdę go używasz. Wybierz termin, który Ci pasuje.',
    lessonName: 'Lekcja angielskiego biznesowego',
    href: '/umow-lekcje#rezerwacja',
  },

  contact: {
    email: 'nicolekurek.info@gmail.com',
    phone: '+48 502 968 538',
    phoneHref: 'tel:+48502968538',
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
