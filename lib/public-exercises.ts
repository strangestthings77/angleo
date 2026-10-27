export type PublicQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};
export type PublicExercise = {
  slug: string;
  title: string;
  description: string;
  time: string;
  difficulty: string;
  questions: PublicQuestion[];
};

/** Keep the public exercises in the local development environment until launch. */
export const PUBLIC_EXERCISES_ENABLED = process.env.NODE_ENV !== 'production';

const q = (
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
): PublicQuestion => ({ prompt, options, answer, explanation });

export const publicExercises: PublicExercise[] = [
  {
    slug: 'react-naturally',
    title: 'React Naturally',
    description: 'Naturalne reakcje w codziennych rozmowach w pracy.',
    time: '5 min',
    difficulty: 'Średni',
    questions: [
      q(
        'A: “I had to cancel my weekend trip.”',
        ["That's a shame.", 'Never mind the details.', 'I disagree with you.'],
        0,
        'That’s a shame wyraża naturalne współczucie.',
      ),
      q(
        'A: “I finally understand how the new system works.”',
        ['No worries!', 'That makes sense.', 'Fingers crossed!'],
        1,
        'That makes sense pasuje, gdy coś staje się zrozumiałe.',
      ),
      q(
        'A: “Sorry, I forgot to attach the file.”',
        ['No worries!', 'I bet!', 'Tell me about it!'],
        0,
        'No worries uspokaja rozmówcę i pokazuje, że to żaden problem.',
      ),
      q(
        'A: “I hope the client accepts our proposal.”',
        ['Good to hear!', 'Fingers crossed!', 'Sounds expensive.'],
        1,
        'Fingers crossed wyraża nadzieję na dobry rezultat.',
      ),
      q(
        'A: “The meeting was moved to 9 a.m.”',
        ['Sounds good.', 'That’s a shame.', 'I bet!'],
        0,
        'Sounds good to naturalna akceptacja planu.',
      ),
      q(
        'A: “The printer stopped working again.”',
        ['Tell me about it!', 'Good to hear!', 'That makes sense.'],
        0,
        'Tell me about it pokazuje, że doskonale znasz ten problem.',
      ),
      q(
        'A: “She got the promotion she wanted.”',
        ['Good to hear!', 'No worries!', 'Fingers crossed!'],
        0,
        'Good to hear reaguje pozytywnie na dobrą wiadomość.',
      ),
      q(
        'A: “You’ve worked with this client before, right?”',
        ['I bet!', 'That makes sense.', 'No, not exactly.'],
        2,
        'No, not exactly jest naturalną, spokojną korektą założenia.',
      ),
    ],
  },
  {
    slug: 'what-would-you-say',
    title: 'What Would You Say?',
    description: 'Wybierz najbardziej dyplomatyczną reakcję w sytuacji zawodowej.',
    time: '7 min',
    difficulty: 'Średni',
    questions: [
      q(
        'Chcesz delikatnie przypomnieć o spóźnionym raporcie.',
        [
          "Why haven't you sent it?",
          'Just checking in — do you have an update?',
          "I'm still waiting.",
        ],
        1,
        'Just checking in brzmi uprzejmie i nie oskarża.',
      ),
      q(
        'Nie rozumiesz, co klient ma na myśli.',
        ['What do you mean?', 'Could you clarify what you mean by that?', 'This makes no sense.'],
        1,
        'Could you clarify jest jasne i profesjonalne.',
      ),
      q(
        'Nie zgadzasz się z propozycją na spotkaniu.',
        [
          'You’re wrong.',
          'I see your point, but I’m not sure it would work here.',
          'That’s a bad idea.',
        ],
        1,
        'Ta wersja uznaje perspektywę rozmówcy i łagodnie wyraża wątpliwość.',
      ),
      q(
        'Potrzebujesz więcej czasu na zadanie.',
        [
          'I can’t do it.',
          'I may need a little more time to finish this properly.',
          'It’s not my fault.',
        ],
        1,
        'To realistycznie komunikuje potrzebę bez zrzucania winy.',
      ),
      q(
        'Chcesz sprawdzić, czy wszyscy rozumieją ustalenia.',
        ['Are we all on the same page?', 'Did everyone listen?', 'You understand, right?'],
        0,
        'Are we all on the same page? jest naturalnym pytaniem o wspólne zrozumienie.',
      ),
      q(
        'Odpowiadasz na prośbę, której nie możesz spełnić dziś.',
        [
          'No.',
          'I can’t do that.',
          'I won’t be able to take this on today, but I can look at it tomorrow.',
        ],
        2,
        'Wersja trzecia jasno komunikuje ograniczenie i proponuje rozwiązanie.',
      ),
      q(
        'Prosisz koleżankę o opinię na temat slajdów.',
        [
          'Tell me if they’re good.',
          'Would you mind taking a quick look at these slides?',
          'Look at these.',
        ],
        1,
        'Would you mind… brzmi uprzejmie i naturalnie.',
      ),
      q(
        'Chcesz zakończyć dygresję i wrócić do tematu.',
        ['Let’s cut to the chase.', 'Stop talking.', 'You’re distracting me.'],
        0,
        'Let’s cut to the chase uprzejmie sygnalizuje powrót do sedna.',
      ),
    ],
  },
  {
    slug: 'spot-the-mistake',
    title: 'Spot the Mistake',
    description: 'Znajdź jeden typowy błąd i wybierz naturalną poprawkę.',
    time: '6 min',
    difficulty: 'Średni',
    questions: [
      q(
        'I’ll explain you the process tomorrow.',
        [
          'I’ll explain the process to you tomorrow.',
          'I’ll explain you about the process tomorrow.',
          'I’ll explain to the process you tomorrow.',
        ],
        0,
        'Explain łączy się z rzeczą bezpośrednio, a osobę poprzedza to.',
      ),
      q(
        'Please reply me by Friday.',
        [
          'Please reply to me by Friday.',
          'Please reply me on Friday.',
          'Please answer to me by Friday.',
        ],
        0,
        'Mówimy reply to someone.',
      ),
      q(
        'We discussed about the budget yesterday.',
        [
          'We discussed the budget yesterday.',
          'We discussed on the budget yesterday.',
          'We made discussion about the budget.',
        ],
        0,
        'Discuss przyjmuje temat bez przyimka.',
      ),
      q(
        'I’m looking forward to meet you.',
        [
          'I’m looking forward to meeting you.',
          'I’m looking forward meet you.',
          'I look forward to met you.',
        ],
        0,
        'Po look forward to używamy rzeczownika lub formy -ing.',
      ),
      q(
        'Can you send me the informations?',
        [
          'Can you send me the information?',
          'Can you send me an information?',
          'Can you send me informations?',
        ],
        0,
        'Information jest niepoliczalne.',
      ),
      q(
        'We need to make a decision until Friday.',
        [
          'We need to make a decision by Friday.',
          'We need to do a decision until Friday.',
          'We need making a decision to Friday.',
        ],
        0,
        'By oznacza termin, do którego coś ma się wydarzyć.',
      ),
      q(
        'I am agree with your suggestion.',
        [
          'I agree with your suggestion.',
          'I am agreeing your suggestion.',
          'I agree to your suggestion with.',
        ],
        0,
        'Agree jest czasownikiem, nie używamy z nim am.',
      ),
      q(
        'Let’s discuss about this next week.',
        [
          'Let’s discuss this next week.',
          'Let’s discuss on this next week.',
          'Let’s make discuss this next week.',
        ],
        0,
        'Discuss nie wymaga przyimka about.',
      ),
    ],
  },
  {
    slug: 'office-lingo',
    title: 'Office Lingo',
    description: 'Sprawdź, co naprawdę znaczą popularne biurowe wyrażenia.',
    time: '5 min',
    difficulty: 'Łatwy',
    questions: [
      q(
        '“Keep me posted” means:',
        ['Keep me informed.', 'Keep me waiting.', 'Send me the final invoice.'],
        0,
        'Keep me posted = informuj mnie na bieżąco.',
      ),
      q(
        '“Let’s touch base next week” means:',
        [
          'Let’s have a brief follow-up conversation.',
          'Let’s meet physically at the office.',
          'Let’s change the project scope.',
        ],
        0,
        'Touch base to krótki kontakt lub rozmowa kontrolna.',
      ),
      q(
        '“I’ll loop you in” means:',
        [
          'I’ll include you in the conversation.',
          'I’ll remove you from the project.',
          'I’ll call you in the evening.',
        ],
        0,
        'Loop someone in = dołączyć kogoś do rozmowy lub obiegu informacji.',
      ),
      q(
        '“Let’s get the ball rolling” means:',
        ['Let’s start.', 'Let’s postpone it.', 'Let’s end the meeting.'],
        0,
        'To naturalny sposób na rozpoczęcie działania.',
      ),
      q(
        '“We’re on the same page” means:',
        [
          'We have the same understanding.',
          'We are reading the same document.',
          'We work in the same room.',
        ],
        0,
        'Wyrażenie oznacza wspólne rozumienie sytuacji.',
      ),
      q(
        '“That’s a heads-up” means:',
        [
          'That’s an advance warning or useful notice.',
          'That’s a difficult deadline.',
          'That’s a completed task.',
        ],
        0,
        'A heads-up to uprzedzenie kogoś o czymś.',
      ),
      q(
        '“Let’s cut to the chase” means:',
        [
          'Let’s get to the main point.',
          'Let’s cancel the meeting.',
          'Let’s write a longer introduction.',
        ],
        0,
        'Cut to the chase = przejść do sedna.',
      ),
      q(
        '“It’s still up in the air” means:',
        ['It hasn’t been decided yet.', 'It is definitely happening.', 'It is on the calendar.'],
        0,
        'Up in the air oznacza, że decyzja nadal nie zapadła.',
      ),
    ],
  },
];

export function getPublicExercise(slug: string) {
  return publicExercises.find((exercise) => exercise.slug === slug);
}
