import { Link } from 'react-router-dom';
import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';

/* Figma 16:185–16:209 — 9 footer link nodes */
const footerLinks = [
  { nodeId: '16-185', href: 'https://t.me/pnkprty', label: 'Telegram' },
  { nodeId: '16-187', href: 'https://pinterest.com/', label: 'Pinterest' },
  { nodeId: '16-189', href: 'https://behance.net/', label: 'Behance' },
  { nodeId: '16-191', href: '/resume', label: 'Резюме' },
  { nodeId: '16-195', href: 'mailto:hello@example.com', label: 'Email' },
  { nodeId: '16-199', href: 'https://dribbble.com/', label: 'Dribbble' },
  { nodeId: '16-201', href: 'https://linkedin.com/', label: 'LinkedIn' },
  { nodeId: '16-207', href: '/projects', label: 'Проекты' },
  { nodeId: '16-209', href: '/contact', label: 'Контакты' },
];

export default function Footer({ snapScreen = false }) {
  return (
    <footer className={snapScreen ? 'footer snap-screen' : 'footer'} data-node-id="16-170">
      <div className="footer-inner" data-node-id="16-172">
        <div className="footer-top" data-node-id="16-173">
          <div className="footer-top__row">
            <div className="footer-status" data-node-id="16-174">
              <span className="footer-dot" aria-hidden="true" data-node-id="16-175" /> <span data-node-id="16-176">Открыта для работы</span>
            </div>
            <div className="footer-links-row" data-node-id="16-177">
              {footerLinks.map(({ nodeId, href, label }) => {
                const isInternal = href.startsWith('/');
                const isExternal = href.startsWith('http');
                if (isInternal) {
                  if (href === '/projects') {
                    return (
                      <SeamlessProjectsLink
                        key={nodeId}
                        to={href}
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
                      to={href}
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
            Сайт в разработке. Что‑то сломалось —{' '}
            <a href="mailto:hello@example.com">написать на почту</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
