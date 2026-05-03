/**
 * Данные и изображения секции «Папки» на главной (Figma 89:347 / 1-206 … 1-227).
 * Иконка Folder — компонент [1-210](https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=1-210&m=dev); растр в `src/assets/header/folder-1-210.png` (импорт — в бандле не остаётся старый `folder.svg`).
 */
import folderIconFromFigma from '../assets/header/folder-1-210.png';

export const SECTION_HEADER_IMAGES = {
  folder: folderIconFromFigma,
  projects: '/images/icons/projects.svg',
  contact: '/images/icons/contact.svg',
  team: '/images/icons/team.svg',
  habitat: '/images/icons/habitat.svg',
};

export const headerItemsFolder = [
  { nodeId: '1-206', label: 'Опыт', iconKey: 'folder', to: '/about#experience' },
  { nodeId: '1-209', label: 'Любимые мемы воображаемых людей', iconKey: 'folder', to: '/about' },
  { nodeId: '1-224', label: 'Краткий обзор на проекты', iconKey: 'projects', to: '/projects' },
  { nodeId: '1-227', label: 'Образование', iconKey: 'folder', to: '/about#education' },
];

export const headerItemsWell = [
  { nodeId: '1-212', label: 'Связь', iconKey: 'contact', to: '/contact' },
  { nodeId: '1-215', label: 'Связь', iconKey: 'contact', to: '/contact' },
  { nodeId: '1-218', label: 'Команда', iconKey: 'team', to: '/about#team' },
  { nodeId: '1-221', label: 'Я в естественной среде обитания', iconKey: 'habitat', to: '/about#habitat' },
];
