export const languages = [
  { id: 'en', label: 'English', nativeLabel: 'English', icon: 'A' },
  { id: 'hi', label: 'Hindi', nativeLabel: 'Hindi', icon: 'HI' },
  { id: 'ta', label: 'Tamil', nativeLabel: 'Tamil', icon: 'TA' },
];

export const dashboardStats = [
  { value: '06', label: 'Citizen modules' },
  { value: '03', label: 'Languages primed' },
  { value: 'Voice', label: 'Ready placeholders' },
];

export const quickActions = [
  'Can I file an FIR for repeated noise nuisance?',
  'How do I access free legal aid?',
  'Create a landlord complaint draft',
  'What documents do I need for a police complaint?',
];

export const featureCards = [
  {
    title: 'Multilingual Support',
    icon: 'ML',
    color: 'mint',
    description:
      'Switch across English, Hindi, and Tamil while keeping legal guidance understandable and context-aware.',
  },
  {
    title: 'Voice Interaction',
    icon: 'VC',
    color: 'blue',
    description:
      'Prepared for speech-to-text input and spoken responses so legal help remains accessible to low-literacy users.',
  },
  {
    title: 'Simple Explanations',
    icon: 'SP',
    color: 'green',
    description:
      'Complex procedures are translated into clear steps, plain language, and actionable next moves.',
  },
];

export const legalCategories = [
  {
    id: 'fir',
    short: 'FIR',
    title: 'FIR and Police Complaints',
    badge: 'High priority',
    description: 'Understand whether your issue needs an FIR, NCR, or simple complaint process.',
    longDescription:
      'This module helps users understand complaint types, identify whether the issue is cognizable, prepare facts and documents, and decide how to approach police authorities.',
    prompts: [
      'Explain the FIR process step by step',
      'When should I file an NCR instead of an FIR?',
      'Help me prepare a complaint summary for the police',
    ],
    steps: [
      {
        title: 'Classify the issue',
        body: 'Identify whether the issue is urgent, criminal, civil, or non-cognizable.',
      },
      {
        title: 'Collect evidence',
        body: 'Gather incident details, date/time, witness notes, IDs, and supporting media if available.',
      },
      {
        title: 'Take the right route',
        body: 'Choose FIR, NCR, written complaint, helpline, or escalation based on the incident type.',
      },
    ],
  },
  {
    id: 'aid',
    short: 'AID',
    title: 'Legal Aid Access',
    badge: 'Support',
    description: 'Discover eligibility, local services, and what to prepare before asking for free legal aid.',
    longDescription:
      'This module walks users through legal aid eligibility, documentation, authority contact points, and how to explain their issue clearly when asking for assistance.',
    prompts: [
      'Who is eligible for free legal aid?',
      'What documents should I carry for legal aid?',
      'Find a legal aid preparation checklist',
    ],
    steps: [
      {
        title: 'Check eligibility',
        body: 'Review whether the user falls under income, gender, disability, or social category support.',
      },
      {
        title: 'Prepare background',
        body: 'Summarize the issue, collect notices, identity proof, and any prior complaint records.',
      },
      {
        title: 'Request support',
        body: 'Route to district legal services authority and prepare a short intake summary.',
      },
    ],
  },
  {
    id: 'tenant',
    short: 'TEN',
    title: 'Tenant Rights and Disputes',
    badge: 'Housing',
    description: 'Review rent, deposit, eviction, notice, and maintenance dispute guidance.',
    longDescription:
      'This module is focused on tenant-landlord friction, including deposits, lockouts, utility pressure, eviction attempts, and notice handling.',
    prompts: [
      'Can my landlord force me out without notice?',
      'How do I ask for my deposit back?',
      'Help me draft a tenant complaint message',
    ],
    steps: [
      {
        title: 'Review agreement terms',
        body: 'Check rent agreement language, notice periods, and documented maintenance obligations.',
      },
      {
        title: 'Document the dispute',
        body: 'Capture payment proof, message history, inspection notes, and threat patterns.',
      },
      {
        title: 'Escalate appropriately',
        body: 'Move toward a written notice, mediation, complaint, or local legal support if needed.',
      },
    ],
  },
  {
    id: 'traffic',
    short: 'TRF',
    title: 'Traffic Challan Disputes',
    badge: 'Mobility',
    description: 'Understand challan notices, dispute steps, and what to verify before paying or contesting.',
    longDescription:
      'This module guides users through checking traffic challan details, identifying errors, preparing evidence, and understanding contest pathways.',
    prompts: [
      'How do I dispute an incorrect traffic challan?',
      'What proof should I collect before contesting a challan?',
      'Show me the online challenge process',
    ],
    steps: [
      {
        title: 'Verify notice details',
        body: 'Check location, vehicle details, violation code, and notice timing carefully.',
      },
      {
        title: 'Gather evidence',
        body: 'Collect location proof, payment records, photos, or dashcam evidence if available.',
      },
      {
        title: 'Contest or resolve',
        body: 'Choose whether to pay, appeal online, or escalate through the prescribed authority.',
      },
    ],
  },
];

export const guidedFlows = [
  {
    id: 'fir-flow',
    short: 'F1',
    title: 'FIR Filing Flow',
    summary: 'A step-by-step complaint journey that moves from incident understanding to filing readiness.',
    checklist: [
      'Capture what happened, where, and when',
      'Determine whether the issue appears cognizable',
      'Prepare IDs, evidence, and witness details',
      'Draft a clear police complaint summary',
    ],
    outputs: [
      'Incident summary card',
      'Issue classification decision',
      'Document checklist',
      'Ready-to-submit complaint draft',
    ],
  },
  {
    id: 'aid-flow',
    short: 'L2',
    title: 'Legal Aid Intake Flow',
    summary: 'A guided intake system for users seeking low-cost or free legal support.',
    checklist: [
      'Check legal aid eligibility',
      'List important documents and notices',
      'Prepare a short issue timeline',
      'Surface the right service point for handoff',
    ],
    outputs: [
      'Eligibility note',
      'Document preparation card',
      'Timeline summary',
      'Referral handoff card',
    ],
  },
  {
    id: 'tenant-flow',
    short: 'T3',
    title: 'Tenant Dispute Flow',
    summary: 'A housing-focused process for notices, deposits, maintenance, and eviction pressure.',
    checklist: [
      'Review the rent agreement',
      'Document payments and communication',
      'Prepare a written tenant notice',
      'Escalate to mediation or legal help if needed',
    ],
    outputs: [
      'Agreement review prompt',
      'Evidence tracker',
      'Tenant notice draft',
      'Escalation options panel',
    ],
  },
];

export const legalResources = [
  {
    title: 'Emergency Response',
    description: 'Police helpline, women helpline, and emergency numbers with fast escalation guidance.',
    tag: 'Priority',
  },
  {
    title: 'Citizen Rights Primer',
    description: 'Plain-language summary of arrest rights, complaint rights, and procedural awareness.',
    tag: 'Guide',
  },
  {
    title: 'Complaint Templates',
    description: 'Starter structures for nuisance complaints, deposit disputes, and legal aid requests.',
    tag: 'Template',
  },
];

export const historyItems = [
  { id: 1, title: 'FIR Process', subtitle: 'Noise complaint and NCR guidance', time: 'Today, 10:46 AM' },
  { id: 2, title: 'Tenant Lease Help', subtitle: 'Deposit dispute and written notice', time: 'Yesterday, 7:15 PM' },
  { id: 3, title: 'Traffic Challan Dispute', subtitle: 'Appeal options and document checks', time: 'Apr 27, 4:20 PM' },
];

export const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    text:
      'Namaste. I am NyayaSetu AI, your legal guide. Tell me your issue and I will break the process into simple, practical next steps.',
    chips: ['What is a cognizable offence?', 'Help me file a police complaint'],
    timestamp: '10:42 AM',
  },
  {
    id: 2,
    role: 'user',
    text:
      'My neighbor is playing extremely loud music late at night despite requests to stop. Can I file an FIR for this?',
    timestamp: '10:45 AM',
  },
  {
    id: 3,
    role: 'assistant',
    text:
      'This may justify a police complaint, but it is often handled first as a non-cognizable or nuisance issue. Start with immediate complaint channels, document repeated incidents, and escalate with a written complaint if it continues.',
    timestamp: '10:46 AM',
    highlight: {
      title: 'Recommended Steps',
      items: [
        'Call 112 while the nuisance is happening if the disturbance is severe.',
        'Record dates, times, and witnesses for repeated incidents.',
        'Submit a written complaint to the Station House Officer if the issue continues.',
      ],
    },
  },
];

export const sidebarItems = [
  { id: 'home', label: 'Home Dashboard', icon: 'HM' },
  { id: 'auth', label: 'Auth', icon: 'AU' },
  { id: 'categories', label: 'Legal Categories', icon: 'LC' },
  { id: 'flows', label: 'Guided Flows', icon: 'GF' },
  { id: 'assistant', label: 'Assistant', icon: 'AI' },
  { id: 'resources', label: 'Legal Resources', icon: 'LR' },
  { id: 'history', label: 'History', icon: 'HS' },
  { id: 'settings', label: 'Settings', icon: 'ST' },
];

export const settingsSections = [
  { title: 'AI Tone', value: 'Empathetic clarity' },
  { title: 'Voice Responses', value: 'Prepared for integration' },
  { title: 'Escalation Mode', value: 'Human lawyer handoff placeholder' },
];
