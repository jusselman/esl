/**
 * Grammar Duel Themes
 *
 * Each theme is a bank of multiple-choice questions. Every question has
 * exactly four sentence choices and one `correctIndex`.
 *
 * `mode` controls what the student is asked to find:
 *   - 'correct'   -> "Which sentence is correct?" (3 flawed, 1 clean)
 *   - 'incorrect' -> "Which sentence has a mistake?" (3 clean, 1 flawed)
 *
 * `category` is just a label for the host/reveal UI ('syntax' | 'punctuation').
 */

export const GRAMMAR_THEMES = [
  {
    id: 'everyday-conversation',
    title: 'Everyday Conversation',
    emoji: '💬',
    color: '#5ec9b7',
    description: 'Casual, spoken-style English for daily life.',
    questions: [
      {
        id: 'everyday-conversation-q1',
        mode: 'correct',
        category: 'punctuation',
        choices: [
          "Im going to the store, do you need anything?",
          "I'm going to the store — do you need anything?",
          "Im going to the store do you need anything",
          "I'm going to the store, do you need, anything?",
        ],
        correctIndex: 1,
        explanation: '"I\'m" needs an apostrophe, and two independent clauses need more than just a comma — the dash correctly joins them.',
      },
      {
        id: 'everyday-conversation-q2',
        mode: 'incorrect',
        category: 'syntax',
        choices: [
          "She doesn't like coffee, but she loves tea.",
          "He don't know the answer.",
          "They usually go to the gym on Saturdays.",
          "We were surprised by the news.",
        ],
        correctIndex: 1,
        explanation: 'Third-person singular "he" needs "doesn\'t," not "don\'t."',
      },
      {
        id: 'everyday-conversation-q3',
        mode: 'correct',
        category: 'syntax',
        choices: [
          "She have three brothers.",
          "She having three brothers.",
          "She has three brothers.",
          "She haves three brothers.",
        ],
        correctIndex: 2,
        explanation: 'The third-person singular present tense of "have" is "has."',
      },
      {
        id: 'everyday-conversation-q4',
        mode: 'incorrect',
        category: 'punctuation',
        choices: [
          "Can you pass the salt, please?",
          "Its raining again.",
          "Let's grab lunch around noon.",
          "I can't believe it's already Friday.",
        ],
        correctIndex: 1,
        explanation: '"It\'s" (with an apostrophe) means "it is." "Its" without one is possessive.',
      },
      {
        id: 'everyday-conversation-q5',
        mode: 'correct',
        category: 'punctuation',
        choices: [
          "My favorite foods are pizza pasta and sushi.",
          "My favorite foods are: pizza, pasta, and sushi.",
          "My favorite foods are pizza, pasta, and sushi.",
          "My favorite foods, are pizza, pasta and sushi.",
        ],
        correctIndex: 2,
        explanation: 'Items in a list need commas between them — no colon after "are," and no comma before the verb.',
      },
      {
        id: 'everyday-conversation-q6',
        mode: 'incorrect',
        category: 'syntax',
        choices: [
          "Last night, we watched a great movie.",
          "Yesterday, I go to the movies with my sister.",
          "Earlier today, she finished her homework.",
          "This morning, he made breakfast for everyone.",
        ],
        correctIndex: 1,
        explanation: '"Yesterday" signals past tense, so the verb should be "went," not "go."',
      },
      {
        id: 'everyday-conversation-q7',
        mode: 'correct',
        category: 'syntax',
        choices: [
          "Always she arrives early.",
          "She arrives always early.",
          "She always arrives early.",
          "Arrives she always early.",
        ],
        correctIndex: 2,
        explanation: 'Adverbs of frequency like "always" usually go right before the main verb.',
      },
      {
        id: 'everyday-conversation-q8',
        mode: 'incorrect',
        category: 'punctuation',
        choices: [
          "Where do you live?",
          "What time is it.",
          "That's a great idea!",
          "I'm not sure, honestly.",
        ],
        correctIndex: 1,
        explanation: 'A direct question must end with a question mark, not a period.',
      },
    ],
  },
  {
    id: 'workplace-communication',
    title: 'Workplace Communication',
    emoji: '💼',
    color: '#FF6B6B',
    description: 'Emails, meetings, and professional messages.',
    questions: [
      {
        id: 'workplace-communication-q1',
        mode: 'correct',
        category: 'punctuation',
        choices: [
          "Please send me the report, by end of day.",
          "Please send me the report by end of day.",
          "Please, send me the report by end of day.",
          "Please send me the report by end of day,",
        ],
        correctIndex: 1,
        explanation: 'No comma is needed before "by end of day" — it isn\'t a separate clause.',
      },
      {
        id: 'workplace-communication-q2',
        mode: 'incorrect',
        category: 'syntax',
        choices: [
          "The team has finished the project early.",
          "Each employee are required to submit a report.",
          "Our manager reviewed the proposal yesterday.",
          "The meeting starts at 9 a.m. sharp.",
        ],
        correctIndex: 1,
        explanation: '"Each employee" is singular, so it needs "is required," not "are required."',
      },
      {
        id: 'workplace-communication-q3',
        mode: 'correct',
        category: 'syntax',
        choices: [
          "Neither the manager nor the employees was informed.",
          "Neither the manager nor the employees were informed.",
          "Neither the manager nor the employees is informed.",
          "Neither the manager nor the employees being informed.",
        ],
        correctIndex: 1,
        explanation: 'With "neither...nor," the verb agrees with the closer subject — "employees" — so "were" is correct.',
      },
      {
        id: 'workplace-communication-q4',
        mode: 'incorrect',
        category: 'punctuation',
        choices: [
          "Dear Mr. Alvarez, thank you for your email.",
          "I have attached the file, for your review.",
          "Let me know if you have any questions.",
          "Best regards, Priya",
        ],
        correctIndex: 1,
        explanation: 'No comma is needed before a prepositional phrase like "for your review" that completes the sentence.',
      },
      {
        id: 'workplace-communication-q5',
        mode: 'correct',
        category: 'punctuation',
        choices: [
          "The report which I finished yesterday is on your desk.",
          "The report, which I finished yesterday, is on your desk.",
          "The report which I finished, yesterday is on your desk.",
          "The report, which I finished yesterday is on your desk.",
        ],
        correctIndex: 1,
        explanation: 'A nonessential clause like "which I finished yesterday" needs commas on both sides.',
      },
      {
        id: 'workplace-communication-q6',
        mode: 'incorrect',
        category: 'syntax',
        choices: [
          "By next Friday, we will have completed the audit.",
          "She is responsible for schedule the meetings.",
          "He submitted the invoice before the deadline.",
          "They are planning to launch the product in March.",
        ],
        correctIndex: 1,
        explanation: 'After "responsible for," use the -ing form: "scheduling," not the base verb "schedule."',
      },
      {
        id: 'workplace-communication-q7',
        mode: 'correct',
        category: 'syntax',
        choices: [
          "If you have any questions, please let me know.",
          "If you will have any questions, please let me know.",
          "If you having any questions, please let me know.",
          "If you has any questions, please let me know.",
        ],
        correctIndex: 0,
        explanation: 'Real conditional sentences use the present tense in the "if" clause — "have," not "will have."',
      },
      {
        id: 'workplace-communication-q8',
        mode: 'incorrect',
        category: 'punctuation',
        choices: [
          "The quarterly report is due Friday.",
          "We need approval from Legal, Finance, and HR.",
          "Our client based in Chicago requested a call.",
          "The proposal was well received by the board.",
        ],
        correctIndex: 2,
        explanation: '"based in Chicago" is extra, nonessential info and needs commas around it: "Our client, based in Chicago, requested a call."',
      },
    ],
  },
  {
    id: 'travel-directions',
    title: 'Travel & Directions',
    emoji: '✈️',
    color: '#6C63FF',
    description: 'Getting around, asking for directions, and booking trips.',
    questions: [
      {
        id: 'travel-directions-q1',
        mode: 'correct',
        category: 'syntax',
        choices: [
          "Turn left on Main Street and the station will be on your right.",
          "Turn left on Main Street and the station be on your right.",
          "Turning left on Main Street, the station will be on your right.",
          "Turn left in Main Street and the station will be on your right.",
        ],
        correctIndex: 0,
        explanation: 'Only this choice uses "will be" correctly and the right preposition, "on," for a street.',
      },
      {
        id: 'travel-directions-q2',
        mode: 'incorrect',
        category: 'punctuation',
        choices: [
          "Excuse me, could you tell me how to get to the airport?",
          "The train leaves at 8:00 a.m. from platform 3.",
          "I need a ticket to Boston, and a return ticket too.",
          "Is this the right bus for downtown?",
        ],
        correctIndex: 2,
        explanation: 'No comma is needed before "and" when it just joins two objects, not two full sentences.',
      },
      {
        id: 'travel-directions-q3',
        mode: 'correct',
        category: 'syntax',
        choices: [
          "How far is it from here to the museum?",
          "How far it is from here to the museum?",
          "How far is from here to the museum?",
          "How far it is from here to the museum from?",
        ],
        correctIndex: 0,
        explanation: 'In questions, the verb "is" comes before the subject "it": "How far is it..."',
      },
      {
        id: 'travel-directions-q4',
        mode: 'incorrect',
        category: 'syntax',
        choices: [
          "We have been traveling for six hours.",
          "By the time we arrive, the sun will have set.",
          "She has visited more than twenty countries.",
          "They was waiting at the gate for an hour.",
        ],
        correctIndex: 3,
        explanation: '"They" is plural, so it needs "were," not "was."',
      },
      {
        id: 'travel-directions-q5',
        mode: 'correct',
        category: 'punctuation',
        choices: [
          "Yes I would like a window seat.",
          "Yes, I would like a window seat.",
          "Yes, I would, like a window seat.",
          "Yes I would like, a window seat.",
        ],
        correctIndex: 1,
        explanation: 'An introductory word like "Yes" is set off from the rest of the sentence with a comma.',
      },
      {
        id: 'travel-directions-q6',
        mode: 'incorrect',
        category: 'punctuation',
        choices: [
          "Don't forget your passport, boarding pass, and ID.",
          "The flight was delayed, because of the storm.",
          "We arrived early, so we grabbed coffee.",
          "Although it rained, we still enjoyed the trip.",
        ],
        correctIndex: 1,
        explanation: 'When "because" introduces an essential reason at the end of a sentence, it usually isn\'t preceded by a comma.',
      },
      {
        id: 'travel-directions-q7',
        mode: 'correct',
        category: 'syntax',
        choices: [
          "If I were you, I would book the flight now.",
          "If I was you, I would book the flight now.",
          "If I am you, I would book the flight now.",
          "If I will be you, I would book the flight now.",
        ],
        correctIndex: 0,
        explanation: 'Hypothetical "if" statements use "were" for all subjects, not "was."',
      },
      {
        id: 'travel-directions-q8',
        mode: 'incorrect',
        category: 'syntax',
        choices: [
          "The hotel is located near the beach.",
          "We checked in and then we relaxed by the pool.",
          "She always forget to bring sunscreen.",
          "They rented a car for the whole trip.",
        ],
        correctIndex: 2,
        explanation: 'With "she" (third-person singular), the verb needs an -s: "forgets," not "forget."',
      },
    ],
  },
  {
    id: 'news-current-events',
    title: 'News & Current Events',
    emoji: '📰',
    color: '#F5C842',
    description: 'Headlines and reporting-style English.',
    questions: [
      {
        id: 'news-current-events-q1',
        mode: 'correct',
        category: 'punctuation',
        choices: [
          "According to the report, unemployment fell last month.",
          "According to the report unemployment fell last month.",
          "According to the report, unemployment, fell last month.",
          "According, to the report, unemployment fell last month.",
        ],
        correctIndex: 0,
        explanation: 'An introductory phrase like "According to the report" is followed by a comma.',
      },
      {
        id: 'news-current-events-q2',
        mode: 'incorrect',
        category: 'syntax',
        choices: [
          "The company announced its plans yesterday.",
          "Scientists has discovered a new species.",
          "The mayor is expected to speak this afternoon.",
          "Officials confirmed the results this morning.",
        ],
        correctIndex: 1,
        explanation: '"Scientists" is plural, so it needs "have," not "has."',
      },
      {
        id: 'news-current-events-q3',
        mode: 'correct',
        category: 'syntax',
        choices: [
          "The article was written by two journalists.",
          "The article was wrote by two journalists.",
          "The article was write by two journalists.",
          "The article were written by two journalists.",
        ],
        correctIndex: 0,
        explanation: 'Passive voice needs the past participle "written," and singular "article" takes "was."',
      },
      {
        id: 'news-current-events-q4',
        mode: 'incorrect',
        category: 'punctuation',
        choices: [
          "The senator said, \"We will address this issue.\"",
          "Reporters asked several questions after the announcement.",
          "The study, published last week found surprising results.",
          "Local officials responded quickly to the crisis.",
        ],
        correctIndex: 2,
        explanation: 'The nonessential phrase "published last week" needs a comma on both sides: "The study, published last week, found surprising results."',
      },
      {
        id: 'news-current-events-q5',
        mode: 'correct',
        category: 'punctuation',
        choices: [
          "The president will visit three cities: Chicago, Dallas, and Miami.",
          "The president will visit three cities, Chicago, Dallas, and Miami.",
          "The president will visit three cities; Chicago, Dallas, and Miami.",
          "The president will visit three cities Chicago, Dallas, and Miami.",
        ],
        correctIndex: 0,
        explanation: 'A colon introduces a list after an independent clause — a comma or semicolon doesn\'t work the same way here.',
      },
      {
        id: 'news-current-events-q6',
        mode: 'incorrect',
        category: 'syntax',
        choices: [
          "The economy has grown steadily this year.",
          "Analysts expect the trend to continue.",
          "Prices have risen sharply since January.",
          "Each of the proposals were rejected.",
        ],
        correctIndex: 3,
        explanation: '"Each" is singular, so it needs a singular verb: "was rejected," not "were rejected."',
      },
      {
        id: 'news-current-events-q7',
        mode: 'correct',
        category: 'syntax',
        choices: [
          "Neither candidate has released a statement.",
          "Neither candidate have released a statement.",
          "Neither candidate releasing a statement.",
          "Neither candidate release a statement.",
        ],
        correctIndex: 0,
        explanation: '"Neither candidate" is singular, so the verb must be singular: "has," not "have."',
      },
      {
        id: 'news-current-events-q8',
        mode: 'incorrect',
        category: 'punctuation',
        choices: [
          "The report raises an important question: what happens next?",
          "Its clear that more research is needed.",
          "The committee will meet again next week.",
          "Critics say the plan lacks detail.",
        ],
        correctIndex: 1,
        explanation: '"It\'s" (with an apostrophe) means "it is." "Its" without an apostrophe is possessive.',
      },
    ],
  },
]

export function getThemeById(themeId) {
  return GRAMMAR_THEMES.find(t => t.id === themeId) || null
}

/**
 * Pick `count` questions from a theme for one duel. Shuffled, capped at the
 * theme's available question count (each question is used at most once).
 */
export function pickQuestions(theme, count) {
  const pool = [...theme.questions]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, Math.min(count, pool.length))
}
