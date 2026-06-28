import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import NoticeCard from '../components/NoticeCard';
import { useSaved } from '../context/SavedContext';
import { useNotices } from '../context/NoticesContext';
import './SavedPage.css';

function SavedPage() {
  const { savedIds } = useSaved();
  const { notices, loading } = useNotices();
  const savedNotices = notices.filter((n) => savedIds.includes(n.id));

  return (
    <>
      <Navbar />
      <main className="saved-page">
        <div className="saved-page-inner">
          <div className="saved-page-header">
            <h1 className="saved-page-title">Saved Notices</h1>
            {loading ? (
              <p className="saved-page-subtitle">Loading...</p>
            ) : savedNotices.length > 0 ? (
              <p className="saved-page-subtitle has-items">
                🔖 {savedNotices.length} bookmarked
              </p>
            ) : (
              <p className="saved-page-subtitle">Nothing saved yet</p>
            )}
          </div>

          {!loading && (
            savedNotices.length > 0 ? (
              <div className="notices-grid">
                {savedNotices.map((n) => (
                  <NoticeCard key={n.id} {...n} />
                ))}
              </div>
            ) : (
              <div className="saved-empty">
                <p>You haven't bookmarked any notices yet.</p>
                <Link to="/" className="saved-empty-link">Browse notices →</Link>
              </div>
            )
          )}
        </div>
      </main>
    </>
  );
}

export default SavedPage;