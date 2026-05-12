export const dropEn = {
  metaItems: [
    { value: 'HSE thesis project' },
    { value: '2024–2025' },
    { value: 'End-to-end concept and MVP' },
  ],
  context:
    'DROP is a digital service for city networking: people leave anonymous notes pinned to real places. Notes can be text, voice, or a small 3D object tied to a location. Anyone nearby can discover, react, or start a conversation—adding a digital layer where physical spots anchor unexpected social interactions.',
  problem:
    'The concept tackles social distance in large cities. Despite density, starting a conversation with strangers is hard, which limits new social and professional ties. DROP treats the city as infrastructure for spontaneous networking—users leave digital “traces” in meaningful places, and others discover them for lightweight interaction.',
  task:
    'Explore how to lower the communication barrier and help people build new social and professional ties in a more natural, low-pressure format.',
  solution:
    'I designed a location-based concept where anonymous digital notes live in real places and become a channel for interaction. A Telegram MVP validated the hypotheses.',
  influence:
    'The MVP confirmed that users respond to a more informal, anonymous networking format. Communication without status pressure felt more natural and lowered the barrier to start talking.',
  metrics: 'Action, CTR, engagement, and retention',
  topCards: [
    {
      value:
        'Explore how to lower the communication barrier and help people build new social and professional ties in a more natural, low-pressure format.',
    },
    {
      value:
        'I designed a location-based concept where anonymous digital notes live in real places and become a channel for interaction. A Telegram MVP validated the hypotheses.',
    },
    {
      value:
        'The MVP confirmed that users respond to a more informal, anonymous networking format. Communication without status pressure felt more natural and lowered the barrier to start talking.',
    },
    { value: 'Action, CTR, engagement, and retention' },
  ],
  caseSections: [
    {
      title: 'Context',
      description:
        'DROP is a digital service for city networking: people leave anonymous notes pinned to real places. Notes can be text, voice, or a small 3D object tied to a location. Anyone nearby can discover, react, or start a conversation—adding a digital layer where physical spots anchor unexpected social interactions.',
    },
    {
      title: 'Within the project:',
      tasks: [
        'Defined the visual concept',
        'Owned visual production',
        'Designed navigation between materials',
        'Structured the landing:',
        'Partnered with editorial:',
        'Partnered with engineering:',
        'Adapted content for the landing',
        'Supported implementation:',
        'delivered layouts',
        'guarded visual quality',
      ],
    },
    {
      title: 'Hypotheses',
      hypotheses: [
        {
          text: 'If we remove identity pressure (name, job, looks) and make chat anonymous, it is easier to start contact',
          outcome: '↑ started conversations',
        },
        {
          text: 'If interaction is built around interests and context (message, place, topic) rather than profiles, reply rates rise',
          outcome: '↑ reply conversion',
        },
        {
          text: 'Asynchronous chat (no need to answer immediately) lowers social pressure and lifts engagement',
          outcome: '↑ D1 / D7 retention',
        },
        {
          text: 'Pinning content to physical places boosts curiosity and exploratory behavior',
          outcome: '↑ time in product',
        },
        {
          text: 'Soft networking can still lead to real ties—even without explicit career positioning',
          outcome: '↓ drop-off at first step',
        },
        {
          text: 'If users can create content (notes, events, initiatives), community forms',
          outcome: '↑ active users',
        },
      ],
    },
    {
      description:
        'The concept tackles social distance in large cities. Despite density, starting a conversation with strangers is hard, which limits new social and professional ties. DROP treats the city as infrastructure for spontaneous networking—users leave digital “traces” in meaningful places, and others discover them for lightweight interaction.',
    },
    {
      title: 'Solution',
      description:
        'I modeled location-based communication that turns the city map into a space of messages and micro-dialogues. The core journey: create a note, pin it, discover nearby notes, and grow conversations. The app centers a city map to explore stories from other people.',
    },
    {
      title: 'Scaling',
      description:
        'The concept assumes growth through accumulated user content in locations. At scale, an average user might leave 2–4 notes per month, while active spots could hold 20–50 messages. Interaction rates could reach ~30–40% of users reacting to discovered notes or starting chats. Spatial discovery should drive engagement: ~50% of users may regularly scan the map for new notes.\n\nFor networking, 15–20% of interactions could continue on-platform or elsewhere. Hotspots with many messages could lift return visits by 25–35%.\n\nDROP proposes a model where physical space becomes a medium for digital interaction, and spontaneous notes seed real social ties.',
    },
    {
      title: 'Style guide',
      description: 'I built an atomic design system for the service.',
      layout: 'title-info',
      ctaLabel: 'View landing',
    },
    {
      title: 'Design system',
      description: 'I built an atomic design system for the service.',
      layout: 'title-info',
      ctaLabel: 'View',
    },
    {
      title: 'Research study',
      layout: 'title-info',
      ctaLabel: 'View',
    },
    {},
    {
      title: 'Interfaces and flows',
    },
    {
      mvpSlides: [
        {
          heading: 'Launching the Telegram bot',
          text:
            'To test whether people want a softer, informal format for city networking, the MVP shipped as a Telegram ecosystem: a public channel plus a bot as first infrastructure to exercise core user-to-user flows.',
        },
        {
          text:
            'The Telegram channel acted as the project’s public media surface—building community feel, showcasing activity, and attracting newcomers with announcements, user stories, project news, and calls to join.',
        },
        {
          text:
            'The Drop bot was the core interaction layer: anonymous intros, requests, and finding like-minded people in a tone close to urban culture. Users could create profiles, send responses, and get replies on mutual interest. They could propose meetups. Profiles were manually moderated before publishing to keep the space safer and reduce unwanted content.',
        },
        {
          text:
            'The MVP tested whether anonymous, less formal conversation can spark new social and professional ties. Early on, people actively used responses and threads—several profiles per session and frequent return visits to check replies.',
        },
        {
          text:
            'The Telegram MVP validated the core hypothesis: people will try alternative dating-and-chat formats when the interface and mechanics feel safe and unobtrusive. It also clarified primary use cases and set the foundation for a full product.',
        },
      ],
    },
    {},
  ],
};
