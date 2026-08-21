/**
 * Reading Comprehension Topics for TOEFL-style practice
 * Each topic has 2-3 perspectives with different viewpoints
 * Topics are organized by time limit and complexity
 */

export const READING_TOPICS = [
  {
    id: 'homework-helpful',
    timeLimit: 60,
    complexity: 'easy',
    title: 'Is homework helpful or harmful?',
    perspectives: [
      {
        id: 'perspective_1',
        name: 'Ms. Sarah Johnson',
        title: 'High School Teacher',
        icon: '👩‍🏫',
        color: '#5ec9b7',
        viewpoint: 'Homework reinforces what students learn in class and develops discipline. It gives us insight into which students understand the material. Students who do homework consistently perform better on exams.'
      },
      {
        id: 'perspective_2',
        name: 'David Chen',
        title: 'Education Researcher',
        icon: '👨‍🔬',
        color: '#f6db96',
        viewpoint: 'Research shows excessive homework causes stress and burnout, especially for teenagers. Students need time to relax, play, and develop interests outside school. Quality instruction during class time is more effective than hours of homework.'
      }
    ]
  },
  {
    id: 'videogames-worthwhile',
    timeLimit: 60,
    complexity: 'easy',
    title: 'Are video games a waste of time?',
    perspectives: [
      {
        id: 'perspective_1',
        name: 'Maya Patel',
        title: 'Parent & Psychologist',
        icon: '👩‍⚕️',
        color: '#FF6B6B',
        viewpoint: 'Video games are addictive and keep children from physical activity, reading, and real social interaction. They contain violence and promote poor health habits. Kids spend hours staring at screens instead of playing outside.'
      },
      {
        id: 'perspective_2',
        name: 'Alex Rodriguez',
        title: 'Game Developer & Designer',
        icon: '👨‍💻',
        color: '#6C63FF',
        viewpoint: 'Modern games teach problem-solving, teamwork, and creativity. Multiplayer games connect people globally. Some games are educational and improve hand-eye coordination. Like any activity, moderation is key.'
      }
    ]
  },
  {
    id: 'school-uniforms-required',
    timeLimit: 60,
    complexity: 'easy',
    title: 'Should schools require uniforms?',
    perspectives: [
      {
        id: 'perspective_1',
        name: 'Principal Marcus Williams',
        title: 'School Administrator',
        icon: '👨‍💼',
        color: '#457B9D',
        viewpoint: 'School uniforms reduce distractions, create equality among students, and improve focus on academics. They prevent bullying based on clothing brands and reduce gang-related clothing. Uniforms are cost-effective and simplify mornings.'
      },
      {
        id: 'perspective_2',
        name: 'Emma Thompson',
        title: 'Student & Fashion Advocate',
        icon: '👩‍🎓',
        color: '#E76F51',
        viewpoint: 'Uniforms suppress self-expression and individuality during important developmental years. Students should learn to make appropriate fashion choices. Uniforms are expensive and don\'t actually improve academic performance or behavior.'
      }
    ]
  },
  {
    id: 'social-media-regulation',
    timeLimit: 300,
    complexity: 'medium',
    title: 'Should social media platforms be regulated by governments?',
    perspectives: [
      {
        id: 'perspective_1',
        name: 'Dr. Patricia Wong',
        title: 'Digital Rights Activist',
        icon: '👩‍⚖️',
        color: '#FF6B6B',
        viewpoint: 'Social media companies exploit user data and amplify misinformation without consequence. Government regulation is necessary to protect privacy, prevent mental health damage in youth, and combat election interference. Companies prioritize profits over public safety.'
      },
      {
        id: 'perspective_2',
        name: 'James Mitchell',
        title: 'Tech Industry Executive',
        icon: '👨‍💼',
        color: '#6C63FF',
        viewpoint: 'Heavy regulation stifles innovation and free speech. Social media companies already implement content policies and invest in safety features. Government regulation could lead to censorship. The free market and competition are better solutions than government control.'
      },
      {
        id: 'perspective_3',
        name: 'Dr. Lisa Chen',
        title: 'Sociologist',
        icon: '👩‍🔬',
        color: '#2EC4A9',
        viewpoint: 'Both industry self-regulation and government oversight are needed. Light-touch regulation focusing on transparency and data protection is better than heavy-handed censorship. Users need education about media literacy alongside policy changes.'
      }
    ]
  },
  {
    id: 'remote-work-better',
    timeLimit: 300,
    complexity: 'medium',
    title: 'Is working from home better than working in an office?',
    perspectives: [
      {
        id: 'perspective_1',
        name: 'Sophie Dubois',
        title: 'Remote Worker & Parent',
        icon: '👩‍💼',
        color: '#2EC4A9',
        viewpoint: 'Remote work improves work-life balance, eliminates commute stress, and increases productivity. Parents can be more present for their families. Employees are happier and less burned out. Technology makes collaboration seamless. Companies save money on office space.'
      },
      {
        id: 'perspective_2',
        name: 'Robert Kim',
        title: 'Corporate Manager',
        icon: '👨‍💼',
        color: '#FF6B6B',
        viewpoint: 'Office collaboration is irreplaceable for building team culture and mentoring junior employees. Zoom fatigue and isolation are real problems. In-person meetings are more efficient for complex problem-solving. Employees\' careers suffer without office visibility.'
      },
      {
        id: 'perspective_3',
        name: 'Dr. Elena Rossi',
        title: 'Organizational Psychologist',
        icon: '👩‍🔬',
        color: '#F4A261',
        viewpoint: 'The answer depends on the job type. Some roles benefit from remote work while others need collaboration. Hybrid arrangements offer the best of both worlds. Mental health outcomes vary by individual and company culture.'
      }
    ]
  },
  {
    id: 'smartphones-children-ban',
    timeLimit: 300,
    complexity: 'medium',
    title: 'Should children under 14 be restricted from owning smartphones?',
    perspectives: [
      {
        id: 'perspective_1',
        name: 'Dr. Jonathan Baker',
        title: 'Child Development Specialist',
        icon: '👨‍⚕️',
        color: '#FF6B6B',
        viewpoint: 'Smartphones harm childhood development by reducing attention spans, sleep, and face-to-face interaction. Young children are vulnerable to addiction, cyberbullying, and inappropriate content. Early restrictions build healthier habits. Developing brains need protection.'
      },
      {
        id: 'perspective_2',
        name: 'Aisha Patel',
        title: 'Technology Access Advocate',
        icon: '👩‍💼',
        color: '#6C63FF',
        viewpoint: 'Smartphones are essential tools for modern education and safety. Kids need them for school projects, contacting parents, and participating in society. Bans discriminate against lower-income families. Education about healthy use is better than restriction.'
      }
    ]
  },
  {
    id: 'ai-education-revolution',
    timeLimit: 300,
    complexity: 'medium',
    title: 'Will artificial intelligence revolutionize education?',
    perspectives: [
      {
        id: 'perspective_1',
        name: 'Professor Michael Zhang',
        title: 'Education Technology Researcher',
        icon: '👨‍🎓',
        color: '#6C63FF',
        viewpoint: 'AI enables personalized learning at scale, adapts to each student\'s pace, and provides instant feedback. It frees teachers from grading to focus on mentoring. AI tutors are available 24/7 regardless of geography or wealth. Education will be democratized.'
      },
      {
        id: 'perspective_2',
        name: 'Katherine Morrison',
        title: 'Traditional Education Advocate',
        icon: '👩‍🏫',
        color: '#FF6B6B',
        viewpoint: 'Education is fundamentally about human connection and mentorship. AI cannot replace the wisdom of experienced teachers or the value of peer collaboration. Over-reliance on AI creates isolation. We risk losing the art of teaching.'
      },
      {
        id: 'perspective_3',
        name: 'Dr. Hassan Omar',
        title: 'EdTech Entrepreneur',
        icon: '👨‍💻',
        color: '#2EC4A9',
        viewpoint: 'AI is a powerful tool that enhances education but shouldn\'t replace teachers. The best outcomes combine AI-powered learning with excellent teaching. Implementation challenges around equity and bias need careful attention.'
      }
    ]
  },
  {
    id: 'public-transit-vs-cars',
    timeLimit: 300,
    complexity: 'medium',
    title: 'Should cities prioritize public transportation over private cars?',
    perspectives: [
      {
        id: 'perspective_1',
        name: 'Dr. Victoria Lopez',
        title: 'Urban Planner',
        icon: '👩‍🏢',
        color: '#2EC4A9',
        viewpoint: 'Public transit reduces congestion, pollution, and the need for parking. Cities with good transit are cleaner and more livable. Cars are inefficient for moving people in dense urban areas. Investment in buses and trains improves everyone\'s quality of life.'
      },
      {
        id: 'perspective_2',
        name: 'Thomas Anderson',
        title: 'Suburban Resident & Commuter',
        icon: '👨‍💼',
        color: '#FF6B6B',
        viewpoint: 'Cars provide freedom, flexibility, and door-to-door convenience that transit can\'t match. Many people live in areas where transit is impractical. Car commuting is safe and private. Eliminating cars would harm people who depend on them.'
      }
    ]
  },
  {
    id: 'social-media-harm-benefit',
    timeLimit: 600,
    complexity: 'hard',
    title: 'Does social media do more harm than good?',
    perspectives: [
      {
        id: 'perspective_1',
        name: 'Dr. Samantha Clarke',
        title: 'Mental Health Researcher',
        icon: '👩‍⚕️',
        color: '#FF6B6B',
        viewpoint: 'Social media is designed to be addictive and exploits psychological vulnerabilities. Research consistently links heavy social media use to depression, anxiety, and low self-esteem, particularly in adolescents. The comparison trap, cyberbullying, and FOMO cause measurable harm. We\'re not prepared for these consequences.'
      },
      {
        id: 'perspective_2',
        name: 'Marcus Jefferson',
        title: 'Social Activist & Organizer',
        icon: '👨‍💼',
        color: '#2EC4A9',
        viewpoint: 'Social media has enabled grassroots movements, amplified marginalized voices, and connected people globally. Activist communities use platforms to organize for social justice and support each other during crises. These benefits are profound and often life-changing.'
      },
      {
        id: 'perspective_3',
        name: 'Dr. Rafael Santos',
        title: 'Technology Ethics Scholar',
        icon: '👨‍🔬',
        color: '#6C63FF',
        viewpoint: 'Social media is neutral technology—outcomes depend on design and use. The problem is algorithmic design prioritizing engagement over truth. The solution requires regulation, transparency, and education, not elimination.'
      }
    ]
  },
  {
    id: 'corporations-environmental-responsibility',
    timeLimit: 600,
    complexity: 'hard',
    title: 'Should corporations be held responsible for environmental damage they cause?',
    perspectives: [
      {
        id: 'perspective_1',
        name: 'Dr. Elena Vasquez',
        title: 'Environmental Justice Attorney',
        icon: '👩‍⚖️',
        color: '#FF6B6B',
        viewpoint: 'Corporations must be accountable when institutions fail. Polluting companies externalize costs onto vulnerable communities. Strong liability laws force innovation. Without accountability, corporations destroy ecosystems for shareholder value.'
      },
      {
        id: 'perspective_2',
        name: 'James Richardson',
        title: 'Business Leader & Economist',
        icon: '👨‍💼',
        color: '#6C63FF',
        viewpoint: 'Excessive responsibility reduces competitiveness and drives manufacturing elsewhere. Strict liability creates endless lawsuits preventing investment. Market competition incentivizes cleaner processes better than regulation.'
      },
      {
        id: 'perspective_3',
        name: 'Dr. Patricia Wei',
        title: 'Sustainable Business Strategist',
        icon: '👩‍💼',
        color: '#2EC4A9',
        viewpoint: 'Responsibility should be shared between corporations, government, and consumers. Strong but reasonable regulations allow profitable operation while protecting the environment. Carbon pricing and caps encourage innovation.'
      }
    ]
  },
  {
    id: 'universal-basic-income',
    timeLimit: 600,
    complexity: 'hard',
    title: 'Is universal basic income a viable solution to poverty?',
    perspectives: [
      {
        id: 'perspective_1',
        name: 'Dr. Kenji Nakamura',
        title: 'Economic Policy Researcher',
        icon: '👨‍🏫',
        color: '#2EC4A9',
        viewpoint: 'UBI provides financial security and reduces poverty effectively. Pilot programs show recipients gain dignity, health improves, and some pursue education or start businesses. As automation eliminates jobs, UBI becomes essential. The cost is manageable through progressive taxation.'
      },
      {
        id: 'perspective_2',
        name: 'Robert Thompson',
        title: 'Fiscal Conservative & Policy Expert',
        icon: '👨‍💼',
        color: '#FF6B6B',
        viewpoint: 'UBI is economically unsustainable and fiscally irresponsible. The cost of paying every adult would require massive tax increases. Inflation would eat purchasing power gains. Work incentives would decline. Targeted assistance to those in need is more efficient.'
      },
      {
        id: 'perspective_3',
        name: 'Dr. Amara Okafor',
        title: 'Development Economics Expert',
        icon: '👩‍🔬',
        color: '#F4A261',
        viewpoint: 'UBI alone won\'t solve poverty without complementary policies. Healthcare, education, and job opportunities matter as much as cash. A hybrid approach combining modest UBI with strong public services might work better.'
      }
    ]
  },
  {
    id: 'ai-job-displacement',
    timeLimit: 600,
    complexity: 'hard',
    title: 'Will AI replace human workers and cause mass unemployment?',
    perspectives: [
      {
        id: 'perspective_1',
        name: 'Dr. Yuki Tanaka',
        title: 'AI Researcher & Futurist',
        icon: '👨‍🔬',
        color: '#FF6B6B',
        viewpoint: 'AI will displace millions of workers in transportation, manufacturing, retail, and office work. Unlike past automation, AI threatens cognitive work. The transition will be painful with massive unemployment. We need proactive policies like retraining and UBI now.'
      },
      {
        id: 'perspective_2',
        name: 'Catherine Moore',
        title: 'Tech Industry Optimist',
        icon: '👩‍💻',
        color: '#6C63FF',
        viewpoint: 'AI will create more jobs than it destroys, like electricity and computers did. New industries and roles will emerge. AI handles drudgery, freeing humans for creative work. Productivity gains raise living standards. Economies adapt with new technology.'
      },
      {
        id: 'perspective_3',
        name: 'Dr. Sarah Adeyemi',
        title: 'Labor Economics Professor',
        icon: '👩‍🏫',
        color: '#2EC4A9',
        viewpoint: 'AI will cause significant displacement, but outcomes depend on policy. With investment in education and retraining, transitions can be managed. Without proper policy, inequality will increase. The outcome is a choice society makes now.'
      }
    ]
  },
  {
    id: 'cancel-culture-accountability',
    timeLimit: 600,
    complexity: 'hard',
    title: 'Does cancel culture promote accountability or enable unfair punishment?',
    perspectives: [
      {
        id: 'perspective_1',
        name: 'Dr. Michelle Johnson',
        title: 'Social Justice Advocate',
        icon: '👩‍⚖️',
        color: '#2EC4A9',
        viewpoint: 'Cancel culture holds powerful people accountable when institutions fail. Marginalized communities use platforms to expose wrongdoing because traditional power structures ignore them. Public accountability is democracy. People have the right to criticize and withdraw support from those who cause harm.'
      },
      {
        id: 'perspective_2',
        name: 'Jonathan Phillips',
        title: 'Free Speech Defender',
        icon: '👨‍💼',
        color: '#FF6B6B',
        viewpoint: 'Cancel culture is mob justice that destroys careers over minor infractions. People lose livelihoods without due process. The punishment often doesn\'t fit the offense. Fear of cancellation prevents honest dialogue. Growth and forgiveness become impossible.'
      },
      {
        id: 'perspective_3',
        name: 'Dr. Kwame Asante',
        title: 'Media Studies Scholar',
        icon: '👨‍🎓',
        color: '#6C63FF',
        viewpoint: 'Cancel culture is neither purely good nor bad—it\'s a powerful tool with mixed outcomes. Sometimes it holds people accountable when nothing else works. Sometimes it enables disproportionate punishment. The key is proportionality and space for growth.'
      }
    ]
  }
]

export function getTopicsByTimeLimit(timeLimit) {
  return READING_TOPICS.filter(t => t.timeLimit === timeLimit)
}

export function getRandomTopicByTimeLimit(timeLimit) {
  const topics = getTopicsByTimeLimit(timeLimit)
  return topics[Math.floor(Math.random() * topics.length)]
}

export function getTopicsByComplexity() {
  return {
    easy: READING_TOPICS.filter(t => t.complexity === 'easy'),
    medium: READING_TOPICS.filter(t => t.complexity === 'medium'),
    hard: READING_TOPICS.filter(t => t.complexity === 'hard')
  }
}

export default READING_TOPICS
