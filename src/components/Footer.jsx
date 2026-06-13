import { useI18n } from '../i18n/I18nProvider.jsx';
import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';

/** Figma 863:18915 — мобильный футер: Telegram → Behance → Resume → Email → Pinterest */
const footerPrimaryLinks = [
  { nodeId: '16-185', href: 'https://t.me/pnkprty', linkKey: 'telegram' },
  { nodeId: '16-189', href: 'https://behance.net/', linkKey: 'behance' },
  { nodeId: '16-191', href: '/resume', linkKey: 'resume' },
  { nodeId: '16-195', href: 'mailto:hello@example.com', linkKey: 'email' },
  { nodeId: '16-187', href: 'https://pinterest.com/', linkKey: 'pinterest' },
];

const footerExtendedLinks = [
  { nodeId: '16-199', href: 'https://dribbble.com/', linkKey: 'dribbble' },
  { nodeId: '16-201', href: 'https://linkedin.com/', linkKey: 'linkedin' },
  { nodeId: '16-207', href: '/projects', linkKey: 'projects' },
  { nodeId: '16-209', href: '/contact', linkKey: 'contact' },
];

function FooterLinkItem({ nodeId, href, label, localizedPath, linkClass }) {
  const isInternal = href.startsWith('/');
  const isExternal = href.startsWith('http');

  if (isInternal) {
    return (
      <SeamlessProjectsLink to={localizedPath(href)} className={linkClass} data-node-id={nodeId}>
        <span className="text-condensed">{label}</span>
      </SeamlessProjectsLink>
    );
  }

  return (
    <a
      href={href}
      className={linkClass}
      data-node-id={nodeId}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      <span className="text-condensed">{label}</span>
    </a>
  );
}

function FooterLinks({ links, localizedPath, t, startIndex = 0, itemClass = '' }) {
  return links.map(({ nodeId, href, linkKey }, index) => {
    const label = t(`footer.links.${linkKey}`);
    const globalIndex = startIndex + index;
    const linkEl = (
      <FooterLinkItem
        key={nodeId}
        nodeId={nodeId}
        href={href}
        label={label}
        localizedPath={localizedPath}
        linkClass="site-footer__link"
      />
    );

    if (globalIndex === 0) {
      return linkEl;
    }

    return (
      <span
        key={nodeId}
        className={['hero-links__item', itemClass].filter(Boolean).join(' ')}
      >
        <span className="hero-links__sep site-footer__sep" aria-hidden="true" />
        {linkEl}
      </span>
    );
  });
}

export default function Footer({ snapScreen = false }) {
  const { localizedPath, t } = useI18n();

  const rootClass = snapScreen ? 'site-footer site-footer--snap' : 'site-footer';

  return (
    <footer
      className={rootClass}
      data-node-id="863:18915"
      data-figma-node="863-18915"
      data-name="Footer"
    >
      <div className="site-footer__surface" data-node-id="16-172">
        <p className="site-footer__wordmark" data-node-id="16-171" aria-hidden="true">
          <span className="site-footer__wordmark__track" data-scale="footer-mega">
            {'ACE4KA'.split('').map((ch, i) => (
              <span key={`${ch}-${i}`} className="site-footer__wordmark__char">
                {ch}
              </span>
            ))}
          </span>
        </p>

        <div className="site-footer__contain">
          <div className="site-footer__main" data-node-id="16-173">
            <div className="site-footer__left">
              <div className="site-footer__status" data-node-id="16-174">
                <span className="site-footer__dot" aria-hidden="true" data-node-id="16-175" />
                <span data-node-id="16-176">{t('footer.openForWork')}</span>
              </div>
              <p className="site-footer__note" data-node-id="16-183">
                {t('footer.devNoteIntro')}
                <br />
                {t('footer.devNoteMid')}
                <br />
                {t('footer.devNoteOutroPrefix')}
                <a href="mailto:hello@example.com">{t('footer.devNoteLink')}</a>
              </p>
            </div>

            <nav className="site-footer__nav" aria-label={t('footer.navAria')} data-node-id="16-177">
              <div className="site-footer__links hero-links">
                <FooterLinks links={footerPrimaryLinks} localizedPath={localizedPath} t={t} />
                <FooterLinks
                  links={footerExtendedLinks}
                  localizedPath={localizedPath}
                  t={t}
                  startIndex={footerPrimaryLinks.length}
                  itemClass="site-footer__item--extended"
                />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
