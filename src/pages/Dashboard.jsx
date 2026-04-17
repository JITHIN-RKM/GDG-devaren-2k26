import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getOpportunities } from '../data/opportunities';
import OpportunityCard from '../components/OpportunityCard';
import FloatingLines from '../components/FloatingLines';
import './Dashboard.css';

export default function Dashboard() {
  const {
    isLoggedIn, user, profile,
    opportunities, setOpportunities,
    visibleCount, loadMore,
    activeFilter, setFilter,
  } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    const opps = getOpportunities(profile);
    setOpportunities(opps);
  }, [isLoggedIn, profile, navigate, setOpportunities]);

  const filteredOpps = useMemo(() => {
    if (activeFilter === 'all') return opportunities;
    return opportunities.filter(o => o.type === activeFilter);
  }, [opportunities, activeFilter]);

  const visibleOpps = filteredOpps.slice(0, visibleCount);
  const hasMore = visibleCount < filteredOpps.length;

  const filters = [
    { key: 'all', label: 'All', icon: '✦' },
    { key: 'internship', label: 'Internships', icon: '💼' },
    { key: 'hackathon', label: 'Hackathons', icon: '⚡' },
    { key: 'scholarship', label: 'Scholarships', icon: '🎓' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const typeCounts = useMemo(() => ({
    all: opportunities.length,
    internship: opportunities.filter(o => o.type === 'internship').length,
    hackathon: opportunities.filter(o => o.type === 'hackathon').length,
    scholarship: opportunities.filter(o => o.type === 'scholarship').length,
  }), [opportunities]);

  return (
    <div className="dashboard" id="dashboard-page">
      <div className="page-bg-premium" />
      <div className="page-bg-premium__lines">
        <FloatingLines
          enabledWaves={["middle"]}
          lineCount={3}
          lineDistance={15}
          interactive={false}
          parallax={true}
          animationSpeed={0.5}
          gradientStart="#0891b2"
          gradientMid="#94a3b8"
          gradientEnd="#ffffff"
        />
      </div>

      <div className="dashboard__content container">
        {/* Header */}
        <header className="dashboard__header">
          <div className="dashboard__greeting">
            <h1 className="dashboard__title">
              {getGreeting()}, <span className="gradient-text">{user?.name || 'Student'}</span>
            </h1>
            <p className="dashboard__subtitle">
              We found <strong>{filteredOpps.length}</strong> opportunities matched to your profile
            </p>
          </div>

          {/* Profile Summary */}
          {profile.major && (
            <div className="dashboard__profile-pill glass">
              <span className="dashboard__profile-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 10 3 12 0v-5" />
                </svg>
                {profile.major}
              </span>
              <span className="dashboard__profile-divider" />
              <span className="dashboard__profile-item">{profile.year}</span>
              <span className="dashboard__profile-divider" />
              <span className="dashboard__profile-item">CGPA: {profile.cgpa}</span>
            </div>
          )}
        </header>

        {/* Filters */}
        <div className="dashboard__filters">
          {filters.map(f => (
            <button
              key={f.key}
              className={`dashboard__filter ${activeFilter === f.key ? 'dashboard__filter--active' : ''}`}
              onClick={() => setFilter(f.key)}
              id={`filter-${f.key}`}
            >
              <span className="dashboard__filter-icon">{f.icon}</span>
              {f.label}
              <span className="dashboard__filter-count">{typeCounts[f.key]}</span>
            </button>
          ))}
        </div>

        {/* Opportunity Grid */}
        <div className="dashboard__grid" id="opportunity-feed">
          {visibleOpps.map((opp, i) => (
            <OpportunityCard key={opp.id} opportunity={opp} index={i} />
          ))}
        </div>

        {/* Empty State */}
        {filteredOpps.length === 0 && (
          <div className="dashboard__empty">
            <p>No opportunities found for this filter. Try a different category!</p>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="dashboard__load-more">
            <button
              className="btn-secondary dashboard__load-more-btn"
              onClick={loadMore}
              id="load-more-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="7 13 12 18 17 13" />
                <polyline points="7 6 12 11 17 6" />
              </svg>
              Load More Options
              <span className="dashboard__remaining">({filteredOpps.length - visibleCount} more)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
