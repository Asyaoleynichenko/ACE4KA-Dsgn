import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';

const footerLinks = [
  { nodeId: '16-185', href: 'https://t.me/pnkprty', linkKey: 'telegram' },
  { nodeId: '16-187', href: 'https://pinterest.com/', linkKey: 'pinterest' },
  { nodeId: '16-189', href: 'https://behance.net/', linkKey: 'behance' },
  { nodeId: '16-191', href: '/resume', linkKey: 'resume' },
  { nodeId: '16-195', href: 'mailto:hello@example.com', linkKey: 'email' },
  { nodeId: '16-199', href: 'https://dribbble.com/', linkKey: 'dribbble' },
  { nodeId: '16-201', href: 'https://linkedin.com/', linkKey: 'linkedin' },
  { nodeId: '16-207', href: '/projects', linkKey: 'projects' },
  { nodeId: '16-209', href: '/contact', linkKey: 'contact' },
];

export default function Footer({ snapScreen = false }) {
  const { localizedPath, t } = useI18n();

  const rootClass = snapScreen ? 'site-footer site-footer--snap' : 'site-footer';

  return (
    <footer className={rootClass} data-node-id="16-170" data-name="Footer">
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
                {t('footer.devNote')}{' '}
                <a href="mailto:hello@example.com">{t('footer.emailLink')}</a>
              </p>
            </div>

            <nav className="site-footer__nav" aria-label={t('footer.navAria')} data-node-id="16-177">
              <ul className="site-footer__list">
                {footerLinks.map(({ nodeId, href, linkKey }) => {
                  const label = t(`footer.links.${linkKey}`);
                  const isInternal = href.startsWith('/');
                  const isExternal = href.startsWith('http');

                  const linkClass = 'site-footer__link';

                  if (isInternal) {
                    if (href === '/projects') {
                      return (
                        <li key={nodeId} className="site-footer__item">
                          <SeamlessProjectsLink
                            to={localizedPath(href)}
                            className={linkClass}
                            data-node-id={nodeId}
                          >
                            <span className="text-condensed">{label}</span>
                          </SeamlessProjectsLink>
                        </li>
                      );
                    }
                    return (
                      <li key={nodeId} className="site-footer__item">
                        <Link to={localizedPath(href)} className={linkClass} data-node-id={nodeId}>
                          <span className="text-condensed">{label}</span>
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={nodeId} className="site-footer__item">
                      <a
                        href={href}
                        className={linkClass}
                        data-node-id={nodeId}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                      >
                        <span className="text-condensed">{label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
