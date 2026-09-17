/**
 * Synonyms Tiers (Vocabulary Builder sub-activity)
 *
 * Each tier is a bank of definition/clue questions. Every question shows
 * a hint, definition, or description and asks the student to pick the
 * vocabulary word it describes from four choices — one correct word and
 * three plausible distractors of the same part of speech.
 *
 * Word source note: this bank is a best-effort selection of common
 * TOEFL/academic-level vocabulary in the spirit of resources like
 * McGraw-Hill's "400 Must-Have Words for the TOEFL Test," written from
 * general knowledge of that level of vocabulary. It is NOT a verified,
 * word-for-word copy of that book's specific 400-word list — swap in
 * exact words from your copy of the book here if precise fidelity to it
 * matters for your class.
 *
 * `partOfSpeech` is 'noun' | 'verb' | 'adjective', shown as the category
 * badge on the host/reveal UI — mirroring Grammar Duel's `category` field.
 */

export const SYNONYM_TIERS = [
  {
    id: 'foundational',
    title: 'Foundational',
    emoji: '🌱',
    color: '#5ec9b7',
    description: 'Common academic words every advanced learner should know cold.',
    questions: [
      {
        id: 'foundational-s1',
        partOfSpeech: 'adjective',
        clue: 'Plants or species brought from elsewhere that spread and take over an area uncontrollably.',
        choices: ['dormant', 'native', 'invasive', 'isolated'],
        correctIndex: 2,
        explanation: '"Invasive" species spread aggressively once introduced to a new environment, often crowding out native plants and animals.',
      },
      {
        id: 'foundational-s2',
        partOfSpeech: 'verb',
        clue: 'To produce or create something, such as electricity, income, or new ideas.',
        choices: ['calculate', 'generate', 'decorate', 'eliminate'],
        correctIndex: 1,
        explanation: '"Generate" means to produce something, from electricity to fresh ideas.',
      },
      {
        id: 'foundational-s3',
        partOfSpeech: 'noun',
        clue: 'Facts, objects, or information that help prove whether something is true.',
        choices: ['opinion', 'rumor', 'schedule', 'evidence'],
        correctIndex: 3,
        explanation: '"Evidence" is the proof — facts or objects — that support a claim.',
      },
      {
        id: 'foundational-s4',
        partOfSpeech: 'adjective',
        clue: 'Important enough to be noticed or to have a real, lasting effect.',
        choices: ['significant', 'convenient', 'temporary', 'identical'],
        correctIndex: 0,
        explanation: 'Something "significant" matters enough to have a real impact, not just a minor one.',
      },
      {
        id: 'foundational-s5',
        partOfSpeech: 'verb',
        clue: 'To say what you think will happen before it actually happens.',
        choices: ['permit', 'persist', 'predict', 'prevent'],
        correctIndex: 2,
        explanation: 'To "predict" is to forecast a future event based on evidence or experience.',
      },
      {
        id: 'foundational-s6',
        partOfSpeech: 'noun',
        clue: 'Something that blocks your path or makes progress difficult.',
        choices: ['outcome', 'obstacle', 'origin', 'opportunity'],
        correctIndex: 1,
        explanation: 'An "obstacle" stands in your way and has to be overcome.',
      },
      {
        id: 'foundational-s7',
        partOfSpeech: 'adjective',
        clue: 'Not willing to do something; hesitant or unenthusiastic about it.',
        choices: ['generous', 'capable', 'eager', 'reluctant'],
        correctIndex: 3,
        explanation: 'Someone "reluctant" drags their feet — the opposite of eager.',
      },
      {
        id: 'foundational-s8',
        partOfSpeech: 'verb',
        clue: 'To completely remove or get rid of something.',
        choices: ['eliminate', 'illustrate', 'negotiate', 'generate'],
        correctIndex: 0,
        explanation: 'To "eliminate" something is to remove it entirely.',
      },
    ],
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    emoji: '📘',
    color: '#f6db96',
    description: 'Words that show up constantly in academic reading and essays.',
    questions: [
      {
        id: 'intermediate-s1',
        partOfSpeech: 'verb',
        clue: 'To make a process or action easier to do.',
        choices: ['facilitate', 'fabricate', 'hesitate', 'deteriorate'],
        correctIndex: 0,
        explanation: 'To "facilitate" something is to smooth the way for it to happen.',
      },
      {
        id: 'intermediate-s2',
        partOfSpeech: 'adjective',
        clue: 'Having more than one possible meaning; not clearly defined.',
        choices: ['definitive', 'ambiguous', 'ambitious', 'adjacent'],
        correctIndex: 1,
        explanation: 'An "ambiguous" statement could be read more than one way.',
      },
      {
        id: 'intermediate-s3',
        partOfSpeech: 'noun',
        clue: 'An idea proposed as a starting point for further investigation, not yet proven.',
        choices: ['summary', 'principle', 'hypothesis', 'conclusion'],
        correctIndex: 2,
        explanation: 'A "hypothesis" is a testable guess, the starting point of research — not the final answer.',
      },
      {
        id: 'intermediate-s4',
        partOfSpeech: 'verb',
        clue: "To secretly or gradually weaken someone's authority, confidence, or a plan.",
        choices: ['reinforce', 'underline', 'undermine', 'overturn'],
        correctIndex: 2,
        explanation: 'To "undermine" something is to erode it from underneath, often without being obvious about it.',
      },
      {
        id: 'intermediate-s5',
        partOfSpeech: 'adjective',
        clue: 'Logical, clear, and easy to follow from one point to the next.',
        choices: ['coherent', 'obscure', 'rigid', 'fluent'],
        correctIndex: 0,
        explanation: 'A "coherent" argument holds together logically, point to point.',
      },
      {
        id: 'intermediate-s6',
        partOfSpeech: 'noun',
        clue: 'General agreement reached by most members of a group.',
        choices: ['controversy', 'dispute', 'consensus', 'exception'],
        correctIndex: 2,
        explanation: 'A "consensus" is the shared agreement a group settles on.',
      },
      {
        id: 'intermediate-s7',
        partOfSpeech: 'verb',
        clue: 'To make something less severe, harmful, or painful.',
        choices: ['aggravate', 'mitigate', 'dictate', 'isolate'],
        correctIndex: 1,
        explanation: 'To "mitigate" a problem is to soften its impact, not eliminate it entirely.',
      },
      {
        id: 'intermediate-s8',
        partOfSpeech: 'adjective',
        clue: 'Based on random choice or personal whim rather than reason or a system.',
        choices: ['mandatory', 'uniform', 'deliberate', 'arbitrary'],
        correctIndex: 3,
        explanation: 'An "arbitrary" decision isn\'t grounded in a clear rule or reason.',
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced',
    emoji: '🧠',
    color: '#6C63FF',
    description: 'Higher-level vocabulary for confident, exam-ready students.',
    questions: [
      {
        id: 'advanced-s1',
        partOfSpeech: 'adjective',
        clue: 'Showing great attention to detail; extremely careful and precise.',
        choices: ['reckless', 'meticulous', 'spontaneous', 'indifferent'],
        correctIndex: 1,
        explanation: 'A "meticulous" person double-checks every detail.',
      },
      {
        id: 'advanced-s2',
        partOfSpeech: 'verb',
        clue: 'To make a problem, bad situation, or negative feeling worse.',
        choices: ['alleviate', 'articulate', 'exacerbate', 'replicate'],
        correctIndex: 2,
        explanation: 'To "exacerbate" something is to make an already bad situation worse.',
      },
      {
        id: 'advanced-s3',
        partOfSpeech: 'noun',
        clue: 'A statement or situation that seems contradictory but may actually be true.',
        choices: ['premise', 'paradox', 'analogy', 'anomaly'],
        correctIndex: 1,
        explanation: 'A "paradox" looks like a contradiction on the surface, but often reveals a deeper truth.',
      },
      {
        id: 'advanced-s4',
        partOfSpeech: 'adjective',
        clue: 'Seeming to be present or appearing everywhere at the same time.',
        choices: ['obsolete', 'exclusive', 'ubiquitous', 'sporadic'],
        correctIndex: 2,
        explanation: 'Something "ubiquitous" turns up absolutely everywhere.',
      },
      {
        id: 'advanced-s5',
        partOfSpeech: 'verb',
        clue: 'To provide evidence that supports or proves a claim.',
        choices: ['speculate', 'substantiate', 'fabricate', 'depreciate'],
        correctIndex: 1,
        explanation: 'To "substantiate" a claim is to back it up with solid evidence.',
      },
      {
        id: 'advanced-s6',
        partOfSpeech: 'noun',
        clue: 'A difference or lack of agreement between facts or figures that should match.',
        choices: ['correlation', 'sequence', 'discrepancy', 'consensus'],
        correctIndex: 2,
        explanation: 'A "discrepancy" is a mismatch between numbers or accounts that ought to line up.',
      },
      {
        id: 'advanced-s7',
        partOfSpeech: 'adjective',
        clue: 'Dealing with problems in a practical, realistic way rather than by theory or ideals.',
        choices: ['idealistic', 'pragmatic', 'erratic', 'superficial'],
        correctIndex: 1,
        explanation: 'A "pragmatic" approach favors what works over what sounds ideal.',
      },
      {
        id: 'advanced-s8',
        partOfSpeech: 'verb',
        clue: 'To make two apparently conflicting ideas, facts, or people compatible with each other.',
        choices: ['revoke', 'delegate', 'replicate', 'reconcile'],
        correctIndex: 3,
        explanation: 'To "reconcile" two things is to bring them into agreement.',
      },
    ],
  },
]

export function getSynonymTierById(tierId) {
  return SYNONYM_TIERS.find(t => t.id === tierId) || null
}

/**
 * Pick `count` questions from a tier for one round. Shuffled, capped at the
 * tier's available question count (each question is used at most once).
 */
export function pickSynonymQuestions(tier, count) {
  const pool = [...tier.questions]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, Math.min(count, pool.length))
}
