import { NavLink } from 'react-router-dom';
import pagesConfig from '../pagesConfig';
import './Sidebar.css';

export default function Sidebar({ onNavigate }) {
  const categories = pagesConfig.reduce((acc, page) => {
    const cat = page.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(page);
    return acc;
  }, {});

  return (
    <nav className="sidebar">
      <NavLink to="/" className="sidebar__brand" onClick={onNavigate}>
        <span className="sidebar__brand-icon">{'\u{1F6E1}\uFE0F'}</span>
        <div>
          <div className="sidebar__brand-title">IAM Concepts</div>
          <div className="sidebar__brand-subtitle">Study Guide</div>
        </div>
      </NavLink>

      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
        }
        onClick={onNavigate}
      >
        <span className="sidebar__link-icon">{'\u{1F3E0}'}</span>
        <span>Home</span>
      </NavLink>

      {Object.entries(categories).map(([category, pages]) => (
        <div key={category} className="sidebar__group">
          <div className="sidebar__group-label">{category}</div>
          {pages.map((page) => (
            <NavLink
              key={page.id}
              to={page.path}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              onClick={onNavigate}
            >
              <span className="sidebar__link-icon">{page.icon}</span>
              <span>{page.title}</span>
            </NavLink>
          ))}
        </div>
      ))}

      <div className="sidebar__footer">
        <div className="sidebar__footer-text">Built for learning IAM</div>
      </div>
    </nav>
  );
}
