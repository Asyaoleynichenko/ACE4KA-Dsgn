/**
 * Данные и изображения секции «Папки» на главной (Figma 1-206 … 1-227).
 * Все изображения секции экспортируются из Figma в public/images/icons/.
 */
export const SECTION_HEADER_IMAGES = {
  folder: '/images/icons/folder.svg',
  projects: '/images/icons/projects.svg',
  contact: '/images/icons/contact.svg',
  team: '/images/icons/team.svg',
  habitat: '/images/icons/habitat.svg',
};

export const headerItemsFolder = [
  { nodeId: '1-206', label: 'Опыт', iconKey: 'folder', to: '/about#experience' },
  { nodeId: '1-209', label: 'Связь', iconKey: 'folder', to: '/contact' },
  { nodeId: '1-224', label: 'Краткий обзор на проекты', iconKey: 'projects', to: '/projects' },
  { nodeId: '1-227', label: 'Образование', iconKey: 'folder', to: '/about#education' },
];

export const headerItemsWell = [
  { nodeId: '1-212', label: 'Связь', iconKey: 'contact', to: '/contact' },
  { nodeId: '1-215', label: 'Связь', iconKey: 'contact', to: '/contact' },
  { nodeId: '1-218', label: 'Команда', iconKey: 'team', to: '/about#team' },
  { nodeId: '1-221', label: 'Я в естественной среде обитания', iconKey: 'habitat', to: '/about#habitat' },
];
