/**
 * Плашки первого экрана — Figma 416:12977 / 416:12981…13002.
 * Подписи — ключи `src/dictionaries/*.json` → `sectionNav.*`.
 */
import { publicUrl } from '../utils/publicUrl.js';

/** Экспорты иконок с макета 416:12975. */
const FIGMA_HOME = '/images/figma-416-12975';

/** Размеры фрейма First screen из макета (node 416:12977) */
export const HEADER_FIRST_SCREEN = { w: 1275.452, h: 312.784 };

export const SECTION_HEADER_IMAGES = {
  experience: publicUrl(`${FIGMA_HOME}/icon-experience.png`),
  memes: publicUrl(`${FIGMA_HOME}/icon-memes.png`),
  projects: publicUrl(`${FIGMA_HOME}/icon-projects.png`),
  education: publicUrl(`${FIGMA_HOME}/icon-education.png`),
  contact: publicUrl(`${FIGMA_HOME}/icon-contact.png`),
  resume: publicUrl(`${FIGMA_HOME}/icon-resume.png`),
  habitat: publicUrl(`${FIGMA_HOME}/icon-habitat.png`),
};

export const headerItemsFolder = [
  { nodeId: '416-12981', labelKey: 'sectionNav.experience', iconKey: 'experience', to: '/about#experience', placement: { x: 1097.67, y: 30.11 } },
  { nodeId: '416-12984', labelKey: 'sectionNav.memes', iconKey: 'memes', to: '/about#education', placement: { x: 46.91, y: 179.79 } },
  { nodeId: '416-12999', labelKey: 'sectionNav.projectsOverview', iconKey: 'projects', to: '/projects', placement: { x: 232.91, y: 4.11 } },
  { nodeId: '416-13002', labelKey: 'sectionNav.educationFolder', iconKey: 'education', to: '/about#education', placement: { x: 938.73, y: 129.03 } },
];

/** Смещение папки от центра viewport при полном скролле hero (px). */
/** Кольцо вокруг фото — боковые позиции, не под футером (контакты / «Больше обо мне»). */
export const FOLDER_HERO_RING_PX = {
  '416-12999': { x: -92, y: -88 },
  '416-12981': { x: 92, y: -88 },
  '416-13002': { x: 108, y: 8 },
  '416-12984': { x: -108, y: 8 },
};

export const headerItemsWell = [
  { nodeId: '416-12987', labelKey: 'sectionNav.contact', iconKey: 'contact', to: '/contact', placement: { x: 290.76, y: 181.01 } },
  { nodeId: '416-12990', labelKey: 'sectionNav.contact', iconKey: 'contact', to: '/contact', placement: { x: 96.41, y: 30.13 } },
  { nodeId: '416-12993', labelKey: 'sectionNav.resume', iconKey: 'resume', to: '/resume', placement: { x: 891.76, y: 22.13 } },
  { nodeId: '416-12996', labelKey: 'sectionNav.habitat', iconKey: 'habitat', to: '/about#intro', placement: { x: 1101.2, y: 200.81 } },
];
