export const mailMonetizationEn = {
  metaItems: [
    { value: 'Mail Cloud, Mail, Mail Space' },
    { value: '2025 — present' },
    { value: 'Product designer' },
  ],
  context:
    'Mail products run on freemium with a large free audience and limited paid conversion.\nCore business tension:\nusers hit free-tier limits\ndo not convert to paid\nor work around limits (multi-account usage)\n→ that capped LTV and revenue growth.',
  problem:
    'At the start it was unclear whether:\nusers do not see subscription value\nor the purchase path does not fit real tasks\nor pricing tiers miss key segments\n\nAdditionally:\nrevenue leaked to multi-account usage\nfreemium features did not drive upsell',
  task:
    'Grow revenue:\nimprove core user journeys\nship product features that encourage subscription\nadd features that trigger upgrades\nevolve the freemium model',
  solution:
    'Rather than one-off tweaks, I built a systemic monetization approach:\nEmbed upsell in key user journeys\nMake limits transparent and understandable\nUse features as proof of subscription value',
  influence:
    'LTV grew by tens of millions of rubles\nrevenue leakage dropped significantly\nthe work became a core monetization driver',
  metrics:
    'User LTV, subscription purchase conversion, simpler path to buying a plan\nperceived value of paid features\nfreemium model: trial uptake, feature adoption\nretention, incremental revenue',
  topCards: [
    {
      value:
        'Mail products run on freemium with a large free audience and limited paid conversion.\nCore business tension:\nusers hit free-tier limits\ndo not convert to paid\nor work around limits (multi-account usage)\n→ that capped LTV and revenue growth.',
    },
    {
      value:
        'At the start it was unclear whether:\nusers do not see subscription value\nor the purchase path does not fit real tasks\nor pricing tiers miss key segments\n\nAdditionally:\nrevenue leaked to multi-account usage\nfreemium features did not drive upsell',
    },
    {
      value:
        'Grow revenue:\nimprove core user journeys\nship product features that encourage subscription\nadd features that trigger upgrades\nevolve the freemium model',
    },
    {
      value:
        'User LTV, subscription purchase conversion, simpler path to buying a plan\nperceived value of paid features\nfreemium model: trial uptake, feature adoption\nretention, incremental revenue',
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
          text: 'If monetization touchpoints sit inside core journeys,\nconversion to subscription should rise',
          outcome: '↑ checkout-to-paid and LTV',
        },
        {
          text: 'If we clearly communicate plan limits, misuse drops and upsell improves',
          outcome: 'Expected: higher LTV',
        },
        {
          text: 'If pricing maps to real user scenarios,\nthe paying audience expands',
          outcome: '↑ conversion and revenue',
        },
      ],
    },
    {
      title: 'A tailored plan\nfor work',
      description:
        'For Mail Space’s “work” tier, the goal was to grow paid users with a segment that did not fit existing plans. I designed the new tier and integrated it into the landing, reworked comparison, and added micro-motion. It opened a new monetization segment and delivered +NDA million ₽ LTV.',
      tasksHeading: 'Pain points for the work tier:',
      pillsLabel: 'Audience pain points',
      tasks: [
        'not ready for heavy enterprise UX',
        'bumping into base-plan limits',
        'high monetization potential',
      ],
      blockCards: {
        task:
          'Cover the “work” segment: launch the new Mail Space tier in product and landing without breaking the existing lineup',
        solution:
          'I designed the new tier UI and embedded it into the landing structure.\nDelivered:\nnew tier presentation for web and touch\nmicro-animations for faster scanning',
        influence: 'The experiment showed a strong business outcome:\ntens of millions of ₽ additional LTV over 12 months',
        metrics: '+10.8 million ₽ additional LTV over 12 months',
      },
    },
    {
      title: 'Trade-off',
      description: 'We avoided heavy enterprise UX → kept purchase flows simple and fast.',
    },
    {
      title: 'Limiting multi-account usage',
      description:
        'A flagship case was limiting multi-person use of one plan. The hypothesis: transparent explanation plus an alternative plan offer would lift upgrade conversion. I replaced a generic modal with a blocking screen that explains the limit and embeds upsell—clarity for users and stronger business metrics (+NDA million ₽ LTV).\n\nI chose a blocking flow over a soft warning because soft limits did not curb abuse.\n\nTrade-offs\nhard limits → risk of backlash\nfrequent upsell → annoyance risk\nnew tiers → cannibalization risk',
      blockCards: {
        task: 'Stop revenue loss from multiple people sharing one plan',
        solution: 'blocking screen on mail sign-in\nexplains why the limit exists\noffers a relevant plan',
        influence: 'The experiment succeeded',
        metrics: 'LTV, ARPPU, churn',
      },
    },
    {
      title: 'Why it worked',
      description: 'User frustration becomes a clear choice → upgrade.',
    },
    {
      title: 'Upsell inside core journeys',
      description:
        'Hypothesis: embedding upsell directly in user journeys lifts conversion. I placed subscription prompts inside key Mail flows and unified UX across platforms—simpler path to purchase and +7 million ₽ LTV.',
      blockCards: {
        task: 'Move upsell to the moment users already feel the need for paid features',
        solution:
          'Moved upsell to the moment of need\nembedded prompts across Mail and Cloud flows\nunified web / iOS / Android UX\naligned copy and UI patterns',
        influence:
          'It worked because users were already in-task → lower friction to purchase',
        metrics: 'CR into business plan purchase, LTV',
      },
    },
    {
      title: 'Freemium feature: AI photo enhancement',
      description:
        'Another track was a freemium ML photo-enhancement feature meant to demonstrate subscription value. I designed a before/after comparison flow and placed it in key product surfaces. Freemium limits nudged free users toward paid. The work lifted conversion, repeat usage, and LTV.',
      blockCards: {
        task:
          'Ship a freemium photo feature that:\n• shows subscription value in the moment of use\n• lifts conversion from free to paid\n• increases repeat usage\n\nAlso:\navoid a harsh paywall that could hurt engagement',
        solution: 'instead of an early paywall—let users see the result first, then offer upgrade',
        influence:
          'the feature became an in-product subscription entry inside freemium flows\nstrengthened perceived value of paid capabilities\nraised engagement and usage frequency\ncontributed to LTV through in-product journeys, not external promo alone',
        metrics:
          'first-use activation, repeat feature usage, double-digit lift in trial/pay conversion from the flow, positive LTV movement for cohorts that engaged with the feature',
      },
    },
    {
      title: 'Results',
      pillsLabel: 'Summary',
      tasks: [
        'LTV grew by tens of millions of rubles',
        'revenue leakage dropped significantly',
        'the program became a core monetization driver',
      ],
      pillsFootnote: '*Metrics are summarized under NDA',
    },
    {
      title: 'My role',
      pillsLabel: 'Responsibilities',
      tasks: [
        'worked with analytics, PM, and engineering',
        'owned product and UX decisions',
        'shaped scenario-level monetization patterns',
        'initiated and prioritized hypotheses',
        'influenced the monetization roadmap',
      ],
    },
  ],
};
