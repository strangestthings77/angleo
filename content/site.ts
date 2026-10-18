/** Site-wide copy — taken from angleo.pl (Webflow). */
export const site = {
  name: 'Angleo',
  owner: 'Nicole Kurek',
  role: 'Trener języka angielskiego',
  title: 'Angleo – Nicole Kurek, Twój trener angielskiego',
  description:
    'Blog i lekcje dla osób, które chcą swobodnie używać angielskiego w pracy i biznesie. Praktyczne wskazówki, frazy i materiały od Nicole Kurek.',

  nav: [
    { label: 'Strona Główna', href: '/' },
    { label: 'O Mnie', href: '/o-mnie' },
  ],
  cta: { label: 'Umów Lekcję', href: '/umow-lekcje' },

  portrait: {
    src: '/images/nicole-kurek.jpg',
    alt: 'Nicole Kurek, trenerka języka angielskiego',
    width: 1200,
    height: 900,
  },

  /** Sidebar author card. */
  authorBio: [
    'Cześć! Chcesz używać angielskiego w pracy i w biznesie?',
    'Na moim blogu znajdziesz niezbędne wskazówki i metody. Zapraszam do czytania i nauki!',
  ],

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
