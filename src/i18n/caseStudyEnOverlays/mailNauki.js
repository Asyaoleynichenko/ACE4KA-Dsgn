export const mailNaukiEn = {
  metaItems: [
    { value: 'Mail Media (editorial, engineering, ads)' },
    { value: 'Oct 16, 2023 — May 20, 2025' },
    {
      value:
        'Product Designer — Mail Science end-to-end, Media UI design system, supporting other vertical redesigns',
    },
  ],
  problem:
    'Historically each media property evolved separately without a shared systemic approach—hurting navigation at scale, support for diverse formats, and effective ad placements.',
  task:
    'Launch Mail Science as a new product and use it as the base architecture to scale across the rest of the media portfolio. Build a scalable design approach for the platform.',
  solution:
    'Media UI widgets and content blocks, native ads inside feed structure, Mail Science as the first vertical to validate hypotheses—then iterative scaling to Hi-Tech Mail, Mail Lady, Mail Cinema, and Mail Pets.',
  influence:
    'A new media product shipped, interfaces unified, the design system expanded; higher card CTR, reading depth, time on site, and ad performance (metrics summarized under NDA).',
  metrics: 'Card CTR · reading depth · time on site · viewability and performance of ad integrations',
  topCards: [
    {
      title: 'Context',
      value:
        'Mail Media is five thematic products (Mail News, Hi-Tech Mail, Mail Lady, Mail Cinema, Mail Pets): editorial, recommendations, and ads. The interface must work at large content volumes, support multiple formats, and embed ads effectively.',
    },
    {
      title: 'Challenge',
      value:
        'Launch Mail Science and establish an architecture that scales to other media products without redesigning from scratch each time.',
    },
    {
      title: 'Outcome',
      value:
        'A new vertical on the platform, expanded Media UI, redesigns for key properties; measurable lift in product and ad metrics (NDA).',
    },
  ],
  caseSections: [
    {
      title: 'Context',
      description:
        'Mail Media is five thematic products: Mail News, Hi-Tech Mail, Mail Lady, Mail Cinema, and Mail Pets. They combine editorial content, recommendation mechanics, and ad integrations.\n\nThe interface must solve three jobs at once:\n• help people navigate large volumes of material\n• support different content formats\n• embed ad placements effectively\n\nHistorically each product evolved separately without a shared systemic approach.',
    },
    {
      title: 'Brief',
      description:
        'Design and launch a new media product—Mail Science—and use it as the base architecture that scales to the rest of the portfolio. Define a scalable design approach applicable across products on the platform.',
    },
    {
      hideTitle: true,
      hypotheses: [
        {
          title: 'H1',
          text: 'Thematic homepage blocks improve navigation and lift card CTR; we expected higher reading depth.',
          outcome:
            'Confirmed: higher homepage card CTR and reading depth (metrics summarized under NDA).',
        },
        {
          title: 'H2',
          text: 'Recommendation and dynamic modules lift engagement and time on site.',
          outcome: 'Confirmed: higher time on site and engagement on product metrics (NDA).',
        },
        {
          title: 'H3',
          text: 'Ads embedded in the content structure deliver better viewability than isolated ad units.',
          outcome: 'Confirmed: better viewability and performance of ad integrations (NDA).',
        },
      ],
    },
    {
      title: '1. Mail Science as a new product (end-to-end)',
      tasksHeading: 'What shipped',
      taskLayout: 'pills',
      tasks: [
        'Partnered with editorial on requirements',
        'Multiple homepage interface concepts',
        'Homepage architecture',
        'Widget system for different editorial content types',
        'Ad and partner blocks natively embedded in the content structure',
        'Responsive layouts for breakpoints',
      ],
      galleryImage: '/images/figma-sync-20260205-mail-nauki-1777996685113/dbcf3dac5b54ac3b4f5867a8f59020fd2f6f5131.png',
    },
    {
      title: '2. Media UI design system',
      description:
        'I added components and design tokens tailored to Mail Science, then made them reusable so patterns could scale to other products without redesigning from scratch—that was the systemic payoff.',
      taskLayout: 'pills',
      tasks: ['Components and tokens for Mail Science', 'Reusable patterns for other verticals'],
      galleryImage: '/images/figma-sync-20260205-mail-nauki-1777996685113/cf98e803597a562a1364e57730730ebaa8cf9c55.png',
    },
    {
      title: '3. Scaling the approach',
      description: 'After Mail Science launched, we applied the approach iteratively, product by product:',
      taskLayout: 'pills',
      tasks: [
        'Hi-Tech Mail: homepage structure and additional ad formats',
        'Mail Lady: homepage structure and ad blocks',
        'Mail Pets: widgets, ad and promo blocks, full-text page improvements',
        'Partnered with engineering through rollout',
      ],
      galleryImages: [
        '/images/figma-sync-20260205-mail-nauki-1777996685113/9404630b674c18da58918ad26aa18f10cd092161.png',
        '/images/figma-sync-20260205-mail-nauki-1777996685113/e076ef97274807b1134b88c0ed26e7eee6fd1429.png',
        '/images/figma-sync-20260205-mail-nauki-1777996685113/ef40cddf2ee53f9fb672ad5d27022a08b0589c21.png',
        '/images/figma-sync-20260205-mail-nauki-1777996685113/b60e28466089ffcf3b2c07f497b0e1828d4cc526.png',
        '/images/figma-sync-20260205-mail-nauki-1777996685113/1f955d3fa6908535d0cebf61abc365f22b278f3c.png',
        '/images/figma-sync-20260205-mail-nauki-1777996685113/efa2a6648cb549303029341d74e937a16ef784b6.png',
      ],
    },
    {
      title: '4. Mail Cinema — a major track',
      description:
        'Site architecture review, new interface concepts, widgets for editorial and recommendation blocks, cast section, user-review mechanic, refreshed video section, responsive versions.',
      taskLayout: 'pills',
      tasks: [
        'Widgets for editorial and recommendation blocks',
        'Cast section and user reviews',
        'Updated video section',
      ],
      galleryImage: '/images/figma-sync-20260205-mail-nauki-1777996685113/72850e55a24457d5e847395b353284c4e766082b.png',
    },
    {
      title: 'Trade-offs',
      description:
        'We traded unique art direction per product for systemic consistency—less vertical individuality, much faster platform evolution.\n\nWe did not redesign all five products at once: Mail Science was the first proof; after launch we scaled iteratively, product by product.',
    },
    {
      title: 'Results',
      description:
        'Product:\n• Mail Science launched\n• approach scaled to Hi-Tech Mail, Mail Lady, Mail Cinema, Mail Pets\n\nSystem:\n• Media UI expanded with new components, tokens, and widgets\n• interfaces unified across media\n• faster evolution—new verticals and redesigns build on shared patterns\n\nBusiness (NDA):\n• higher homepage card CTR\n• higher reading depth and time on site\n• higher viewability and effectiveness of ad integrations',
    },
    {
      title: 'My role',
      taskLayout: 'pills',
      pillsLabel: 'Responsibilities',
      tasks: [
        'Mail Science end-to-end—from concept to release',
        'Media UI design system: components, tokens, widgets',
        'Concepts and architecture for Mail Cinema as a major track',
        'Adapted the approach and supported Hi-Tech Mail, Mail Lady, Mail Pets redesigns',
        'Ongoing work with editorial, engineering, and ads at every stage',
      ],
    },
  ],
};
