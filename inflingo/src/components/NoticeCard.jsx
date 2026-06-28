import { Link } from 'react-router-dom';
import { useSaved } from '../context/SavedContext';
import './NoticeCard.css';

function NoticeCard({ id, title, excerpt, category = 'academics', date, source, isNew }) {
  const { isSaved, toggleSave } = useSaved();
  const saved = isSaved(id);

  return (
    <article className={`notice-card notice-card--${category}`}
    onClick={() => window.location.href = `/notice/${id}`}
  style={{ cursor: 'pointer' }}
  
>
  <span className="notice-card-pin" aria-hidden="true"></span>
      

      <button
        type="button"
        className={`notice-card-bookmark ${saved ? 'notice-card-bookmark--active' : ''}`}
        onClick={() => toggleSave(id)}
        aria-label={saved ? 'Remove bookmark' : 'Save notice'}
      >
        <svg viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'}>
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="notice-card-meta">
        <span className="notice-card-category">{category}</span>
        <time className="notice-card-date">{date}</time>
      </div>

      <Link to={`/notice/${id}`} className="notice-card-link">
        <h3 className="notice-card-title">{title}</h3>
        {excerpt && <p className="notice-card-excerpt">{excerpt}</p>}
      </Link>

      <div className="notice-card-footer">
        {source && <span className="notice-card-source">{source}</span>}
        {isNew && <span className="notice-card-badge">New</span>}
      </div>
    </article>
  );
}

export default NoticeCard;
