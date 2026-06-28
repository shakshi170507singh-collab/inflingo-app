import './NoticeCard.css';

function NoticeCard({ title, excerpt, category = 'academics', date, source, isNew }) {
  return (
    <article className={`notice-card notice-card--${category}`}>
      <span className="notice-card-pin" aria-hidden="true"></span>

      <div className="notice-card-meta">
        <span className="notice-card-category">{category}</span>
        <time className="notice-card-date">{date}</time>
      </div>

      <h3 className="notice-card-title">{title}</h3>

      {excerpt && <p className="notice-card-excerpt">{excerpt}</p>}

      <div className="notice-card-footer">
        {source && <span className="notice-card-source">{source}</span>}
        {isNew && <span className="notice-card-badge">New</span>}
      </div>
    </article>
  );
}

export default NoticeCard;
