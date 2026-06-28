import './CategoryCard.css';

function getIcon(category) {
  switch (category) {
    case 'exams':
      return (
        
         <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 11l3 3 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

      case 'general':
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
      <path d="M12 8v4l3 3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  case 'sports':
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
      <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10" stroke="white" strokeWidth="2"/>
      <path d="M2 12h20" stroke="white" strokeWidth="2"/>
    </svg>
  );
case 'scholarships':
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
case 'lost-found':
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2"/>
      <path d="M21 21l-4.35-4.35" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

    case 'events':
      return (
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="13" rx="2" stroke="white" strokeWidth="2" />
          <path d="M16 3v4M8 3v4M3 10h18" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'placements':
      return (
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="3" y="7" width="18" height="13" rx="2" stroke="white" strokeWidth="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="white" strokeWidth="2" />
        </svg>
      );
    case 'academics':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M2 9l10-5 10 5-10 5L2 9z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
  }
}

function CategoryCard({ label, category = 'academics', count, onClick }) {
  return (
    <button
      className={`category-card category-card--${category}`}
      onClick={onClick}
    >
      <span className="category-card-icon">{getIcon(category)}</span>
      <span className="category-card-label">{label}</span>
      {typeof count === 'number' && (
        <span className="category-card-count">{count}</span>
      )}
    </button>
  );
}

export default CategoryCard;
