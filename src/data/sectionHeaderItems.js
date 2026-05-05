/**
 * Данные и изображения секции «Папки» на главной (Figma 89:347 / 1-206 … 1-227).
 * Иконка Folder — компонент [1-210](https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=1-210&m=dev); растр в `src/assets/header/folder-1-210.png` (импорт — в бандле не остаётся старый `folder.svg`).
 *
 * `placement` — левый верхний угол плашки в координатах фрейма **70:343** (1275.452×312.784), dev mode Figma 89:347.
 */
import folderIconFromFigma from '../assets/header/folder-1-210.png';
import { publicUrl } from '../utils/publicUrl.js';

/** Размеры фрейма First screen из макета (node 70:343) */
export const HEADER_FIRST_SCREEN = { w: 1275.452, h: 312.784 };

export const SECTION_HEADER_IMAGES = {
  folder: folderIconFromFigma,
  projects: publicUrl('/images/icons/projects.svg'),
  contact: publicUrl('/images/icons/contact.svg'),
  team: publicUrl('/images/icons/team.svg'),
  habitat: publicUrl('/images/icons/habitat.svg'),
};

export const headerItemsFolder = [
  { nodeId: '1-206', label: 'Опыт', iconKey: 'folder', to: '/about#experience', placement: { x: 1097.67, y: 30.11 } },
  { nodeId: '1-209', label: 'Любимые мемы воображаемых людей', iconKey: 'folder', to: '/about#memes', placement: { x: 46.91, y: 179.79 } },
  { nodeId: '1-224', label: 'Краткий обзор на проекты', iconKey: 'projects', to: '/projects', placement: { x: 232.91, y: 4.11 } },
  { nodeId: '1-227', label: 'Образование', iconKey: 'folder', to: '/about#education', placement: { x: 938.73, y: 129.03 } },
];

export const headerItemsWell = [
  { nodeId: '1-212', label: 'Связь', iconKey: 'contact', to: '/contact', placement: { x: 290.76, y: 181.01 } },
  { nodeId: '1-215', label: 'Связь', iconKey: 'contact', to: '/contact', placement: { x: 96.41, y: 30.13 } },
  { nodeId: '1-218', label: 'Команда', iconKey: 'team', to: '/about#team', placement: { x: 891.76, y: 22.13 } },
  { nodeId: '1-221', label: 'Я в естественной среде обитания', iconKey: 'habitat', to: '/about#habitat', placement: { x: 1101.2, y: 200.81 } },
];
