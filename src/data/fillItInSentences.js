/**
 * Fill It In Tiers (Vocabulary Builder sub-activity)
 *
 * Each tier is a bank of fill-in-the-blank questions. Every question shows
 * a sentence with a missing word (marked with `_____`) and asks the
 * student to pick the word that completes it from four choices — one
 * correct word and three distractors of the same part of speech/form, so
 * every choice reads grammatically and the student has to rely on meaning,
 * not grammar, to pick correctly.
 *
 * Word source note: same as Synonyms — a best-effort selection of common
 * TOEFL/academic-level vocabulary written from general knowledge of that
 * level, not a verified copy of any specific book's word list.
 *
 * `partOfSpeech` is 'noun' | 'verb' | 'adjective', shown as the category
 * badge on the host/reveal UI — mirroring Synonyms and Grammar Duel.
 */

export const FILL_IN_TIERS = [
  {
    id: 'foundational',
    title: 'Foundational',
    emoji: '🌱',
    color: '#5ec9b7',
    description: 'Common academic words every advanced learner should know cold.',
    questions: [
      {
        id: 'foundational-f1',
        partOfSpeech: 'verb',
        sentence: 'The company decided to _____ its plans due to unexpected costs.',
        choices: ['decorate', 'postpone', 'illustrate', 'calculate'],
        correctIndex: 1,
        explanation: '"Postpone" means to delay something until a later time.',
      },
      {
        id: 'foundational-f2',
        partOfSpeech: 'adjective',
        sentence: 'Her explanation was so _____ that everyone understood it immediately.',
        choices: ['ambiguous', 'obscure', 'clear', 'rigid'],
        correctIndex: 2,
        explanation: '"Clear" means easy to understand.',
      },
      {
        id: 'foundational-f3',
        partOfSpeech: 'verb',
        sentence: 'The teacher asked students to _____ their reasoning with examples.',
        choices: ['oppose', 'ignore', 'support', 'delay'],
        correctIndex: 2,
        explanation: '"Support" means to back up or provide evidence for a claim.',
      },
      {
        id: 'foundational-f4',
        partOfSpeech: 'adjective',
        sentence: 'It is _____ to bring a jacket, since the weather may change.',
        choices: ['advisable', 'arbitrary', 'reluctant', 'ambiguous'],
        correctIndex: 0,
        explanation: '"Advisable" means sensible or recommended.',
      },
      {
        id: 'foundational-f5',
        partOfSpeech: 'verb',
        sentence: 'The scientist could not _____ the strange results of the experiment.',
        choices: ['explain', 'generate', 'eliminate', 'predict'],
        correctIndex: 0,
        explanation: '"Explain" means to make something clear or understandable.',
      },
      {
        id: 'foundational-f6',
        partOfSpeech: 'noun',
        sentence: 'There was a noticeable _____ in her attitude after the good news.',
        choices: ['shift', 'obstacle', 'sequence', 'discrepancy'],
        correctIndex: 0,
        explanation: '"Shift" means a change in position or attitude.',
      },
      {
        id: 'foundational-f7',
        partOfSpeech: 'verb',
        sentence: 'The manager will _____ the new employees on their first day.',
        choices: ['orient', 'undermine', 'mitigate', 'reconcile'],
        correctIndex: 0,
        explanation: '"Orient" means to familiarize someone with a new situation.',
      },
      {
        id: 'foundational-f8',
        partOfSpeech: 'adjective',
        sentence: 'He gave a _____ answer, avoiding the real question entirely.',
        choices: ['vague', 'meticulous', 'pragmatic', 'coherent'],
        correctIndex: 0,
        explanation: '"Vague" means not clear or precise.',
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
        id: 'intermediate-f1',
        partOfSpeech: 'verb',
        sentence: 'The new policy will _____ significantly how employees request time off.',
        choices: ['affect', 'fabricate', 'substantiate', 'reconcile'],
        correctIndex: 0,
        explanation: '"Affect" means to influence or have an impact on something.',
      },
      {
        id: 'intermediate-f2',
        partOfSpeech: 'verb',
        sentence: 'Researchers hope to _____ new evidence that supports their theory.',
        choices: ['uncover', 'exacerbate', 'mitigate', 'undermine'],
        correctIndex: 0,
        explanation: '"Uncover" means to discover or reveal something previously hidden.',
      },
      {
        id: 'intermediate-f3',
        partOfSpeech: 'adjective',
        sentence: "The professor's lecture was surprisingly _____, covering far more than expected.",
        choices: ['comprehensive', 'arbitrary', 'ambiguous', 'reluctant'],
        correctIndex: 0,
        explanation: '"Comprehensive" means complete and including everything necessary.',
      },
      {
        id: 'intermediate-f4',
        partOfSpeech: 'verb',
        sentence: 'The two reports _____ each other, which confused the committee.',
        choices: ['contradict', 'facilitate', 'substantiate', 'reconcile'],
        correctIndex: 0,
        explanation: '"Contradict" means to state the opposite, creating inconsistency.',
      },
      {
        id: 'intermediate-f5',
        partOfSpeech: 'verb',
        sentence: 'It took months to _____ enough data to reach a conclusion.',
        choices: ['accumulate', 'eliminate', 'diminish', 'exacerbate'],
        correctIndex: 0,
        explanation: '"Accumulate" means to gather or collect over time.',
      },
      {
        id: 'intermediate-f6',
        partOfSpeech: 'adjective',
        sentence: 'The results were _____ with what the researchers had predicted.',
        choices: ['consistent', 'arbitrary', 'reluctant', 'ambiguous'],
        correctIndex: 0,
        explanation: '"Consistent" means matching or in agreement with something.',
      },
      {
        id: 'intermediate-f7',
        partOfSpeech: 'adjective',
        sentence: 'Her argument, while persuasive, lacked _____ evidence.',
        choices: ['concrete', 'temporary', 'generous', 'dormant'],
        correctIndex: 0,
        explanation: '"Concrete" means specific and real, as opposed to vague or abstract.',
      },
      {
        id: 'intermediate-f8',
        partOfSpeech: 'noun',
        sentence: 'After hours of negotiation, both sides finally reached a _____ that required each to give up something.',
        choices: ['compromise', 'monopoly', 'hierarchy', 'paradox'],
        correctIndex: 0,
        explanation: '"Compromise" means an agreement reached by each side making concessions.',
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
        id: 'advanced-f1',
        partOfSpeech: 'adjective',
        sentence: "The senator's speech was criticized as _____, offering no real solutions.",
        choices: ['superficial', 'meticulous', 'pragmatic', 'ubiquitous'],
        correctIndex: 0,
        explanation: '"Superficial" means shallow, lacking depth or thoroughness.',
      },
      {
        id: 'advanced-f2',
        partOfSpeech: 'verb',
        sentence: "The historian tried to _____ the causes of the empire's decline.",
        choices: ['discern', 'exacerbate', 'substantiate', 'reconcile'],
        correctIndex: 0,
        explanation: '"Discern" means to recognize or figure out something not obvious.',
      },
      {
        id: 'advanced-f3',
        partOfSpeech: 'adjective',
        sentence: "The professor's theory remains _____ among scholars in the field.",
        choices: ['contentious', 'ubiquitous', 'meticulous', 'pragmatic'],
        correctIndex: 0,
        explanation: '"Contentious" means likely to cause disagreement or debate.',
      },
      {
        id: 'advanced-f4',
        partOfSpeech: 'adjective',
        sentence: "The committee's decision seemed _____, lacking any clear justification.",
        choices: ['arbitrary', 'deliberate', 'unanimous', 'decisive'],
        correctIndex: 0,
        explanation: '"Arbitrary" means based on random choice rather than reason.',
      },
      {
        id: 'advanced-f5',
        partOfSpeech: 'adjective',
        sentence: 'Despite the repeated setbacks, she remained remarkably _____, bouncing back each time.',
        choices: ['resilient', 'superficial', 'contentious', 'dormant'],
        correctIndex: 0,
        explanation: '"Resilient" means able to recover quickly from difficulties.',
      },
      {
        id: 'advanced-f6',
        partOfSpeech: 'adjective',
        sentence: 'The evidence was _____ enough to convince even the skeptics.',
        choices: ['compelling', 'dormant', 'ubiquitous', 'arbitrary'],
        correctIndex: 0,
        explanation: '"Compelling" means convincing or persuasive.',
      },
      {
        id: 'advanced-f7',
        partOfSpeech: 'adjective',
        sentence: 'The two theories are fundamentally _____ and cannot both be true.',
        choices: ['incompatible', 'comprehensive', 'resilient', 'contentious'],
        correctIndex: 0,
        explanation: '"Incompatible" means unable to coexist or both be correct.',
      },
      {
        id: 'advanced-f8',
        partOfSpeech: 'verb',
        sentence: "The report's conclusions were later _____ by newly discovered data.",
        choices: ['refuted', 'substantiated', 'facilitated', 'reconciled'],
        correctIndex: 0,
        explanation: '"Refuted" means proven wrong or disproven.',
      },
    ],
  },
]

export function getFillInTierById(tierId) {
  return FILL_IN_TIERS.find(t => t.id === tierId) || null
}

/**
 * Pick `count` questions from a tier for one round. Shuffled, capped at the
 * tier's available question count (each question is used at most once).
 */
export function pickFillInQuestions(tier, count) {
  const pool = [...tier.questions]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, Math.min(count, pool.length))
}
