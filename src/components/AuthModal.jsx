import { useState } from 'react';
import { signInWithEmail, signUpWithEmail } from '../services/firebase';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isLogin && !name) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    console.log('AuthModal: Starting authentication', { isLogin, email });

    try {
      const result = isLogin
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password, name);

      console.log('AuthModal: Auth result', result);

      if (result.error) {
        console.error('AuthModal: Authentication error', result.error);
        setError(result.error);
        setLoading(false);
        return;
      }

      if (result.user) {
        console.log('AuthModal: Authentication successful for user:', result.user.email);
        // Context state updates via Firebase onAuthStateChanged listener
        setLoading(false);
        onClose();
      } else {
        console.error('AuthModal: No user returned from authentication');
        setError('Authentication failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('AuthModal: Unexpected error during authentication:', error);
      setError(`An unexpected error occurred: ${error.message || 'Please try again.'}`);
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal modal-content" onClick={e => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={onClose} aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="auth-modal__header">
          <div className="auth-modal__logo gradient-text">A</div>
          <h2 className="auth-modal__title">{isLogin ? 'Welcome back' : 'Create account'}</h2>
          <p className="auth-modal__subtitle">
            {isLogin ? 'Sign in to access your matched opportunities' : 'Start your journey to the perfect opportunity'}
          </p>
        </div>

        <form className="auth-modal__form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-modal__field">
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div className="auth-modal__field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="auth-modal__field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <div className="auth-modal__error">{error}</div>}

          <button
            type="submit"
            className="auth-modal__submit btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-modal__spinner" />
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-modal__footer">
          <span className="auth-modal__toggle-text">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button className="auth-modal__toggle-btn" onClick={toggleMode}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
