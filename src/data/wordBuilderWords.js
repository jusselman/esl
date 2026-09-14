/**
 * Word Builder Themes
 *
 * Each theme is a bank of words for the Word Builder sub-activity of
 * Vocabulary Builder. Every word has a `partOfSpeech` (noun | adjective |
 * adverb | verb) and a vague, Jeopardy-style `clue` that guides the
 * student without giving the word away outright.
 *
 * Words are lowercase with no spaces or hyphens so they map cleanly onto
 * the letter-by-letter fill-in-the-blank UI.
 */

export const WORD_BUILDER_THEMES = [
  {
    id: 'everyday-life',
    title: 'Everyday Life',
    emoji: '🏠',
    color: '#5ec9b7',
    description: 'Common words from daily routines and conversation.',
    words: [
      {
        id: 'everyday-life-w1',
        word: 'kitchen',
        partOfSpeech: 'noun',
        clue: 'The room where meals are usually cooked.',
      },
      {
        id: 'everyday-life-w2',
        word: 'morning',
        partOfSpeech: 'noun',
        clue: 'The part of the day right after you wake up.',
      },
      {
        id: 'everyday-life-w3',
        word: 'exhausted',
        partOfSpeech: 'adjective',
        clue: 'Extremely tired after a long day.',
      },
      {
        id: 'everyday-life-w4',
        word: 'quickly',
        partOfSpeech: 'adverb',
        clue: 'In a fast manner, without delay.',
      },
      {
        id: 'everyday-life-w5',
        word: 'borrow',
        partOfSpeech: 'verb',
        clue: 'To take something and return it later.',
      },
      {
        id: 'everyday-life-w6',
        word: 'neighbor',
        partOfSpeech: 'noun',
        clue: 'A person who lives right next door to you.',
      },
      {
        id: 'everyday-life-w7',
        word: 'comfortable',
        partOfSpeech: 'adjective',
        clue: 'Physically relaxed, free from stress or pain.',
      },
      {
        id: 'everyday-life-w8',
        word: 'rarely',
        partOfSpeech: 'adverb',
        clue: 'Not often; only a few times.',
      },
    ],
  },
  {
    id: 'business-work',
    title: 'Business & Work',
    emoji: '💼',
    color: '#f6db96',
    description: 'Vocabulary for the office, meetings, and getting things done.',
    words: [
      {
        id: 'business-work-w1',
        word: 'meeting',
        partOfSpeech: 'noun',
        clue: 'A gathering where people discuss plans or decisions.',
      },
      {
        id: 'business-work-w2',
        word: 'deadline',
        partOfSpeech: 'noun',
        clue: 'The latest time or date something must be finished.',
      },
      {
        id: 'business-work-w3',
        word: 'efficient',
        partOfSpeech: 'adjective',
        clue: 'Achieving results without wasting time or effort.',
      },
      {
        id: 'business-work-w4',
        word: 'negotiate',
        partOfSpeech: 'verb',
        clue: 'To discuss something with someone to reach an agreement.',
      },
      {
        id: 'business-work-w5',
        word: 'promptly',
        partOfSpeech: 'adverb',
        clue: 'Without any delay; right on time.',
      },
      {
        id: 'business-work-w6',
        word: 'colleague',
        partOfSpeech: 'noun',
        clue: 'A person you work with.',
      },
      {
        id: 'business-work-w7',
        word: 'ambitious',
        partOfSpeech: 'adjective',
        clue: 'Having a strong desire to succeed.',
      },
      {
        id: 'business-work-w8',
        word: 'delegate',
        partOfSpeech: 'verb',
        clue: 'To give a task to someone else to complete.',
      },
    ],
  },
  {
    id: 'nature-environment',
    title: 'Nature & Environment',
    emoji: '🌿',
    color: '#2E9E90',
    description: 'Words about the natural world and our impact on it.',
    words: [
      {
        id: 'nature-environment-w1',
        word: 'waterfall',
        partOfSpeech: 'noun',
        clue: 'Water falling from a high point down to a lower one.',
      },
      {
        id: 'nature-environment-w2',
        word: 'drought',
        partOfSpeech: 'noun',
        clue: 'A long period of time with little or no rain.',
      },
      {
        id: 'nature-environment-w3',
        word: 'fragile',
        partOfSpeech: 'adjective',
        clue: 'Easily broken or damaged.',
      },
      {
        id: 'nature-environment-w4',
        word: 'gradually',
        partOfSpeech: 'adverb',
        clue: 'Happening slowly, little by little.',
      },
      {
        id: 'nature-environment-w5',
        word: 'pollute',
        partOfSpeech: 'verb',
        clue: 'To make air, water, or land dirty or harmful.',
      },
      {
        id: 'nature-environment-w6',
        word: 'wildlife',
        partOfSpeech: 'noun',
        clue: 'Animals living freely in their natural habitat.',
      },
      {
        id: 'nature-environment-w7',
        word: 'abundant',
        partOfSpeech: 'adjective',
        clue: 'Existing in very large quantities.',
      },
      {
        id: 'nature-environment-w8',
        word: 'thrive',
        partOfSpeech: 'verb',
        clue: 'To grow or develop very successfully.',
      },
    ],
  },
  {
    id: 'emotions-personality',
    title: 'Emotions & Personality',
    emoji: '💫',
    color: '#d66e55',
    description: 'Words for feelings, character traits, and how people act.',
    words: [
      {
        id: 'emotions-personality-w1',
        word: 'curious',
        partOfSpeech: 'adjective',
        clue: 'Eager to learn or know something.',
      },
      {
        id: 'emotions-personality-w2',
        word: 'jealousy',
        partOfSpeech: 'noun',
        clue: "A feeling of envy toward someone else's success or things.",
      },
      {
        id: 'emotions-personality-w3',
        word: 'confidently',
        partOfSpeech: 'adverb',
        clue: 'In a manner that shows self-assurance.',
      },
      {
        id: 'emotions-personality-w4',
        word: 'hesitate',
        partOfSpeech: 'verb',
        clue: 'To pause before doing something, often from uncertainty.',
      },
      {
        id: 'emotions-personality-w5',
        word: 'generous',
        partOfSpeech: 'adjective',
        clue: 'Willing to give more than what is expected.',
      },
      {
        id: 'emotions-personality-w6',
        word: 'gratitude',
        partOfSpeech: 'noun',
        clue: 'A feeling of thankfulness.',
      },
      {
        id: 'emotions-personality-w7',
        word: 'stubbornly',
        partOfSpeech: 'adverb',
        clue: 'In a way that refuses to change its course or mind.',
      },
      {
        id: 'emotions-personality-w8',
        word: 'reassure',
        partOfSpeech: 'verb',
        clue: "To say or do something to remove someone's doubts or fears.",
      },
    ],
  },
]

export function getWordThemeById(themeId) {
  return WORD_BUILDER_THEMES.find(t => t.id === themeId) || null
}

/**
 * Pick `count` words from a theme for one round. Shuffled, capped at the
 * theme's available word count (each word is used at most once).
 */
export function pickWords(theme, count) {
  const pool = [...theme.words]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, Math.min(count, pool.length))
}
