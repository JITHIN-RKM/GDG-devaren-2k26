import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { saveUserProfile } from '../services/firebase';
import FloatingLines from '../components/FloatingLines';
import './Onboarding.css';

const INTEREST_OPTIONS = [
  'AI/ML', 'Web Development', 'Mobile Development', 'Data Science',
  'Cybersecurity', 'Cloud Computing', 'Blockchain', 'Design/UX',
  'DevOps', 'Robotics', 'Game Development', 'Research',
  'Finance/Fintech', 'Product Management', 'Open Source', 'Social Impact',
];

const YEAR_OPTIONS = [
  { value: 'freshman', label: 'Freshman (1st Year)' },
  { value: 'sophomore', label: 'Sophomore (2nd Year)' },
  { value: 'junior', label: 'Junior (3rd Year)' },
  { value: 'senior', label: 'Senior (4th Year)' },
  { value: 'masters', label: 'Master\'s Student' },
  { value: 'phd', label: 'PhD Student' },
];

export default function Onboarding() {
  const { setProfile, profile, user } = useApp();
  const navigate = useNavigate();

  const [major, setMajor] = useState(profile.major || '');
  const [interests, setInterests] = useState(profile.interests || []);
  const [year, setYear] = useState(profile.year || '');
  const [cgpa, setCgpa] = useState(profile.cgpa || '');
  const [stateName, setStateName] = useState(profile.state || '');
  const [county, setCounty] = useState(profile.county || '');
  const [college, setCollege] = useState(profile.college || '');
  
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 7;

  const toggleInterest = (interest) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : prev.length < 5 ? [...prev, interest] : prev
    );
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !major.trim()) newErrors.major = 'Please enter your major.';
    if (step === 2 && interests.length === 0) newErrors.interests = 'Select at least one interest.';
    if (step === 3 && !year) newErrors.year = 'Please select your year.';
    if (step === 4) {
      if (!cgpa) newErrors.cgpa = 'Please enter your CGPA.';
      else if (parseFloat(cgpa) < 0 || parseFloat(cgpa) > 10) newErrors.cgpa = 'CGPA must be between 0 and 10.';
    }
    if (step === 5 && !stateName.trim()) newErrors.state = 'Please enter your state.';
    if (step === 6 && !county.trim()) newErrors.county = 'Please enter your county/district.';
    if (step === 7 && !college.trim()) newErrors.college = 'Please enter your college name.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSaving(true);

    const profileData = { 
      major, 
      interests, 
      year, 
      cgpa, 
      state: stateName, 
      county, 
      college 
    };

    try {
      if (user) {
        await saveUserProfile(user.uid, profileData);
      }
      setProfile(profileData);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ submit: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="onboarding" id="onboarding-page">
      <div className="page-bg-premium" />
      <div className="page-bg-premium__lines">
        <FloatingLines
          enabledWaves={["top", "bottom"]}
          lineCount={2}
          lineDistance={18}
          interactive={false}
          parallax={true}
          animationSpeed={0.3}
          gradientStart="#0891b2"
          gradientMid="#94a3b8"
          gradientEnd="#ffffff"
        />
      </div>

      <div className="onboarding__container">
        {/* Progress Bar */}
        <div className="onboarding__progress">
          <div className="onboarding__progress-bar">
            <div
              className="onboarding__progress-fill"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          <span className="onboarding__progress-text">Step {step} of {totalSteps}</span>
        </div>

        <div className="onboarding__card glass-strong">
          {/* Step 1: Major */}
          {step === 1 && (
            <div className="onboarding__step" key="step1">
              <div className="onboarding__step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 10 3 12 0v-5" />
                </svg>
              </div>
              <h2 className="onboarding__step-title">What's your major?</h2>
              <p className="onboarding__step-desc">Tell us your field of study so we can find the most relevant opportunities.</p>

              <div className="onboarding__field">
                <input
                  id="major-input"
                  type="text"
                  className="onboarding__input"
                  placeholder="e.g. Computer Science, Data Science, Design..."
                  value={major}
                  onChange={e => setMajor(e.target.value)}
                  autoFocus
                />
                {errors.major && <span className="onboarding__error">{errors.major}</span>}
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div className="onboarding__step" key="step2">
              <div className="onboarding__step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h2 className="onboarding__step-title">What are you interested in?</h2>
              <p className="onboarding__step-desc">Pick up to 5 areas that excite you most. This shapes your opportunity feed.</p>

              <div className="onboarding__tags">
                {INTEREST_OPTIONS.map(interest => (
                  <button
                    key={interest}
                    className={`onboarding__tag ${interests.includes(interest) ? 'onboarding__tag--active' : ''}`}
                    onClick={() => toggleInterest(interest)}
                    type="button"
                  >
                    {interest}
                    {interests.includes(interest) && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <span className="onboarding__tag-count">{interests.length}/5 selected</span>
              {errors.interests && <span className="onboarding__error">{errors.interests}</span>}
            </div>
          )}

          {/* Step 3: Year */}
          {step === 3 && (
            <div className="onboarding__step" key="step3">
              <div className="onboarding__step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h2 className="onboarding__step-title">What year are you in?</h2>
              <p className="onboarding__step-desc">This helps us find opportunities suited to your academic stage.</p>

              <div className="onboarding__year-grid">
                {YEAR_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`onboarding__year-card ${year === opt.value ? 'onboarding__year-card--active' : ''}`}
                    onClick={() => setYear(opt.value)}
                    type="button"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.year && <span className="onboarding__error">{errors.year}</span>}
            </div>
          )}

          {/* Step 4: CGPA */}
          {step === 4 && (
            <div className="onboarding__step" key="step4">
              <div className="onboarding__step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h2 className="onboarding__step-title">What's your current CGPA?</h2>
              <p className="onboarding__step-desc">On a scale of 0 to 10. This helps filter academic eligibility requirements.</p>

              <div className="onboarding__field">
                <input
                  id="cgpa-input"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  className="onboarding__input onboarding__input--cgpa"
                  placeholder="e.g. 8.5"
                  value={cgpa}
                  onChange={e => setCgpa(e.target.value)}
                  autoFocus
                />
                {cgpa && (
                  <div className="onboarding__cgpa-visual">
                    <div className="onboarding__cgpa-bar">
                      <div
                        className="onboarding__cgpa-fill"
                        style={{ width: `${Math.min(parseFloat(cgpa) || 0, 10) * 10}%` }}
                      />
                    </div>
                    <span className="onboarding__cgpa-label">{cgpa} / 10</span>
                  </div>
                )}
                {errors.cgpa && <span className="onboarding__error">{errors.cgpa}</span>}
              </div>
            </div>
          )}

          {/* Step 5: State */}
          {step === 5 && (
            <div className="onboarding__step" key="step5">
              <div className="onboarding__step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h2 className="onboarding__step-title">What state do you live in?</h2>
              <p className="onboarding__step-desc">We'll use this to find local internships and events in your area.</p>

              <div className="onboarding__field">
                <input
                  id="state-input"
                  type="text"
                  className="onboarding__input"
                  placeholder="e.g. California, New York, Delhi..."
                  value={stateName}
                  onChange={e => setStateName(e.target.value)}
                  autoFocus
                />
                {errors.state && <span className="onboarding__error">{errors.state}</span>}
              </div>
            </div>
          )}

          {/* Step 6: County */}
          {step === 6 && (
            <div className="onboarding__step" key="step6">
              <div className="onboarding__step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 21h18" />
                  <path d="M3 7v1a3 3 0 0 0 6 0V7m6 0v1a3 3 0 0 0 6 0V7" />
                  <path d="M9 17h6" />
                  <path d="M10 21V14a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7" />
                </svg>
              </div>
              <h2 className="onboarding__step-title">And the county or district?</h2>
              <p className="onboarding__step-desc">This helps us narrow down highly localized scholarship and job offerings.</p>

              <div className="onboarding__field">
                <input
                  id="county-input"
                  type="text"
                  className="onboarding__input"
                  placeholder="e.g. Orange County, Brooklyn, West Mumbai..."
                  value={county}
                  onChange={e => setCounty(e.target.value)}
                  autoFocus
                />
                {errors.county && <span className="onboarding__error">{errors.county}</span>}
              </div>
            </div>
          )}

          {/* Step 7: College */}
          {step === 7 && (
            <div className="onboarding__step" key="step7">
              <div className="onboarding__step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h2 className="onboarding__step-title">Lastly, which college?</h2>
              <p className="onboarding__step-desc">Some opportunities are exclusive to specific university partners.</p>

              <div className="onboarding__field">
                <input
                  id="college-input"
                  type="text"
                  className="onboarding__input"
                  placeholder="e.g. Stanford University, IIT Bombay, NYU..."
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  autoFocus
                />
                {errors.college && <span className="onboarding__error">{errors.college}</span>}
                {errors.submit && <span className="onboarding__error">{errors.submit}</span>}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="onboarding__nav">
            {step > 1 && (
              <button className="btn-secondary onboarding__back" onClick={handleBack} type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < totalSteps ? (
              <button className="btn-primary onboarding__next" onClick={handleNext} type="button">
                Continue
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ) : (
              <button className="btn-primary onboarding__submit" onClick={handleSubmit} type="button" id="find-matches-btn" disabled={isSaving}>
                {isSaving ? (
                  <span className="auth-modal__spinner" />
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    Find My Matches
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
