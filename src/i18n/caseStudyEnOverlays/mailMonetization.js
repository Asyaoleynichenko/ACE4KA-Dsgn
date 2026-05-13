export const mailMonetizationEn = {
  metaItems: [
    {
      value:
        'Upsell & offer personalization · Mail Space, Mail, Cloud (PM, analytics, engineering, research)',
    },
    { value: '2025 — present' },
    { value: 'Product Designer (Growth & Monetization)' },
  ],
  context:
    'Mail products run on freemium: a large free base and limited paid conversion. The core gap is between the moment a user feels a need and the moment we offer the right plan.',
  problem:
    'We needed to close that gap systematically—not hide monetization in settings, but embed upsell in real journeys while balancing revenue and user backlash.',
  task:
    'Design monetization scenarios, run A/B tests, work with product analytics, and partner with engineering and research.',
  solution:
    'A systemic playbook:\n• contextual upsell at the moment of need\n• transparent limits embedded in the journey\n• product features as proof of subscription value before the paywall, not instead of it',
  influence:
    'A series of experiments became a core monetization driver: tens of millions of ₽ incremental LTV over the period (NDA), reduced revenue leakage from sharing, unified upsell UX across web / iOS / Android.',
  metrics: 'Subscription purchase conversion · LTV (12 mo) · Retention · ARPPU · Churn rate',
  topCards: [
    {
      value:
        'Mail products run on freemium: a large free base and limited paid conversion. The core gap is between the moment a user feels a need and the moment we offer the right plan.',
    },
    {
      value:
        'We needed to close that gap systematically—not hide monetization in settings, but embed upsell in real journeys while balancing revenue and user backlash.',
    },
    {
      value:
        'Design monetization scenarios, run A/B tests, work with product analytics, and partner with engineering and research.',
    },
    {
      value: 'Subscription purchase conversion · LTV (12 mo) · Retention · ARPPU · Churn rate',
    },
  ],
  caseSections: [
    {
      title: 'Approach',
      description: 'Instead of point fixes, I built a systemic monetization approach:',
      pillsLabel: 'Principles',
      tasks: [
        'Embed upsell in key user journeys',
        'Make limits transparent and understandable',
        'Use features as proof of subscription value',
      ],
      hypotheses: [
        {
          title: 'H1',
          text: 'Monetization touchpoints inside core journeys lift subscription conversion',
          outcome:
            'Confirmed: measurable lift in C2P (conversion to pay) and LTV in winning variants (details under NDA)',
        },
        {
          title: 'H2',
          text: 'Transparent plan limits and clear messaging reduce abuse and drive upsell without churn spikes',
          outcome:
            'Confirmed on multiple tests: LTV and ARPPU up with churn controlled; the strict multi-device flow was chosen after a soft-warning experiment failed',
        },
        {
          title: 'H3',
          text: 'Pricing that maps to real scenarios (including “for work”) expands the paying audience',
          outcome: 'Confirmed: positive impact on LTV and conversion (NDA)',
        },
      ],
    },
    {
      title: 'Experiment 1 · “Mail Space for work” plan',
      description:
        'Mail Space lacked an offer for individuals and small teams using mail and cloud for work—they hit base-plan limits but were not ready for heavy B2B UX. Hypothesis: a dedicated work tier plus landing integration would grow paid users.',
      tasksHeading: 'What shipped',
      pillsLabel: 'Deliverables',
      tasks: [
        'Designed the new tier UI',
        'Reworked the comparison table for scanning',
        'Added micro-interactions on plan cards',
        'Web and touch variants',
        'Partnered with engineering through release',
      ],
      blockCards: {
        task:
          'Cover the “work” segment: launch the new Mail Space tier in product and landing without breaking the lineup',
        solution:
          'I designed the tier UI and embedded it into the landing.\nShipped:\nweb and touch presentations\nmicro-interactions for faster scanning',
        influence: 'Positive impact on LTV and conversion (metrics under NDA).',
        metrics:
          'Trade-off: we deliberately avoided complex B2B UX to keep checkout simple; cannibalization risk was assessed and accepted.',
      },
    },
    {
      title: 'Trade-off',
      description: 'We avoided heavy enterprise UX → kept purchase flows simple and fast.',
    },
    {
      title: 'Experiment 3 · Multi-device limits',
      description:
        'Some accounts used mail on too many devices at once—against the plan logic and revenue. A prior limit experiment underperformed, so we reframed the hypothesis: a blocking screen with a clear “why” plus a relevant upsell beats repeating a soft warning.',
      blockCards: {
        task: 'Stop revenue loss from multi-person / multi-device misuse of one plan',
        solution:
          'blocking sign-in screen\nexplains the limit\noffers a relevant plan\nillustration to accelerate release',
        influence: 'Significant business impact (NDA): LTV and ARPPU up, churn not materially worse.',
        metrics:
          'Trade-off: hard limits risk backlash and churn; soft warnings had already been tested and did not work—choosing the strict path was deliberate.',
      },
    },
    {
      title: 'Why it worked',
      description: 'User frustration becomes a clear choice → upgrade.',
    },
    {
      title: 'Experiment 2 · Contextual upsell',
      description:
        'Users hit limits but did not see the value of the business tier; the path to purchase was unclear. I unified entry points across platforms, embedded upsell into key Mail flows (vanity address, read receipts, send later/undo, AI compose, etc.), aligned checkouts and modals, and synced copy across web, iOS, and Android. An A/B test favored the bundle: trial / vanity address / business features.',
      blockCards: {
        task: 'Move upsell to the moment users already feel the need for paid features',
        solution:
          'Unified entry points into the business tier\nembedded upsell across Mail and Cloud\nweb / iOS / Android UX alignment\naligned copy and UI',
        influence:
          'Double-digit lift in business-plan purchase conversion; tens of millions of ₽ LTV impact (NDA). Trade-off: many entry points can annoy users—we balanced via research and A/B.',
        metrics: 'CR into business plan purchase, LTV',
      },
    },
    {
      title: 'Experiment 4 · AI photo enhancement (freemium)',
      description:
        'Cloud freemium needed features that demonstrate subscription value. Hypothesis: an ML feature with visible before/after works better as an upsell driver than a blunt paywall.',
      blockCards: {
        task:
          'Ship a freemium photo feature that:\n• shows subscription value in the moment of use\n• lifts conversion from free to paid\n• increases repeat usage\n\nAlso:\navoid a harsh paywall that could hurt engagement',
        solution: 'Instead of an early paywall—let users see the result first, then offer upgrade',
        influence:
          'Higher subscription conversion, repeat usage, positive LTV movement for cohorts that engaged (NDA).',
        metrics:
          'Activation, repeat usage, double-digit lift in trial/pay conversion from the flow, LTV dynamics for engaged cohorts',
      },
    },
    {
      title: 'Results',
      pillsLabel: 'Summary',
      tasks: [
        'Tens of millions of ₽ incremental LTV over the period (NDA)',
        'Reduced revenue leakage from sharing',
        'Unified upsell UX across web / iOS / Android',
        'The experiment program became a core monetization driver',
      ],
      pillsFootnote: '*Metrics are summarized under NDA',
    },
    {
      title: 'My role',
      pillsLabel: 'Responsibilities',
      tasks: [
        'End-to-end monetization scenario design',
        'A/B experiments with PM and analytics',
        'Initiated and prioritized product hypotheses',
        'Influenced the team roadmap',
        'Data-driven decisions at the journey level—not one-off UI tweaks',
      ],
    },
  ],
};
