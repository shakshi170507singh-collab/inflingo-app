import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import NoticeCard from '../components/NoticeCard';
import { useNotices } from '../context/NoticesContext';
import { CATEGORIES } from '../data/notices';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { notices } = useNotices();
  const [query, setQuery] = useState('');

  const categoryCounts = useMemo(() => {
    return CATEGORIES.reduce((acc, c) => {
      acc[c.key] = notices.filter((n) => n.category === c.key).length;
      return acc;
    }, {});
  }, [notices]);

  const filteredNotices = useMemo(() => {
    if (!query) return notices;
    return notices.filter((n) =>
      n.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [notices, query]);

  return (
    <>
      <Navbar />
      <main className="hero">

        {/* ── Deep-indigo banner with search ── */}
        <div className="hero-banner">
          <span className="hero-eyebrow">Your college notice board</span>
          <h1 className="heading">Inflingo</h1>
          <p className="tagline">Never miss an update</p>
          <div className="search-wrapper">
            <SearchBar className="search-bar" onSearch={setQuery} />
          </div>
        </div>

        {/* ── Content lifts out of the banner ── */}
        <div className="hero-body">
          <div className="hero-sections">

            <section className="section">
              <h2 className="section-heading">Categories</h2>
              <div className="category-grid">
                {CATEGORIES.map((c) => (
                  <CategoryCard
                    key={c.key}
                    category={c.key}
                    label={c.label}
                    count={categoryCounts[c.key]}
                    onClick={() => navigate(`/categories/${c.key}`)}
                  />
                ))}
              </div>
            </section>

            <section className="section">
              <h2 className="section-heading">Recent Notices</h2>
              <div className="notices-grid">
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((n) => <NoticeCard key={n.id} {...n} />)
                ) : (
                  <div className="empty-state">
                    No notices match your search.
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>

      </main>
    </>
  );
}

export default Home;
