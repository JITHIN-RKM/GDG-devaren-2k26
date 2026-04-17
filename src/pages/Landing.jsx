import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AuthModal from '../components/AuthModal';
import FloatingLines from '../components/FloatingLines';
import { motion } from 'framer-motion';
import './Landing.css';

export default function Landing() {
  const [showAuth, setShowAuth] = useState(false);
  const { isLoggedIn, profile } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      // If profile is not filled, redirect to onboarding
      if (!profile.major) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isLoggedIn, profile, navigate]);

  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
          <path d="M11 8v6M8 11h6" />
        </svg>
      ),
      title: 'Smart Discovery',
      desc: 'AI scans thousands of opportunities and surfaces the ones perfectly aligned with your unique profile.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      title: 'Profile Matching',
      desc: 'Each opportunity gets a personalized match score so you know exactly where you stand.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 10h8M8 14h4" />
        </svg>
      ),
      title: 'AI Application Help',
      desc: 'Get AI-generated cover letters, cold emails, and personalized advice for every opportunity.',
    },
  ];

  const stats = [
    { value: '18K+', label: 'Opportunities' },
    { value: '95%', label: 'Match Rate' },
    { value: '50+', label: 'Countries' },
    { value: '10K+', label: 'Students' },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="landing" id="landing-page">
      <div className="page-bg-premium" />
      {/* Hero Section */}
      <section className="landing__hero" id="hero-section">
        {/* Animated background elements */}
        <div className="landing__hero-bg">
          <FloatingLines 
            enabledWaves={["middle","bottom","top"]}
            lineCount={8}
            lineDistance={8}
            bendRadius={8}
            bendStrength={-2}
            interactive={false}
            parallax={true}
            animationSpeed={1}
            gradientStart="#2dd4bf"
            gradientMid="#6366f1"
            gradientEnd="#020617"
          />
          <div className="landing__grid-overlay" />
        </div>

        <motion.div 
          className="landing__hero-content container"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div className="landing__badge" variants={fadeUp}>
            <span className="landing__badge-dot" />
            AI-Powered Career Intelligence
          </motion.div>

          <motion.h1 className="landing__title" variants={fadeUp}>
            Your Career,{' '}
            <span className="gradient-text serif-italic">Elevated</span>
          </motion.h1>

          <motion.p className="landing__subtitle" variants={fadeUp}>
            Altezza uses AI to discover and match you with the perfect internships, 
            hackathons, and scholarships — then helps you apply with confidence.
          </motion.p>

          <motion.div className="landing__cta-group" variants={fadeUp}>
            <motion.button
              className="btn-primary landing__cta"
              onClick={() => setShowAuth(true)}
              id="get-started-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </motion.button>
            <motion.button 
              className="btn-secondary landing__cta-secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
            </motion.button>
          </motion.div>

          {/* Stats moved down or stylized differently? Actually keeping them here for now */}
          <motion.div className="landing__stats" variants={staggerContainer}>
            {stats.map((stat) => (
              <motion.div key={stat.label} className="landing__stat" variants={fadeUp}>
                <span className="landing__stat-value gradient-text">{stat.value}</span>
                <span className="landing__stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Vision Section */}
      <section className="landing__vision section" id="vision-section">
        <motion.div 
          className="container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="landing__vision-content">
            <motion.h2 className="landing__vision-title" variants={fadeUp}>
              We aren’t just building a <span className="serif-italic">career tool</span>. We’re building a path to <span className="gradient-text">personal excellence</span>.
            </motion.h2>
            <motion.p className="landing__vision-desc" variants={fadeUp}>
              At Altezza, we believe every ambition deserves a direct path. Our vision is to eliminate the friction of career discovery, 
              turning the chaos of thousands of opportunities into a single, <span className="text-highlight">personalized roadmap</span>.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Pillars Section */}
      <section className="landing__pillars section" id="pillars-section">
        <motion.div 
          className="container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="landing__pillars-grid">
            <motion.div className="landing__pillar" variants={fadeUp}>
              <span className="pillar-num">01</span>
              <h3 className="pillar-title">Precision Discovery</h3>
              <p className="pillar-desc">Our proprietary algorithms process millions of data points to find the 1% of opportunities that truly matter to you.</p>
            </motion.div>
            <motion.div className="landing__pillar" variants={fadeUp}>
              <span className="pillar-num">02</span>
              <h3 className="pillar-title">Personalized Growth</h3>
              <p className="pillar-desc">Beyond matching, we provide the tools, emails, and advice to ensure you don’t just find opportunities—you win them.</p>
            </motion.div>
            <motion.div className="landing__pillar" variants={fadeUp}>
              <span className="pillar-num">03</span>
              <h3 className="pillar-title">Ethical Intelligence</h3>
              <p className="pillar-desc">We use AI responsibly, ensuring your data is protected and your applications are uniquely yours.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="landing__features section" id="features-section">
        <motion.div 
          className="container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="landing__features-header" variants={fadeUp}>
            <span className="landing__section-tag">How It Works</span>
            <h2 className="landing__section-title">
              From discovery to application,{' '}
              <span className="gradient-text">we've got you</span>
            </h2>
          </motion.div>

          <div className="landing__features-grid">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="landing__feature-card glass"
                variants={fadeUp}
              >
                <div className="landing__feature-icon">{feature.icon}</div>
                <h3 className="landing__feature-title">{feature.title}</h3>
                <p className="landing__feature-desc">{feature.desc}</p>
                <div className="landing__feature-number">{String(i + 1).padStart(2, '0')}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="landing__bottom-cta section" id="cta-section">
        <motion.div 
          className="container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <div className="landing__bottom-cta-card">
            <h2 className="landing__bottom-cta-title">
              Ready to find your <span className="gradient-text">perfect match</span>?
            </h2>
            <p className="landing__bottom-cta-desc">
              Join thousands of students who have already discovered their dream opportunities with Altezza.
            </p>
            <motion.button
              className="btn-primary landing__cta"
              onClick={() => setShowAuth(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Journey
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="container">
          <div className="landing__footer-inner">
            <div className="landing__footer-brand">
              <span className="gradient-text" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>A</span>
              <span style={{ fontWeight: 600 }}>Altezza</span>
            </div>
            <p className="landing__footer-copy">© 2026 Altezza. Built for students, powered by AI.</p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
