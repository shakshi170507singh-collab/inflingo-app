import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import NoticeCard from '../components/NoticeCard';
import { CATEGORIES } from '../data/notices';
import { useNotices } from '../context/NoticesContext';
import './CategoryPage.css';

function CategoryPage() {
  const { categoryKey } = useParams();
  const { notices, loading, error } = useNotices();
  const category = CATEGORIES.find((c) => c.key === categoryKey);
  const filtered = notices.filter((n) => n.category === categoryKey);

  if (!category) {
    return (
      <>
        <Navbar />
        <main className="category-page">
          <p className="empty-state">Unknown category.</p>
          <Link to="/" className="back-link">← Back to home</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="category-page">
        <div className="category-page-inner">
          <Link to="/" className="back-link">← Back to home</Link>

          <div className={`category-page-header category-page-header--${category.key}`}>
            <div>
              <span className="category-page-eyebrow">Category</span>
              <h1>{category.label}</h1>
            </div>
            <span className="category-page-count">
              {filtered.length} {filtered.length === 1 ? 'notice' : 'notices'}
            </span>
          </div>

          <nav className="category-tabs">
            {CATEGORIES.map((c) => (
              <Link
                key={c.key}
                to={`/categories/${c.key}`}
                className={`category-tab ${c.key === categoryKey ? 'active' : ''}`}
              >
                {c.label}
              </Link>
            ))}
          </nav>

          <div className="notices-grid">
            {loading && <p className="empty-state">Loading...</p>}
            {error && <p className="empty-state">{error}</p>}
            {!loading && !error && (
              filtered.length > 0 ? (
                filtered.map((n) => <NoticeCard key={n.id} {...n} />)
              ) : (
                <div className="empty-state">
                  <span>📭</span>
                  <p>No notices in this category yet.</p>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default CategoryPage;