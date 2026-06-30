import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSaved } from '../context/SavedContext';
import { useNotices } from '../context/NoticesContext';
import './NoticeDetailPage.css';

function NoticeDetailPage() {
  const { id } = useParams();
  const { notices, loading } = useNotices();
  const { isSaved, toggleSave } = useSaved();

  const notice = notices.find((n) => String(n.id) === id);

  if (loading) return <><Navbar /><main className="notice-detail"><p className="empty-state">Loading...</p></main></>;
  if (!notice) return <Navigate to="/" replace />;

  const saved = isSaved(notice.id);

  return (
    <>
      <Navbar />
      <main className="notice-detail">
        <div className="notice-detail-inner">
          <Link to={`/categories/${notice.category}`} className="back-link">
            ← Back to {notice.category}
          </Link>

          <article className={`notice-detail-card notice-detail-card--${notice.category}`}>
            <div className="notice-detail-meta">
              <span className="notice-detail-category">{notice.category}</span>
              <time className="notice-detail-date">
                {new Date(notice.createdAt).toLocaleDateString()}
              </time>
            </div>

            <h1 className="notice-detail-title">{notice.title}</h1>

            {notice.author?.name && (
              <p className="notice-detail-source">
                Posted by <strong>{notice.author.name}</strong>
                {notice.author.role && ` · ${notice.author.role}`}
              </p>
            )}

            <hr className="notice-detail-divider" />

            <p className="notice-detail-body">
  {notice.content.split(/\s+/).map((word, i) => {
    if (word.startsWith('http://') || word.startsWith('https://')) {
      // Strip trailing punctuation (., comma, ), ], !, ?) that isn't part of the actual URL
      const trailingPunctMatch = word.match(/[).,!?\]]+$/);
      const trailing = trailingPunctMatch ? trailingPunctMatch[0] : '';
      const cleanUrl = trailing ? word.slice(0, -trailing.length) : word;

      return (
        <span key={i}>
          <a href={cleanUrl} target="_blank" rel="noopener noreferrer" className="notice-link">
            {cleanUrl}
          </a>{trailing}{' '}
        </span>
      );
    }
    return <span key={i}>{word} </span>;
  })}
</p>

            <button
              type="button"
              className={`notice-detail-save ${saved ? 'notice-detail-save--active' : ''}`}
              onClick={() => toggleSave(notice.id)}
            >
              <svg viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'}>
                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              {saved ? 'Saved' : 'Save notice'}
            </button>
          </article>
        </div>
      </main>
    </>
  );
}

export default NoticeDetailPage;