import './MatchingBar.css';

export default function MatchingBar({ score, size = 'default' }) {
  const getScoreLabel = (s) => {
    if (s >= 90) return 'Excellent Match';
    if (s >= 75) return 'Strong Match';
    if (s >= 60) return 'Good Match';
    if (s >= 45) return 'Fair Match';
    return 'Partial Match';
  };

  const getScoreColor = (s) => {
    if (s >= 85) return 'var(--accent-emerald)';
    if (s >= 70) return 'var(--accent-cyan)';
    if (s >= 55) return 'var(--accent-amber)';
    return 'var(--accent-magenta)';
  };

  return (
    <div className={`matching-bar matching-bar--${size}`}>
      <div className="matching-bar__header">
        <span className="matching-bar__label">{getScoreLabel(score)}</span>
        <span className="matching-bar__score" style={{ color: getScoreColor(score) }}>{score}%</span>
      </div>
      <div className="matching-bar__track">
        <div
          className="matching-bar__fill"
          style={{
            width: `${score}%`,
            background: score >= 70
              ? `linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald))`
              : score >= 50
                ? `linear-gradient(90deg, var(--accent-cyan), var(--accent-amber))`
                : `linear-gradient(90deg, var(--accent-magenta), var(--accent-amber))`,
          }}
        />
      </div>
    </div>
  );
}
