import { Link } from 'react-router-dom';
import pagesConfig from '../pagesConfig';
import './HomePage.css';

export default function HomePage() {
  const categories = pagesConfig.reduce((acc, page) => {
    const cat = page.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(page);
    return acc;
  }, {});

  return (
    <div className="home">
      <div className="home__hero">
        <div className="home__hero-badge">Study Guide</div>
        <h1 className="home__hero-title">IAM Concepts</h1>
        <p className="home__hero-subtitle">
          Interactive guides for Identity and Access Management.
          JWT, OAuth2, OIDC, workload federation, and more.
        </p>
      </div>

      {Object.entries(categories).map(([category, pages]) => (
        <section key={category} className="home__section">
          <h2 className="home__section-title">{category}</h2>
          <div className="home__grid">
            {pages.map((page) => (
              <Link
                key={page.id}
                to={page.path}
                className="home__card"
                style={{ '--card-accent': page.color }}
              >
                <div className="home__card-icon">{page.icon}</div>
                <h3 className="home__card-title">{page.title}</h3>
                <p className="home__card-subtitle">{page.subtitle}</p>
                <div className="home__card-arrow">{'\u2192'}</div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
