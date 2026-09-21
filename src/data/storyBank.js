/**
 * Story Time — story bank (Listening sub-activity content)
 *
 * Each category holds three stories — one per duration bucket (30 sec,
 * 1 min, 2 min) — so a teacher picking a category and a duration always
 * lands on exactly one story. Every story carries its own narration text
 * (read aloud client-side via the browser's built-in Web Speech API — no
 * audio files to host or generate) and a bank of four-choice comprehension
 * questions, in the same Kahoot-style format as Grammar Duel, Synonyms,
 * and Fill It In.
 *
 * `duration` is in seconds (30 | 60 | 120) and roughly matches the story's
 * length at a moderate, ESL-friendly speaking pace.
 */

export const STORY_CATEGORIES = [
  {
    id: 'everyday-life',
    title: 'Everyday Life',
    emoji: '🏠',
    color: '#5ec9b7',
    description: 'Small, relatable moments from daily life.',
    stories: [
      {
        id: 'everyday-life-30',
        duration: 30,
        durationLabel: '30 sec',
        title: 'The Missing Umbrella',
        text: "Maria left her apartment in a hurry. The sky was gray, and she could smell rain in the air. She reached into her bag for her umbrella, but it wasn't there. She had left it at the coffee shop the day before. With no time to go back, Maria pulled her jacket over her head and ran to the bus stop, hoping to beat the storm.",
        questions: [
          {
            id: 'everyday-life-30-q1',
            prompt: 'Why did Maria not have her umbrella?',
            choices: ['She lost it on the bus', 'She left it at the coffee shop', 'She gave it to a friend', 'She never owned one'],
            correctIndex: 1,
            explanation: 'Maria had left her umbrella at the coffee shop the day before.',
          },
          {
            id: 'everyday-life-30-q2',
            prompt: 'What was the weather like?',
            choices: ['Sunny and warm', 'Snowy', 'Gray, with rain coming', 'Windy but clear'],
            correctIndex: 2,
            explanation: 'The sky was gray and she could smell rain coming.',
          },
          {
            id: 'everyday-life-30-q3',
            prompt: 'What did Maria do instead of going back for the umbrella?',
            choices: ['She called a taxi', 'She waited inside', 'She pulled her jacket over her head and ran', 'She borrowed one from a stranger'],
            correctIndex: 2,
            explanation: 'With no time to go back, she pulled her jacket over her head and ran.',
          },
          {
            id: 'everyday-life-30-q4',
            prompt: 'Where was Maria heading?',
            choices: ['To work', 'To the bus stop', 'To the coffee shop', 'To school'],
            correctIndex: 1,
            explanation: 'She ran to the bus stop, hoping to beat the storm.',
          },
        ],
      },
      {
        id: 'everyday-life-60',
        duration: 60,
        durationLabel: '1 min',
        title: 'The New Neighbor',
        text: "When Daniel moved into his new apartment, he didn't know anyone on his street. On his first weekend, he heard a knock at the door. It was Grace, the woman who lived next door. She was holding a plate of cookies and a small note welcoming him to the building. Daniel was surprised — back in his old neighborhood, people rarely introduced themselves. He thanked her and invited her in for coffee. They talked for almost an hour about the neighborhood, the best grocery store nearby, and a park just two blocks away. By the time Grace left, Daniel already felt more at home. He realized that a small gesture, like a plate of cookies, could make a new place feel a little less unfamiliar.",
        questions: [
          {
            id: 'everyday-life-60-q1',
            prompt: "Who knocked on Daniel's door?",
            choices: ['A delivery driver', 'Grace, his neighbor', 'His landlord', 'An old friend'],
            correctIndex: 1,
            explanation: 'Grace, the woman who lived next door, knocked on his door.',
          },
          {
            id: 'everyday-life-60-q2',
            prompt: 'What did Grace bring?',
            choices: ['A welcome basket', 'Flowers', 'A plate of cookies and a note', 'A bottle of wine'],
            correctIndex: 2,
            explanation: 'She was holding a plate of cookies and a small welcome note.',
          },
          {
            id: 'everyday-life-60-q3',
            prompt: 'How did Daniel feel after Grace left?',
            choices: ['More confused', 'Annoyed', 'More at home', 'Tired'],
            correctIndex: 2,
            explanation: 'By the time Grace left, Daniel already felt more at home.',
          },
          {
            id: 'everyday-life-60-q4',
            prompt: 'What did Daniel and Grace talk about?',
            choices: ["Daniel's old job", 'The neighborhood, a grocery store, and a park', "Grace's family", 'The weather'],
            correctIndex: 1,
            explanation: 'They talked about the neighborhood, the best grocery store, and a nearby park.',
          },
        ],
      },
      {
        id: 'everyday-life-120',
        duration: 120,
        durationLabel: '2 min',
        title: 'The Lost Wallet',
        text: "On a busy Tuesday morning, Carlos was rushing to catch his train when he noticed something on the sidewalk — a brown leather wallet. He picked it up and looked around, but no one seemed to be searching for it. Inside, he found a driver's license, a few credit cards, and a photograph of a smiling family standing in front of a lake. Carlos knew he could simply leave the wallet at the nearest police station, but something about the photograph made him want to return it himself. Using the address on the license, he found the owner's apartment building later that evening. He knocked on the door, and a tired-looking man named Robert answered. When Carlos explained what had happened, Robert's face lit up with relief. He had been searching for the wallet all day, worried about canceling his cards and replacing his license. Robert invited Carlos inside and introduced him to his two children, who were the same kids from the photograph. They insisted Carlos stay for dinner as a small thank-you. At first Carlos hesitated, not wanting to intrude, but Robert's family was so welcoming that he agreed. Over dinner, they talked and laughed like old friends, even though they had only just met. As Carlos walked home that night, he realized that a small act of honesty had turned into an unexpected evening of connection. He hadn't planned on making new friends that day, but sometimes the best moments come from doing the right thing without expecting anything in return.",
        questions: [
          {
            id: 'everyday-life-120-q1',
            prompt: 'What did Carlos find on the sidewalk?',
            choices: ['A set of keys', 'A brown leather wallet', 'A phone', 'A book'],
            correctIndex: 1,
            explanation: 'He noticed a brown leather wallet on the sidewalk.',
          },
          {
            id: 'everyday-life-120-q2',
            prompt: 'Why did Carlos decide to return the wallet himself instead of taking it to the police?',
            choices: ['The police station was closed', 'He was curious about the photograph', 'He wanted a reward', 'He recognized the owner'],
            correctIndex: 1,
            explanation: 'Something about the photograph of the family made him want to return it himself.',
          },
          {
            id: 'everyday-life-120-q3',
            prompt: 'Who answered the door?',
            choices: ["Robert's wife", "Robert, the wallet's owner", 'A neighbor', "Robert's children"],
            correctIndex: 1,
            explanation: 'A tired-looking man named Robert, the owner of the wallet, answered.',
          },
          {
            id: 'everyday-life-120-q4',
            prompt: "What did Robert's family do to thank Carlos?",
            choices: ['They gave him money', 'They invited him to stay for dinner', 'They wrote him a letter', 'They gave him a gift card'],
            correctIndex: 1,
            explanation: 'They insisted Carlos stay for dinner as a small thank-you.',
          },
        ],
      },
    ],
  },
  {
    id: 'workplace-careers',
    title: 'Workplace & Careers',
    emoji: '💼',
    color: '#e8934a',
    description: 'Work life, career decisions, and office moments.',
    stories: [
      {
        id: 'workplace-careers-30',
        duration: 30,
        durationLabel: '30 sec',
        title: 'The Big Presentation',
        text: "Priya had practiced her presentation all weekend. Standing in front of her team, her hands felt shaky, but she took a deep breath and began. As she explained the new marketing plan, she noticed her manager nodding along. By the end, her coworkers were asking thoughtful questions instead of sitting in silence. Priya realized that all her preparation had paid off, and for the first time, public speaking didn't feel so frightening.",
        questions: [
          {
            id: 'workplace-careers-30-q1',
            prompt: 'How did Priya feel before she started speaking?',
            choices: ['Confident and calm', 'Shaky and nervous', 'Bored', 'Angry'],
            correctIndex: 1,
            explanation: 'Her hands felt shaky before she took a deep breath and began.',
          },
          {
            id: 'workplace-careers-30-q2',
            prompt: 'What was Priya presenting?',
            choices: ['A budget report', 'A new marketing plan', 'A vacation schedule', 'A hiring plan'],
            correctIndex: 1,
            explanation: 'She explained the new marketing plan to her team.',
          },
          {
            id: 'workplace-careers-30-q3',
            prompt: 'How did her coworkers react?',
            choices: ['They left the room', 'They asked thoughtful questions', 'They fell asleep', 'They complained'],
            correctIndex: 1,
            explanation: 'By the end, her coworkers were asking thoughtful questions.',
          },
          {
            id: 'workplace-careers-30-q4',
            prompt: 'What did Priya realize by the end?',
            choices: ['She needed more practice', 'Her preparation had paid off', 'She hated public speaking', 'The plan had failed'],
            correctIndex: 1,
            explanation: 'She realized all her preparation had paid off.',
          },
        ],
      },
      {
        id: 'workplace-careers-60',
        duration: 60,
        durationLabel: '1 min',
        title: 'Working From Home',
        text: "When the company first announced that employees could work from home, Tom was thrilled. No more long commute, no more crowded trains. But after a few weeks, he noticed something unexpected — he actually missed his coworkers. Video calls were useful for meetings, but they weren't the same as chatting over coffee or grabbing lunch together. Tom decided to try a hybrid schedule instead, coming into the office three days a week. On those days, he made an effort to eat lunch with his team and catch up on projects in person. On the days he worked from home, he focused on quiet, deep work that required concentration. Within a month, Tom felt he had found the perfect balance between flexibility and connection, something he hadn't expected to need so much.",
        questions: [
          {
            id: 'workplace-careers-60-q1',
            prompt: 'Why was Tom thrilled about working from home at first?',
            choices: ['He liked his new office', 'No more long commute or crowded trains', 'He got a raise', 'He could travel more'],
            correctIndex: 1,
            explanation: 'No more long commute, no more crowded trains.',
          },
          {
            id: 'workplace-careers-60-q2',
            prompt: 'What did Tom unexpectedly miss?',
            choices: ['His desk', 'His coworkers', 'The commute', 'The coffee machine'],
            correctIndex: 1,
            explanation: 'He actually missed his coworkers.',
          },
          {
            id: 'workplace-careers-60-q3',
            prompt: 'What schedule did Tom decide to try?',
            choices: ['Fully remote', 'Fully in-office', 'A hybrid schedule, three days in the office', 'Working nights'],
            correctIndex: 2,
            explanation: 'Tom decided to try a hybrid schedule, coming in three days a week.',
          },
          {
            id: 'workplace-careers-60-q4',
            prompt: 'What did Tom do on his work-from-home days?',
            choices: ['He attended more meetings', 'He focused on quiet, deep work', 'He took more breaks', 'He worked shorter hours'],
            correctIndex: 1,
            explanation: 'On his work-from-home days, he focused on quiet, deep work.',
          },
        ],
      },
      {
        id: 'workplace-careers-120',
        duration: 120,
        durationLabel: '2 min',
        title: 'The Career Change',
        text: "After ten years working as an accountant, Sarah felt something was missing. She was good at her job, and the pay was steady, but she no longer felt excited to go to work each morning. During a weekend trip, she volunteered to help renovate a community center, and for the first time in years, she felt genuinely energized. She loved measuring, planning, and watching a space transform with her own hands. That night, she couldn't stop thinking about it. Over the following months, Sarah began taking evening classes in interior design, still working her accounting job during the day. It wasn't easy — she was exhausted most nights, and she sometimes doubted whether switching careers so late was a smart decision. Her friends had mixed opinions; some encouraged her, while others worried she was giving up a stable career for an uncertain one. Despite the doubts, Sarah kept going. She built a small portfolio by redesigning rooms for friends and family, often for free, just to gain experience. A year later, she was offered a junior position at a design firm. The pay was lower than her accounting salary, and she had to start from the bottom again, but she woke up excited every single day. Looking back, Sarah realized that the fear of starting over had almost stopped her from finding work that actually made her happy. She often tells people that it's never too late to follow a passion, even if it means beginning again.",
        questions: [
          {
            id: 'workplace-careers-120-q1',
            prompt: "What was Sarah's original career?",
            choices: ['Interior designer', 'Accountant', 'Teacher', 'Architect'],
            correctIndex: 1,
            explanation: 'She had worked as an accountant for ten years.',
          },
          {
            id: 'workplace-careers-120-q2',
            prompt: 'What experience made Sarah reconsider her career?',
            choices: ['A promotion at work', 'Volunteering to help renovate a community center', 'Losing her job', 'A conversation with her manager'],
            correctIndex: 1,
            explanation: 'Volunteering on a community center renovation made her feel genuinely energized.',
          },
          {
            id: 'workplace-careers-120-q3',
            prompt: 'How did Sarah build experience in her new field?',
            choices: ['She hired a mentor', 'She redesigned rooms for friends and family for free', 'She took a loan', 'She quit her job immediately'],
            correctIndex: 1,
            explanation: 'She built a small portfolio by redesigning rooms for friends and family, often for free.',
          },
          {
            id: 'workplace-careers-120-q4',
            prompt: 'How did Sarah feel after starting her new job, despite the lower pay?',
            choices: ['Regretful', 'Excited every day', 'Indifferent', 'Anxious and unhappy'],
            correctIndex: 1,
            explanation: 'She woke up excited every single day.',
          },
        ],
      },
    ],
  },
  {
    id: 'science-discovery',
    title: 'Science & Discovery',
    emoji: '🔬',
    color: '#6C63FF',
    description: 'Curious facts and true stories from the world of science.',
    stories: [
      {
        id: 'science-discovery-30',
        duration: 30,
        durationLabel: '30 sec',
        title: 'The Sleeping Octopus',
        text: "Scientists once believed that octopuses didn't dream. But researchers studying their sleep noticed something strange \u2014 during certain moments, an octopus's skin would rapidly change color and texture, almost like it was reliving a memory. Some scientists now think octopuses may experience a kind of dream state, similar to humans. If true, it would mean these strange, intelligent creatures have richer inner lives than anyone imagined.",
        questions: [
          {
            id: 'science-discovery-30-q1',
            prompt: 'What did scientists once believe about octopuses?',
            choices: ['They could talk', "They didn't dream", 'They lived forever', "They couldn't sleep at all"],
            correctIndex: 1,
            explanation: "Scientists once believed octopuses didn't dream.",
          },
          {
            id: 'science-discovery-30-q2',
            prompt: 'What strange behavior did researchers notice?',
            choices: ['Octopuses changing color and texture during sleep', 'Octopuses making sounds', 'Octopuses opening their eyes', 'Octopuses swimming in circles'],
            correctIndex: 0,
            explanation: "An octopus's skin would rapidly change color and texture during sleep.",
          },
          {
            id: 'science-discovery-30-q3',
            prompt: 'What do some scientists now think octopuses may experience?',
            choices: ['A kind of dream state', 'A type of hibernation', 'A form of blindness', 'A change in diet'],
            correctIndex: 0,
            explanation: 'Some scientists now think octopuses may experience a kind of dream state.',
          },
          {
            id: 'science-discovery-30-q4',
            prompt: 'What would this discovery suggest about octopuses?',
            choices: ['They are less intelligent than believed', 'They have richer inner lives than imagined', 'They cannot feel anything', 'They are not truly asleep'],
            correctIndex: 1,
            explanation: 'It would mean these creatures have richer inner lives than anyone imagined.',
          },
        ],
      },
      {
        id: 'science-discovery-60',
        duration: 60,
        durationLabel: '1 min',
        title: 'The Accidental Discovery',
        text: "In 1928, a scientist named Alexander Fleming returned from vacation to find something odd in his laboratory. He had left a petri dish of bacteria uncovered, and now a strange mold was growing on it. Instead of throwing it away, Fleming looked closer. He noticed that the bacteria around the mold had died. Curious, he studied the mold further and discovered it produced a substance capable of killing harmful bacteria. That mold, Penicillium, led to the creation of penicillin, one of the first antibiotics in history. What started as a messy, forgotten petri dish ended up saving millions of lives. Fleming's discovery reminds us that some of science's greatest breakthroughs happen not through careful planning, but through curiosity and a willingness to notice the unexpected.",
        questions: [
          {
            id: 'science-discovery-60-q1',
            prompt: 'What did Fleming find when he returned from vacation?',
            choices: ['A broken microscope', 'Mold growing on an uncovered petri dish', 'A missing sample', 'An empty lab'],
            correctIndex: 1,
            explanation: 'He found a strange mold growing on an uncovered petri dish of bacteria.',
          },
          {
            id: 'science-discovery-60-q2',
            prompt: 'What did Fleming notice about the bacteria near the mold?',
            choices: ['It multiplied faster', 'It had died', 'It changed color', 'It became stronger'],
            correctIndex: 1,
            explanation: 'He noticed that the bacteria around the mold had died.',
          },
          {
            id: 'science-discovery-60-q3',
            prompt: 'What did the mold eventually lead to?',
            choices: ['A new type of bacteria', 'The creation of penicillin', 'A vaccine for the flu', 'A new laboratory method'],
            correctIndex: 1,
            explanation: 'That mold, Penicillium, led to the creation of penicillin.',
          },
          {
            id: 'science-discovery-60-q4',
            prompt: 'What lesson does the passage suggest about scientific discovery?',
            choices: ['It only happens with strict planning', 'It can come from curiosity and noticing the unexpected', 'It requires expensive equipment', 'It always takes decades'],
            correctIndex: 1,
            explanation: "Some of science's greatest breakthroughs happen through curiosity and noticing the unexpected.",
          },
        ],
      },
      {
        id: 'science-discovery-120',
        duration: 120,
        durationLabel: '2 min',
        title: 'Mapping the Ocean Floor',
        text: "Most people are surprised to learn that we have better maps of the surface of Mars than we do of our own ocean floor. Even today, more than eighty percent of the world's oceans remain unmapped in detail. This might seem strange in an age of satellites and advanced technology, but water presents a unique challenge. Satellites can photograph land and even the surface of other planets, but they cannot see through thousands of meters of seawater. To map the deep ocean, scientists rely on sonar, sending sound waves down from ships and measuring how long they take to bounce back. This method is slow, expensive, and requires ships to travel back and forth across vast stretches of open water, one narrow strip at a time. In recent years, researchers have started using autonomous underwater vehicles, robotic submarines that can explore the ocean floor without a human crew. These vehicles can map areas far more efficiently than traditional ships, and they can reach depths that would be dangerous for divers. Still, progress is slow, given how enormous the ocean truly is. Scientists estimate that fully mapping the ocean floor at a useful level of detail could take until the 2030s, even with modern technology. Understanding the ocean floor isn't just about curiosity, either. Accurate maps help predict tsunamis, locate valuable mineral resources, and understand how deep ocean currents affect the entire planet's climate. As one oceanographer put it, we may know more about the surface of the moon than we know about our own planet's ocean floor.",
        questions: [
          {
            id: 'science-discovery-120-q1',
            prompt: 'According to the passage, what do we know better than our own ocean floor?',
            choices: ['The surface of Mars', 'The Amazon rainforest', 'The Sahara Desert', 'The North Pole'],
            correctIndex: 0,
            explanation: 'We have better maps of the surface of Mars than of our own ocean floor.',
          },
          {
            id: 'science-discovery-120-q2',
            prompt: "Why can't satellites map the deep ocean directly?",
            choices: ['They are too expensive', 'They cannot see through thousands of meters of seawater', 'They are not allowed near oceans', "There aren't enough satellites"],
            correctIndex: 1,
            explanation: 'Satellites cannot see through thousands of meters of seawater.',
          },
          {
            id: 'science-discovery-120-q3',
            prompt: 'What method do scientists traditionally use to map the ocean floor?',
            choices: ['Underwater cameras', 'Sonar from ships', 'Deep-sea diving', 'Satellite imaging'],
            correctIndex: 1,
            explanation: 'Scientists rely on sonar, sending sound waves down from ships.',
          },
          {
            id: 'science-discovery-120-q4',
            prompt: 'What technology is helping speed up ocean mapping in recent years?',
            choices: ['Weather balloons', 'Autonomous underwater vehicles', 'Space telescopes', 'Fishing boats'],
            correctIndex: 1,
            explanation: 'Researchers have started using autonomous underwater vehicles.',
          },
        ],
      },
    ],
  },
]

export function getStoryCategoryById(categoryId) {
  return STORY_CATEGORIES.find(c => c.id === categoryId) || null
}

export function getStoryByDuration(category, duration) {
  return category?.stories.find(s => s.duration === duration) || null
}
