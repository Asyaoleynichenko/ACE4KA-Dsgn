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

  return (
    <footer className={snapScreen ? 'footer snap-screen' : 'footer'} data-node-id="16-170">
      <div className="footer-inner" data-node-id="16-172">
        <div className="footer-top" data-node-id="16-173">
          <div className="footer-top__row">
            <div className="footer-status" data-node-id="16-174">
              <span className="footer-dot" aria-hidden="true" data-node-id="16-175" />{' '}
              <span data-node-id="16-176">{t('footer.openForWork')}</span>
            </div>
            <div className="footer-links-row" data-node-id="16-177">
              {footerLinks.map(({ nodeId, href, linkKey }) => {
                const label = t(`footer.links.${linkKey}`);
                const isInternal = href.startsWith('/');
                const isExternal = href.startsWith('http');
                if (isInternal) {
                  if (href === '/projects') {
                    return (
                      <SeamlessProjectsLink
                        key={nodeId}
                        to={localizedPath(href)}
                        className="footer-link"
                        data-node-id={nodeId}
                      >
                        {label}
                      </SeamlessProjectsLink>
                    );
                  }
                  return (
                    <Link
                      key={nodeId}
                      to={localizedPath(href)}
                      className="footer-link"
                      data-node-id={nodeId}
                    >
                      {label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={nodeId}
                    href={href}
                    className="footer-link"
                    data-node-id={nodeId}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          </div>
          <p className="footer-note" data-node-id="16-183">
            {t('footer.devNote')}{' '}
            <a href="mailto:hello@example.com">{t('footer.emailLink')}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
