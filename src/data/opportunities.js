// Pre-seeded opportunity data
const rawOpportunities = [
  {
    id: 1,
    title: 'Machine Learning Research Intern',
    organization: 'Google DeepMind',
    type: 'internship',
    description: 'Join our team to explore cutting-edge ML architectures. You will work on large-scale language models and contribute to published research papers.',
    fullDescription: 'Google DeepMind is seeking passionate ML Research Interns to join our London and Mountain View offices for a 12-week program. You will collaborate with leading researchers on projects spanning reinforcement learning, natural language processing, and computer vision. Interns are expected to contribute original research that may lead to publications at top-tier venues like NeurIPS, ICML, or ICLR.',
    requirements: ['Strong foundation in linear algebra, probability, and statistics', 'Experience with PyTorch or TensorFlow', 'Published research or strong coursework in ML', 'Currently pursuing a Master\'s or PhD in CS, Math, or related field'],
    eligibility: 'Open to graduate students (Masters/PhD) in Computer Science, Mathematics, or related STEM fields with a minimum CGPA of 8.0.',
    deadline: '2026-05-15',
    stipend: '$9,500/month',
    location: 'Mountain View, CA / London, UK',
    tags: ['AI/ML', 'Research', 'Deep Learning'],
    link: 'https://deepmind.google/careers',
  },
  {
    id: 2,
    title: 'HackMIT 2026',
    organization: 'MIT',
    type: 'hackathon',
    description: 'MIT\'s flagship annual hackathon — 36 hours to build something incredible. Over $50,000 in prizes across multiple tracks.',
    fullDescription: 'HackMIT brings together 1,000+ of the world\'s top student hackers for an unforgettable weekend at the Massachusetts Institute of Technology. With 36 hours of building, workshops, mentoring from industry professionals, and over $50,000 in prizes, this is your chance to bring your wildest ideas to life. Tracks include AI/ML, Fintech, Social Impact, and Hardware.',
    requirements: ['Must be a current undergraduate or graduate student', 'Basic programming experience', 'Team of 1-4 members', 'Must be available for the full 36-hour event'],
    eligibility: 'All undergraduate and graduate students from any university worldwide.',
    deadline: '2026-06-01',
    stipend: '$50,000+ in prizes',
    location: 'Cambridge, MA (In-person)',
    tags: ['Hackathon', 'Innovation', 'Networking'],
    link: 'https://hackmit.org',
  },
  {
    id: 3,
    title: 'Rhodes Scholarship 2027',
    organization: 'Rhodes Trust, Oxford',
    type: 'scholarship',
    description: 'The world\'s oldest and most prestigious international scholarship, funding postgraduate study at the University of Oxford.',
    fullDescription: 'The Rhodes Scholarship fully funds postgraduate study at the University of Oxford. Established in 1902, it is awarded to outstanding young people worldwide based on academic excellence, character, leadership, and commitment to service. Scholars join a lifelong community of leaders across diverse fields. The scholarship covers all university and college fees, a generous living stipend, and travel costs.',
    requirements: ['Exceptional academic achievement (top of class)', 'Demonstrated leadership and community impact', 'Age 19-25 at time of application', 'Bachelor\'s degree completed before October 2027'],
    eligibility: 'Final-year undergraduates or recent graduates aged 19-25 from eligible countries.',
    deadline: '2026-09-01',
    stipend: 'Full tuition + £18,180/year stipend',
    location: 'Oxford, United Kingdom',
    tags: ['Leadership', 'Academic Excellence', 'Research'],
    link: 'https://www.rhodeshouse.ox.ac.uk',
  },
  {
    id: 4,
    title: 'Software Engineering Intern',
    organization: 'Microsoft',
    type: 'internship',
    description: 'Build products used by millions. Work alongside world-class engineers on Azure, Office, or Windows core teams.',
    fullDescription: 'Microsoft\'s Summer Internship Program offers a 12-week immersive experience where you will contribute real code to products used by billions of people. Intern teams work on meaningful projects in Azure Cloud, Microsoft 365, Windows, Xbox, and more. You\'ll be paired with mentors, attend exclusive events, and experience the culture that makes Microsoft one of the best places to work.',
    requirements: ['Proficiency in at least one programming language (C++, C#, Java, Python, or JavaScript)', 'Data structures and algorithms knowledge', 'Currently enrolled in a BS/MS/PhD in Computer Science or related field', 'Strong problem-solving skills'],
    eligibility: 'Students in their sophomore year or above pursuing a degree in Computer Science, Software Engineering, or related technical field. Minimum CGPA of 7.0.',
    deadline: '2026-05-30',
    stipend: '$8,500/month',
    location: 'Redmond, WA / Hyderabad, India',
    tags: ['Software Engineering', 'Cloud', 'Full Stack'],
    link: 'https://careers.microsoft.com',
  },
  {
    id: 5,
    title: 'CalHacks 12.0',
    organization: 'UC Berkeley',
    type: 'hackathon',
    description: 'The world\'s largest collegiate hackathon. 2,000+ hackers, $100K in prizes, powered by cutting-edge sponsor tech.',
    fullDescription: 'CalHacks 12.0 is returning bigger than ever at UC Berkeley. As the world\'s largest collegiate hackathon, we host 2,000+ hackers for a 36-hour building sprint with access to cutting-edge APIs, hardware, and mentorship from leading tech companies. This year features AI/ML, Climate Tech, Web3, and Health Tech tracks with over $100,000 in prizes.',
    requirements: ['Must be 18+ years old', 'Currently enrolled at an accredited university', 'Individual or team of up to 4', 'Bring your own laptop'],
    eligibility: 'University students worldwide, all skill levels welcome.',
    deadline: '2026-07-15',
    stipend: '$100,000+ in prizes',
    location: 'Berkeley, CA (In-person)',
    tags: ['Hackathon', 'AI/ML', 'Climate Tech'],
    link: 'https://calhacks.io',
  },
  {
    id: 6,
    title: 'Chevening Scholarship',
    organization: 'UK Government',
    type: 'scholarship',
    description: 'UK government\'s global scholarship for future leaders. Fully funded Master\'s at any UK university of your choice.',
    fullDescription: 'Chevening Scholarships are the UK government\'s global scholarship programme, funded by the Foreign, Commonwealth and Development Office. Awards are given to outstanding emerging leaders from around the world to pursue a one-year Master\'s at any UK university. The scholarship covers tuition, a monthly living allowance, travel, and more.',
    requirements: ['Minimum 2 years of work experience', 'Bachelor\'s degree (at least upper second class)', 'Return to home country for minimum 2 years after scholarship', 'Apply to 3 eligible UK university courses'],
    eligibility: 'Citizens of Chevening-eligible countries with at least 2 years of professional experience and a strong academic record.',
    deadline: '2026-11-01',
    stipend: 'Full tuition + £1,300/month + travel',
    location: 'Any UK University',
    tags: ['Leadership', 'International', 'Policy'],
    link: 'https://www.chevening.org',
  },
  {
    id: 7,
    title: 'Product Design Intern',
    organization: 'Figma',
    type: 'internship',
    description: 'Design the future of collaborative design tools. Work with the team building the platform designers love worldwide.',
    fullDescription: 'Figma is hiring Product Design Interns for a 12-week summer program. You\'ll work embedded in a product team, shipping features that impact millions of designers and developers. From concept to hi-fi to shipped product, you\'ll own your project end to end, with guidance from senior designers and cross-functional partners.',
    requirements: ['Strong portfolio demonstrating product thinking', 'Proficiency in Figma (of course!)', 'Understanding of design systems and component-based design', 'Currently pursuing a degree in Design, HCI, or related field'],
    eligibility: 'Students in their junior year or above studying Design, Human-Computer Interaction, or related fields.',
    deadline: '2026-04-30',
    stipend: '$8,000/month',
    location: 'San Francisco, CA',
    tags: ['Design', 'UX/UI', 'Product'],
    link: 'https://www.figma.com/careers',
  },
  {
    id: 8,
    title: 'Smart India Hackathon 2026',
    organization: 'Government of India',
    type: 'hackathon',
    description: 'India\'s largest national hackathon with real government problem statements. Build solutions that impact 1.4 billion people.',
    fullDescription: 'Smart India Hackathon (SIH) is a nationwide initiative to provide students with a platform to solve pressing problems of government departments, industries, and organizations. SIH 2026 features both software and hardware editions with 200+ problem statements across domains like healthcare, education, agriculture, and smart cities.',
    requirements: ['Team of 6 members with a mentor', 'Currently enrolled in any Indian educational institution', 'Must select and solve an assigned problem statement', 'Preliminary round submission required'],
    eligibility: 'All students enrolled in recognized Indian educational institutions.',
    deadline: '2026-06-30',
    stipend: '₹1,00,000 per winning team',
    location: 'Multiple nodal centers across India',
    tags: ['Social Impact', 'Government', 'Innovation'],
    link: 'https://sih.gov.in',
  },
  {
    id: 9,
    title: 'Data Science Intern',
    organization: 'Netflix',
    type: 'internship',
    description: 'Use data to shape entertainment for 250M+ subscribers. Work on recommendation systems and content analytics.',
    fullDescription: 'Netflix\'s Data Science internship places you at the intersection of entertainment and cutting-edge analytics. You\'ll work on projects that directly impact what 250+ million subscribers watch. Areas include recommendation algorithms, A/B testing frameworks, content valuation models, and streaming quality optimization.',
    requirements: ['Strong proficiency in Python and SQL', 'Experience with statistical modeling and machine learning', 'Knowledge of A/B testing methodologies', 'Pursuing a degree in Statistics, Data Science, CS, or related field'],
    eligibility: 'Graduate students (Masters or PhD) in Statistics, Data Science, Computer Science, or related quantitative fields. Minimum CGPA 8.5.',
    deadline: '2026-05-20',
    stipend: '$10,000/month',
    location: 'Los Gatos, CA',
    tags: ['Data Science', 'AI/ML', 'Analytics'],
    link: 'https://jobs.netflix.com',
  },
  {
    id: 10,
    title: 'DAAD WISE Scholarship',
    organization: 'DAAD Germany',
    type: 'scholarship',
    description: 'Research internship scholarship at top German universities. Fully funded summer research experience in Germany.',
    fullDescription: 'The DAAD Working Internships in Science and Engineering (WISE) program offers Indian students the opportunity to carry out research internships at top German universities and research institutions. The scholarship covers monthly stipend, travel costs, and health insurance for 8-12 weeks during the summer.',
    requirements: ['Enrolled in Bachelor\'s or Master\'s program (STEM fields)', 'Minimum CGPA of 8.0/10', 'Secured a supervisor at a German university', 'Strong academic record with relevant research experience'],
    eligibility: 'Indian students enrolled in B.Tech/M.Tech/MS programs in STEM fields at recognized Indian institutions.',
    deadline: '2026-11-15',
    stipend: '€1,200/month + travel',
    location: 'Various German Universities',
    tags: ['Research', 'International', 'STEM'],
    link: 'https://www.daad.de',
  },
  {
    id: 11,
    title: 'Backend Engineering Intern',
    organization: 'Stripe',
    type: 'internship',
    description: 'Build financial infrastructure powering the internet economy. Write code that moves billions of dollars.',
    fullDescription: 'Stripe\'s engineering internship is a chance to build the economic infrastructure for the internet. You\'ll write code that processes billions in transactions, design APIs used by millions of developers, and work with a team obsessed with developer experience. Projects span payments, fraud detection, billing infrastructure, and more.',
    requirements: ['Strong CS fundamentals (algorithms, data structures, systems)', 'Proficiency in Ruby, Java, Go, or Python', 'Interest in financial systems and payments', 'Pursuing a BS/MS in Computer Science or related field'],
    eligibility: 'Undergrad and graduate students in Computer Science or Engineering. Open to all years.',
    deadline: '2026-06-15',
    stipend: '$9,000/month',
    location: 'San Francisco, CA / Seattle, WA',
    tags: ['Backend', 'Fintech', 'Systems'],
    link: 'https://stripe.com/jobs',
  },
  {
    id: 12,
    title: 'ETHGlobal New York',
    organization: 'ETHGlobal',
    type: 'hackathon',
    description: 'The ultimate Web3 hackathon experience. Build decentralized applications with mentorship from Ethereum core contributors.',
    fullDescription: 'ETHGlobal New York is a 36-hour in-person hackathon bringing together the best minds in Web3. Build decentralized apps, connect with Ethereum core developers, and compete for $150,000+ in prizes. Workshops cover Solidity, smart contract security, DeFi protocols, and NFT infrastructure.',
    requirements: ['Basic understanding of blockchain concepts', 'Programming experience in any language', 'Interest in decentralized technologies', 'Individual or team of up to 4'],
    eligibility: 'Open to anyone 18+ with programming experience. No blockchain experience required.',
    deadline: '2026-08-01',
    stipend: '$150,000+ in prizes',
    location: 'New York City, NY',
    tags: ['Web3', 'Blockchain', 'DeFi'],
    link: 'https://ethglobal.com',
  },
  {
    id: 13,
    title: 'Fulbright-Nehru Fellowship',
    organization: 'USIEF',
    type: 'scholarship',
    description: 'Prestigious US-India academic exchange. Fully funded Master\'s or research opportunity at leading American universities.',
    fullDescription: 'The Fulbright-Nehru Master\'s Fellowships are for outstanding Indians who wish to pursue a master\'s degree at select US universities. The fellowship covers tuition, living expenses, airfare, and provides a generous stipend. Candidates are selected based on academic excellence, leadership potential, and commitment to community.',
    requirements: ['Bachelor\'s degree with a minimum of 55% marks', 'At least 3 years of professional work experience', 'TOEFL score requirement', 'Must return to India after completion'],
    eligibility: 'Indian citizens with a bachelor\'s degree and minimum 3 years of work experience in relevant field.',
    deadline: '2026-06-15',
    stipend: 'Full tuition + $2,400/month + travel',
    location: 'Select US Universities',
    tags: ['Academic', 'International', 'Research'],
    link: 'https://www.usief.org.in',
  },
  {
    id: 14,
    title: 'Cloud Engineering Intern',
    organization: 'Amazon Web Services',
    type: 'internship',
    description: 'Build, scale, and operate the world\'s largest cloud platform. Projects span infrastructure, serverless, and DevOps.',
    fullDescription: 'AWS internships offer hands-on experience building services that power millions of businesses worldwide. Work on distributed systems, cloud infrastructure, serverless computing, or developer tools. You\'ll own a project from ideation through deployment and present to senior leadership.',
    requirements: ['Experience with cloud computing concepts', 'Proficiency in at least one programming language', 'Understanding of distributed systems', 'Currently pursuing a BS/MS in CS, CE, or related field'],
    eligibility: 'Undergraduate and graduate students in Computer Science, Computer Engineering, or related technical fields.',
    deadline: '2026-05-30',
    stipend: '$8,800/month',
    location: 'Seattle, WA / Bangalore, India',
    tags: ['Cloud', 'DevOps', 'Distributed Systems'],
    link: 'https://aws.amazon.com/careers',
  },
  {
    id: 15,
    title: 'TreeHacks 2026',
    organization: 'Stanford University',
    type: 'hackathon',
    description: 'Stanford\'s premier hackathon focused on health, sustainability, and social good. 36 hours to hack for a better world.',
    fullDescription: 'TreeHacks is Stanford University\'s annual hackathon dedicated to making a positive impact. With tracks in Healthcare, Sustainability, Education, and New Frontiers, 1,500+ hackers build projects that tackle the world\'s most pressing challenges. Enjoy mentorship from Stanford faculty, workshops, and over $50,000 in prizes.',
    requirements: ['Must be a current university student', 'Passion for social impact', 'Team of up to 4 members', 'Any skill level welcome'],
    eligibility: 'University students worldwide. All experience levels welcome.',
    deadline: '2026-07-01',
    stipend: '$50,000+ in prizes',
    location: 'Stanford, CA (In-person)',
    tags: ['Social Impact', 'Health', 'Sustainability'],
    link: 'https://treehacks.com',
  },
  {
    id: 16,
    title: 'Cybersecurity Analyst Intern',
    organization: 'CrowdStrike',
    type: 'internship',
    description: 'Defend enterprises against nation-state attacks. Build threat detection systems protecting Fortune 500 companies.',
    fullDescription: 'CrowdStrike\'s Cybersecurity Internship provides hands-on experience in threat intelligence, malware analysis, and incident response. Work alongside world-class security researchers to develop detection algorithms and analyze emerging threats from advanced persistent threat (APT) groups.',
    requirements: ['Knowledge of networking protocols and operating systems', 'Familiarity with cybersecurity frameworks (MITRE ATT&CK)', 'Experience with Python scripting', 'Pursuing a degree in Cybersecurity, CS, or related field'],
    eligibility: 'Students pursuing degrees in Cybersecurity, Computer Science, or Information Security.',
    deadline: '2026-06-01',
    stipend: '$7,500/month',
    location: 'Austin, TX / Remote',
    tags: ['Cybersecurity', 'Threat Intelligence', 'Security'],
    link: 'https://www.crowdstrike.com/careers',
  },
  {
    id: 17,
    title: 'Aga Khan Foundation Scholarship',
    organization: 'Aga Khan Foundation',
    type: 'scholarship',
    description: 'Need-based scholarship for exceptional students from developing countries to pursue postgraduate studies at top universities.',
    fullDescription: 'The Aga Khan Foundation provides a limited number of scholarships each year for postgraduate studies to outstanding students from developing countries who have no other means of financing their studies. Scholarships are given as 50% grant and 50% loan through a revolving fund. Applications are accepted for Master\'s-level courses at reputable institutions.',
    requirements: ['Outstanding academic record', 'Demonstrated financial need', 'Admission to a reputed university', 'Commitment to return to home country'],
    eligibility: 'Nationals from select developing countries with admission to a top university for postgraduate studies.',
    deadline: '2026-03-31',
    stipend: '50% grant + 50% interest-free loan',
    location: 'Universities worldwide',
    tags: ['Need-based', 'International', 'Postgraduate'],
    link: 'https://www.akdn.org',
  },
  {
    id: 18,
    title: 'Frontend Engineering Intern',
    organization: 'Vercel',
    type: 'internship',
    description: 'Shape the future of the web. Build tools used by millions of developers deploying on the modern web platform.',
    fullDescription: 'Vercel powers the frontend for the world\'s leading companies. As a Frontend Engineering Intern, you\'ll work on Next.js, Turbopack, or the Vercel platform itself. You\'ll ship real features, contribute to open-source projects, and work with a team building the infrastructure for the modern web.',
    requirements: ['Strong proficiency in React and TypeScript', 'Understanding of Next.js and modern web architecture', 'Open source contributions are a plus', 'Pursuing a degree in CS, Software Engineering, or self-taught equivalent'],
    eligibility: 'Students or self-taught developers with strong React/TypeScript skills.',
    deadline: '2026-05-15',
    stipend: '$8,500/month',
    location: 'Remote (US-based)',
    tags: ['Frontend', 'React', 'Open Source'],
    link: 'https://vercel.com/careers',
  },
];

/**
 * Compute a personalized match score based on user profile.
 * This uses a simple deterministic algorithm based on tag overlap,
 * year appropriateness, and CGPA thresholds.
 */
export function computeMatchScore(opportunity, profile) {
  if (!profile || !profile.major) return Math.floor(Math.random() * 40) + 30;

  let score = 50; // Base score

  // Interest match — compare tags with user interests
  const userInterests = (profile.interests || []).map(i => i.toLowerCase());
  const oppTags = (opportunity.tags || []).map(t => t.toLowerCase());

  const matchedTags = oppTags.filter(tag =>
    userInterests.some(interest =>
      tag.includes(interest.toLowerCase()) || interest.toLowerCase().includes(tag)
    )
  );

  score += matchedTags.length * 12;

  // Major relevance bonus
  const majorLower = (profile.major || '').toLowerCase();
  const techMajors = ['computer science', 'software engineering', 'data science', 'ai', 'machine learning', 'information technology', 'ece', 'electrical'];
  const designMajors = ['design', 'hci', 'human-computer interaction', 'graphic design', 'ux'];

  if (techMajors.some(m => majorLower.includes(m))) {
    if (opportunity.type === 'internship' && oppTags.some(t => ['ai/ml', 'software engineering', 'backend', 'frontend', 'cloud', 'data science', 'cybersecurity'].includes(t.toLowerCase()))) {
      score += 10;
    }
  }
  if (designMajors.some(m => majorLower.includes(m))) {
    if (oppTags.some(t => ['design', 'ux/ui', 'product'].includes(t.toLowerCase()))) {
      score += 15;
    }
  }

  // Year appropriateness
  const year = (profile.year || '').toLowerCase();
  if (opportunity.type === 'internship') {
    if (year === 'junior' || year === 'senior') score += 8;
    else if (year === 'sophomore') score += 4;
  } else if (opportunity.type === 'scholarship') {
    if (year === 'senior') score += 10;
    else if (year === 'junior') score += 5;
  }

  // Location matching — boost if state or county matches
  const profileState = (profile.state || '').toLowerCase();
  const profileCounty = (profile.county || '').toLowerCase();
  const oppLocation = (opportunity.location || '').toLowerCase();

  if (profileState && oppLocation.includes(profileState)) {
    score += 15; // Major boost for state match
  }
  if (profileCounty && oppLocation.includes(profileCounty)) {
    score += 10; // Extra boost for county match
  }

  // College matching — boost if organization or tags relate to user's college
  const profileCollege = (profile.college || '').toLowerCase();
  const orgName = (opportunity.organization || '').toLowerCase();
  
  if (profileCollege && (orgName.includes(profileCollege) || oppLocation.includes(profileCollege))) {
    score += 15;
  }

  // Add some variety with a deterministic offset based on opportunity ID
  score += (opportunity.id * 7) % 11;

  // Clamp between 35 and 99
  return Math.min(99, Math.max(35, score));
}

/**
 * Get all opportunities with computed match scores.
 */
export function getOpportunities(profile) {
  return rawOpportunities
    .map(opp => ({
      ...opp,
      matchScore: computeMatchScore(opp, profile),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Get a single opportunity by ID.
 */
export function getOpportunityById(id, profile) {
  const opp = rawOpportunities.find(o => o.id === parseInt(id));
  if (!opp) return null;
  return {
    ...opp,
    matchScore: computeMatchScore(opp, profile),
  };
}
