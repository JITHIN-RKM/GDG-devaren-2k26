import { useNavigate } from 'react-router-dom';
import MatchingBar from './MatchingBar';
import './OpportunityCard.css';

export default function OpportunityCard({ opportunity, index = 0 }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/listing/${opportunity.id}`);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'internship':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        );
      case 'hackathon':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        );
      case 'scholarship':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 10 3 12 0v-5" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getDaysLeft = (deadline) => {
    const now = new Date();
    const dl = new Date(deadline);
    const diff = Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Expired';
    if (diff === 0) return 'Today';
    if (diff === 1) return '1 day left';
    return `${diff} days left`;
  };

  const daysLeft = getDaysLeft(opportunity.deadline);
  const isUrgent = !isNaN(parseInt(daysLeft)) && parseInt(daysLeft) <= 14;

  return (
    <div
      className="opp-card glass"
      onClick={handleClick}
      style={{ animationDelay: `${index * 80}ms` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      id={`opportunity-card-${opportunity.id}`}
    >
      <div className="opp-card__header">
        <span className={`badge badge-${opportunity.type}`}>
          {getTypeIcon(opportunity.type)}
          {opportunity.type}
        </span>
        <span className={`opp-card__deadline ${isUrgent ? 'opp-card__deadline--urgent' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {daysLeft}
        </span>
      </div>

      <h3 className="opp-card__title">{opportunity.title}</h3>
      <p className="opp-card__org">{opportunity.organization}</p>
      <p className="opp-card__desc">{opportunity.description}</p>

      <div className="opp-card__tags">
        {opportunity.tags.slice(0, 3).map(tag => (
          <span key={tag} className="opp-card__tag">{tag}</span>
        ))}
      </div>

      <div className="opp-card__footer">
        <MatchingBar score={opportunity.matchScore} />
      </div>

      <div className="opp-card__glow" />
    </div>
  );
}
