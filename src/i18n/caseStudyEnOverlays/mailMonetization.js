export const mailMonetizationEn = {
  metaItems: [
    {
      value:
        'Upsell & offer personalization · Mail Space, Mail, Cloud (PM, analytics, engineering, research)',
    },
    {
      value:
        '2025 — present (from 2026 — a separate team after the org split)',
    },
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
      title: 'Context',
      value:
        'Mail products run on freemium: a large free base and limited paid conversion. The core gap is between the moment a user feels a need and the moment we offer the right plan.',
    },
    {
      title: 'Scope',
      value:
        'Design monetization scenarios, run A/B tests, work with product analytics, and partner with engineering and research.',
    },
    {
      title: 'Team metrics',
      value: 'Subscription purchase conversion · LTV (12 mo) · Retention · ARPPU · Churn rate',
    },
    {
      title: 'Approach',
      value:
        'Systemic, not one-off: contextual upsell at the moment of need, transparent limits inside the journey, product features as proof of subscription value before the paywall.',
    },
  ],
  caseSections: [
    {
      title: 'Approach',
      description: 'Systemic, not one-off:',
      pillsLabel: 'Principles',
      tasks: [
        'Embed upsell at the moment of need (contextual upsell), not hide it in settings',
        'Make limits transparent and part of the journey',
        'Use product features to demonstrate subscription value before the paywall—not as a substitute for it',
      ],
    },
    {
      title: 'Experiment 1 · “Mail Space for work” plan',
      description:
        'Context: Mail Space had no offer for people using mail and cloud for individual work or small teams. They hit base-plan limits but were not ready for heavy B2B solutions.\n\nHypothesis: a dedicated work tier plus thoughtful integration into the existing landing will expand the paid audience.',
      tasksHeading: 'What shipped',
      taskLayout: 'pills',
      tasks: [
        'Designed the new tier UI',
        'Reworked the comparison table for easier scanning',
        'Added micro-interactions on plan cards',
        'Web and touch variants',
        'Partnered with engineering through release',
      ],
      blockCards: {
        influence: 'Positive impact on LTV and conversion (metrics under NDA).',
        metrics:
          'Trade-off: we deliberately avoided complex B2B UX to keep checkout simple. Cannibalization risk with existing tiers was assessed and accepted.',
      },
    },
    {
      title: 'Experiment 2 · Entry points into the work plan (contextual upsell)',
      description:
        'Context: journey analysis showed users hitting limits without understanding the business-tier value; the path to purchase was unclear.\n\nHypothesis: entry points embedded in real user journeys (not in settings) will increase the odds of upgrading to a paid tier.\n\nA/B test: the winning bundle was trial / vanity address / business features.',
      tasksHeading: 'What shipped',
      taskLayout: 'pills',
      tasks: [
        'Unified entry points into the business tier across platforms',
        'Embedded upsell into key Mail features: vanity address, read receipts, send later, undo send, AI compose, style change, thread summarization',
        'Adapted checkouts and modals',
        'Web, iOS, and Android',
        'Aligned copy and UI across platforms',
      ],
      blockCards: {
        influence:
          'Double-digit lift in business-plan purchase conversion; tens of millions of ₽ LTV impact (NDA).',
        metrics:
          'Trade-off: many entry points can annoy users—we balanced the risk through research and A/B.',
      },
    },
    {
      title: 'Experiment 3 · Multi-device account limits',
      description:
        'Context: some users ran one mail account on too many devices at once—against the plan logic and revenue.\n\nImportant nuance: a prior limit experiment underperformed; the hypothesis had to be reframed, not repeated.\n\nNew hypothesis: replacing a soft warning with a blocking screen—clear explanation plus a relevant plan offer—will move business metrics without raising churn.',
      tasksHeading: 'What shipped',
      taskLayout: 'pills',
      tasks: [
        'Designed a blocking screen instead of a standard modal',
        'Framed the limit as communication, not a bare denial',
        'Upsell to a relevant tier inside the screen',
        'Illustration to accelerate release',
        'Partnered with engineering through rollout',
      ],
      blockCards: {
        influence:
          'Significant business impact (NDA). LTV up, ARPPU up, churn not materially worse.',
        metrics:
          'Trade-off: hard limits risk backlash and churn. Soft warnings had already been tested and did not work—choosing the strict path was deliberate for business metrics.',
      },
    },
    {
      title: 'Experiment 4 · AI photo enhancement (freemium)',
      description:
        'Context: growing Mail Cloud freemium required features that demonstrate subscription value on their own.\n\nHypothesis: an ML freemium feature with visible before/after works better as an upsell driver than a blunt paywall.',
      tasksHeading: 'What shipped',
      taskLayout: 'pills',
      tasks: [
        'Designed the mobile photo-enhancement journey',
        'Entry points: Cloud home, gallery, image viewer',
        'Run processing → before/after comparison → upsell inside the flow',
        'Freemium rule: free — 1 enhancement per day; paid — up to 20',
        'Shipped on iOS and Android',
      ],
      blockCards: {
        influence:
          'Higher subscription conversion, repeat usage, positive LTV dynamics for cohorts that engaged (NDA).',
        metrics:
          'Trade-off: we deliberately skipped an early paywall—users should see the result first, then the limit. Otherwise the feature does not prove value.',
      },
    },
    {
      title: 'Overall outcome',
      taskLayout: 'pills',
      pillsLabel: 'Summary',
      tasks: [
        'The experiment program became a core monetization driver',
        'Tens of millions of ₽ incremental LTV over the period (NDA)',
        'Reduced revenue leakage from sharing',
        'Unified upsell UX across web / iOS / Android',
      ],
      pillsFootnote: '*Metrics are summarized under NDA',
    },
    {
      title: 'My role',
      taskLayout: 'pills',
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
