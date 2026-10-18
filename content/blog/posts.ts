import type { Post } from '@/lib/blog';

/**
 * Blog post metadata, newest first. Each post's body lives in `content/blog/<slug>.mdx`.
 * Slugs match the old Webflow URLs (some are template leftovers) so existing links keep working.
 */
export const posts: Post[] = [
  {
    slug: 'targi-czyli-jak-przez-8-godzin-udawac-ze-nie-bola-cie-nogi-po-angielsku',
    title: 'Targi, czyli jak przez 8 godzin udawać, że nie bolą cię nogi (po angielsku)',
    category: null,
    date: '2026-09-24',
    excerpt:
      'Targi to jak maraton w niewygodnych butach – tylko że musisz jeszcze brzmieć profesjonalnie po angielsku. Zobacz, jak przetrwać small talk, rozdawanie ulotek i pytania o cennik, nie tracąc przy tym głosu (ani cierpliwości).',
    description:
      'Targi to jak maraton w niewygodnych butach – tylko że musisz jeszcze brzmieć profesjonalnie po angielsku. Zobacz, jak przetrwać small talk, rozdawanie…',
    cover: {
      src: '/images/blog/targi-czyli-jak-przez-8-godzin-udawac-ze-nie-bola-cie-nogi-po-angielsku.jpg',
      width: 1600,
      height: 2133,
    },
  },
  {
    slug: 'korpomowa-vol-1---zaflagujmy-to-zanim-zrobi-sie-goraco',
    title: 'Korpomowa vol. 1 – „Zaflagujmy to” zanim zrobi się gorąco',
    category: null,
    date: '2026-09-24',
    excerpt:
      'Masz wrażenie, że korpomowa po angielsku to osobny język? „Let’s take this offline”, „I’ll loop you in”, „flagujemy to” – brzmi znajomo, ale nie do końca zrozumiale? W tym wpisie rozszyfrujemy te zwroty, pośmiejemy się z nich i poćwiczymy – na luzie, bez korpo-spiny.',
    description:
      'Masz wrażenie, że korpomowa po angielsku to osobny język? „Let’s take this offline”, „I’ll loop you in”, „flagujemy to” – brzmi znajomo, ale nie do końca…',
    cover: {
      src: '/images/blog/korpomowa-vol-1---zaflagujmy-to-zanim-zrobi-sie-goraco.jpg',
      width: 1600,
      height: 1137,
    },
  },
  {
    slug: 'jak-nazwac-swojego-szefa-po-angielsku-i-nie-palnac-glupoty',
    title: 'Jak nazwać swojego szefa po angielsku (i nie palnąć głupoty)?',
    category: null,
    date: '2026-09-24',
    excerpt:
      'Nie wiesz, czy Twój szef to boss, manager, a może director? A „zarząd” to po prostu management… czy coś więcej? 🤯 W tym wpisie rozwiewamy wszystkie językowe dylematy związane z nazywaniem przełożonych po angielsku — bez ściemy, z przykładami, i w stylu, który zapamiętasz. Bo czasem wystarczy jedno dobre słowo, żeby zabrzmieć jak zawodowiec.',
    description:
      'Nie wiesz, czy Twój szef to boss, manager, a może director? A „zarząd” to po prostu management… czy coś więcej? 🤯 W tym wpisie rozwiewamy wszystkie językowe…',
    cover: {
      src: '/images/blog/jak-nazwac-swojego-szefa-po-angielsku-i-nie-palnac-glupoty.jpg',
      width: 1600,
      height: 1067,
    },
  },
  {
    slug: 'nie-daj-sie-zmylic-slowa-ktore-brzmia-podobnie-ale-znacza-co-innego',
    title: 'Nie daj się nabrać! Słowa, które tylko udają, że są znajome (i psocą za plecami)',
    category: 'spotkanie-biznesowe',
    date: '2025-07-28',
    excerpt:
      'Myślisz, że „chef” to szef, a „data” to… data? Niby brzmi znajomo, ale możesz się nieźle wkopać. Poznaj fałszywych przyjaciół językowych, którzy tylko udają, że znasz ich od zawsze – a potem robią Ci językowy psikus.',
    description:
      'Myślisz, że „chef” to szef, a „data” to… data? Niby brzmi znajomo, ale możesz się nieźle wkopać. Poznaj fałszywych przyjaciół językowych, którzy tylko…',
    cover: {
      src: '/images/blog/nie-daj-sie-zmylic-slowa-ktore-brzmia-podobnie-ale-znacza-co-innego.jpg',
      width: 1600,
      height: 1067,
    },
  },
  {
    slug: '10-productivity-tools-that-are-worth-checking-out',
    title: 'Small Talk w biznesie – jak przetrwać i nie umrzeć z niezręczności',
    category: 'spotkanie-biznesowe',
    date: '2025-07-27',
    excerpt:
      'Po jakie słowa i frazy sięgnąć by nawiązać luźną rozmowę? W tym poście znajdziesz tego czego ci brakuje!',
    description:
      'Po jakie słowa i frazy sięgnąć by nawiązać luźną rozmowę? W tym poście znajdziesz tego czego ci brakuje!',
    cover: {
      src: '/images/blog/10-productivity-tools-that-are-worth-checking-out.jpg',
      width: 1600,
      height: 1067,
    },
  },
  {
    slug: 'angielski-onboarding-krok-po-kroku',
    title: 'Onboarding po angielsku – jak przywitać nowego bez spłoszenia go na dzień dobry',
    category: 'hr',
    date: '2025-07-27',
    excerpt:
      'Poznasz, że ktoś jest nowy, gdy szuka ekspresu do kawy jak świętego Graala. Zamiast rzucać go od razu w wir maili i firmowych skrótów, warto powiedzieć coś sensownego po angielsku. W tym poście znajdziesz gotowe frazy i scenariusze, które uratują Twój onboarding (i nowego pracownika).',
    description:
      'Poznasz, że ktoś jest nowy, gdy szuka ekspresu do kawy jak świętego Graala. Zamiast rzucać go od razu w wir maili i firmowych skrótów, warto powiedzieć coś…',
    cover: {
      src: '/images/blog/angielski-onboarding-krok-po-kroku.jpg',
      width: 1600,
      height: 1068,
    },
  },
  {
    slug: 'negocjacje-po-angielsku',
    title: 'Negocjacje bez stresu (i bez tłumacza Google)',
    category: 'spotkanie-biznesowe',
    date: '2025-07-27',
    excerpt:
      'Negocjacje po angielsku nie muszą brzmieć jak casting do serialu „Suits”. W tym wpisie znajdziesz frazy, które pomogą Ci mówić pewnie, konkretnie – i z lekkim przymrużeniem oka. Bez korpo-spiny, za to z językowym pazurem.',
    description:
      'Negocjacje po angielsku nie muszą brzmieć jak casting do serialu „Suits”. W tym wpisie znajdziesz frazy, które pomogą Ci mówić pewnie, konkretnie – i z…',
    cover: { src: '/images/blog/negocjacje-po-angielsku.jpg', width: 1600, height: 2400 },
  },
  {
    slug: '3-tips-to-avoid-internet-distractions-at-work',
    title:
      'Marketing po angielsku – czyli jak brzmieć profesjonalnie, nie będąc buzzwordowym zombie',
    category: 'marketing',
    date: '2025-07-27',
    excerpt:
      'Znajdziesz tu listę najważniejszych angielskich słów i wyrażeń, które musisz znać, aby skutecznie komunikować się w świecie marketingu.',
    description:
      'Znajdziesz tu listę najważniejszych angielskich słów i wyrażeń, które musisz znać, aby skutecznie komunikować się w świecie marketingu.',
    cover: {
      src: '/images/blog/3-tips-to-avoid-internet-distractions-at-work.jpg',
      width: 1600,
      height: 1067,
    },
  },
  {
    slug: 'jakie-sa-twoje-mocne-strony---10-przykladowych-odpowiedzi',
    title: 'Jakie są twoje mocne strony?',
    category: 'rozmowa-o-prace',
    date: '2025-07-27',
    excerpt:
      'Rozmowa o pracę to Twój moment, aby zabłysnąć. Oto przykładowe odpowiedzi, które pomogą Ci zrobić wrażenie na rekruterze.',
    description:
      'Rozmowa o pracę to Twój moment, aby zabłysnąć. Oto przykładowe odpowiedzi, które pomogą Ci zrobić wrażenie na rekruterze.',
    cover: {
      src: '/images/blog/jakie-sa-twoje-mocne-strony---10-przykladowych-odpowiedzi.jpg',
      width: 1600,
      height: 1067,
    },
  },
  {
    slug: 'how-to-choose-the-best-management-software',
    title: 'Jak przeprosić za opóźnienie w logistyce (i nie stracić klienta ani głowy)?',
    category: 'logistyka-2',
    date: '2025-07-27',
    excerpt:
      'Jak przeprosić za opóźnienie w logistyce (i nie stracić klienta ani głowy)? Opóźnienia w logistyce są jak zimna kawa – nikt ich nie lubi, ale prędzej czy później każdy musi się z nimi zmierzyć. Może to problem z dostawcą, burza śnieżna w środku lipca albo… kot, który zasnął na taśmie produkcyjnej. Nieważne. Ważne, jak ładnie się z tego wykaraskasz . Poniżej znajdziesz gotowe, angielskie zwroty (z tłumaczeniem), które pomogą Ci przeprosić, nie paląc mostów .',
    description:
      'Jak przeprosić za opóźnienie w logistyce (i nie stracić klienta ani głowy)? Opóźnienia w logistyce są jak zimna kawa – nikt ich nie lubi, ale prędzej czy…',
    cover: {
      src: '/images/blog/how-to-choose-the-best-management-software.jpg',
      width: 1600,
      height: 1067,
    },
  },
  {
    slug: 'how-time-tracking-can-improve-team-management',
    title: 'Delegacja bez stresu (i bez słownika): angielski, który działa',
    category: 'podroz-sluzbowa',
    date: '2025-07-27',
    excerpt:
      'Masz przed sobą podróż służbową, a Twój angielski... no cóż, mógłby być bardziej „Netflixowy”, a mniej „test z matury”? Spokojnie! Przygotowałem ekspresowy kursik angielskiego dla podróżujących służbowo – takiego, który pozwoli Ci pogadać swobodnie i z klasą, ale bez zadęcia. Weź kawę, otwórz kalendarz i rzuć okiem. To będzie Twój językowy boarding pass.',
    description:
      'Masz przed sobą podróż służbową, a Twój angielski... no cóż, mógłby być bardziej „Netflixowy”, a mniej „test z matury”? Spokojnie! Przygotowałem ekspresowy…',
    cover: {
      src: '/images/blog/how-time-tracking-can-improve-team-management.jpg',
      width: 1600,
      height: 1066,
    },
  },
  {
    slug: 'a-complete-guide-to-learn-project-management',
    title: 'Angielski dla bankowców: Sekrety skutecznych prezentacji.',
    category: 'finanse',
    date: '2025-07-27',
    excerpt:
      'Angielski dla Bankowców: Sekrety Skutecznych Prezentacji W dynamicznym świecie bankowości, gdzie każda prezentacja może mieć kluczowe znaczenie dla sukcesu finansowego, biegła znajomość języka angielskiego i specjalistycznego słownictwa jest niezbędna. Oto rozszerzony przewodnik po słownictwie, które nie tylko ułatwi pracownikom banków prowadzenie płynnych i przekonujących prezentacji, ale także pomoże w budowaniu silniejszych relacji z międzynarodowymi klientami i partnerami.',
    description:
      'Angielski dla Bankowców: Sekrety Skutecznych Prezentacji W dynamicznym świecie bankowości, gdzie każda prezentacja może mieć kluczowe znaczenie dla sukcesu…',
    cover: {
      src: '/images/blog/a-complete-guide-to-learn-project-management.jpg',
      width: 1600,
      height: 1067,
    },
  },
  {
    slug: '7-great-productivity-apps-for-your-new-ipad',
    title: 'Angielski dla Project Managera, który ogarnia (albo przynajmniej dobrze udaje)',
    category: 'project-management',
    date: '2025-07-27',
    excerpt:
      'Zarządzanie projektami po angielsku? Brzmi groźnie, ale spokojnie – przygotowałam zestaw najważniejszych fraz, które pozwolą Ci mówić jak profesjonalista, nawet jeśli Twój zespół właśnie zapomniał o deadlinie. Do tego garść ironii, kilka uśmiechów i ćwiczenie na deser. Bo kto powiedział, że nauka języka musi być śmiertelnie poważna?',
    description:
      'Zarządzanie projektami po angielsku? Brzmi groźnie, ale spokojnie – przygotowałam zestaw najważniejszych fraz, które pozwolą Ci mówić jak profesjonalista…',
    cover: {
      src: '/images/blog/7-great-productivity-apps-for-your-new-ipad.jpg',
      width: 1600,
      height: 2400,
    },
  },
  {
    slug: 'how-to-create-an-organized-productivity-plan-for-the-year',
    title: 'Od Briefu do Brainstormu, czyli o słowach przydatnych w korporacji.',
    category: 'spotkanie-biznesowe',
    date: '2025-07-14',
    excerpt:
      'Te specyficzne wyrażenia to trochę jak tajny kod – jak go znasz, to jesteś jednym z nas.',
    description:
      'Te specyficzne wyrażenia to trochę jak tajny kod – jak go znasz, to jesteś jednym z nas.',
    cover: {
      src: '/images/blog/how-to-create-an-organized-productivity-plan-for-the-year.jpg',
      width: 1600,
      height: 1067,
    },
  },
];

/** Shown as the large "Polecany" card on the home page and blog index. */
export const featuredSlug = 'nie-daj-sie-zmylic-slowa-ktore-brzmia-podobnie-ale-znacza-co-innego';
