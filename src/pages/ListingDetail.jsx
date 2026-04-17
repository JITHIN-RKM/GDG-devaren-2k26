import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getOpportunityById } from '../data/opportunities';
import { streamChat, getCoverLetterPrompt, getColdEmailPrompt, generateTailoredListing } from '../services/aiService';
import MatchingBar from '../components/MatchingBar';
import ChatMessage from '../components/ChatMessage';
import FloatingLines from '../components/FloatingLines';
import './ListingDetail.css';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, profile } = useApp();

  const [opportunity, setOpportunity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [tailoredAnalysis, setTailoredAnalysis] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    const opp = getOpportunityById(id, profile);
    if (!opp) {
      navigate('/dashboard');
      return;
    }
    setOpportunity(opp);

    // Welcome message
    setMessages([{
      role: 'assistant',
      content: `Hi! 👋 I'm your Altezza AI assistant. I can help you with everything about the **${opp.title}** opportunity at **${opp.organization}**.\n\nAsk me anything about the requirements, eligibility, or how to strengthen your application. You can also use the quick actions below to generate a cover letter or draft a cold email!`,
      timestamp: Date.now(),
    }]);

    // Generate AI Tailored analysis
    const fetchTailoredData = async () => {
      setIsTailoring(true);
      const analysis = await generateTailoredListing(opp, profile);
      if (analysis) setTailoredAnalysis(analysis);
      setIsTailoring(false);
    };

    fetchTailoredData();
  }, [id, isLoggedIn, profile, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isStreaming || !opportunity) return;

    const userMsg = { role: 'user', content: text.trim(), timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    // Add placeholder AI message
    const aiMsgId = Date.now() + 1;
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '',
      timestamp: aiMsgId,
      isStreaming: true,
    }]);

    try {
      const allMessages = [...messages, userMsg];
      let fullText = '';

      for await (const chunk of streamChat(allMessages, opportunity)) {
        fullText += chunk;
        setMessages(prev =>
          prev.map(m =>
            m.timestamp === aiMsgId
              ? { ...m, content: fullText }
              : m
          )
        );
      }

      // Mark streaming as done
      setMessages(prev =>
        prev.map(m =>
          m.timestamp === aiMsgId
            ? { ...m, isStreaming: false }
            : m
        )
      );
    } catch (error) {
      setMessages(prev =>
        prev.map(m =>
          m.timestamp === aiMsgId
            ? { ...m, content: `Error: ${error.message}`, isStreaming: false }
            : m
        )
      );
    }

    setIsStreaming(false);
  }, [isStreaming, opportunity, messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleCoverLetter = () => {
    const prompt = getCoverLetterPrompt(opportunity, profile);
    sendMessage(prompt);
  };

  const handleColdEmail = () => {
    const prompt = getColdEmailPrompt(opportunity, profile);
    sendMessage(prompt);
  };

  if (!opportunity) {
    return (
      <div className="listing-loading">
        <div className="listing-loading__layout">
          {/* Skeleton Left Panel */}
          <div className="skeleton-panel">
            <div className="skeleton skeleton-badge" />
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-org" />
            
            <div className="skeleton skeleton-match" />
            
            <div className="skeleton-meta">
              <div className="skeleton skeleton-meta-box" />
              <div className="skeleton skeleton-meta-box" />
              <div className="skeleton skeleton-meta-box" />
            </div>

            <div className="skeleton skeleton-text w-100" />
            <div className="skeleton skeleton-text w-90" />
            <div className="skeleton skeleton-text w-80" />
            <br />
            <div className="skeleton skeleton-text w-100" />
            <div className="skeleton skeleton-text w-60" />
          </div>

          {/* Skeleton Right Panel */}
          <div className="skeleton-panel">
            <div className="skeleton skeleton-badge" style={{ width: '120px', marginBottom: '40px' }} />
            <div className="skeleton skeleton-text w-80" />
            <div className="skeleton skeleton-text w-60" />
            <div className="skeleton skeleton-text w-90" style={{ marginTop: '20px' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="listing" id="listing-detail-page">
      <div className="page-bg-premium" />
      <div className="page-bg-premium__lines">
        <FloatingLines
          enabledWaves={["middle"]}
          lineCount={2}
          lineDistance={25}
          interactive={false}
          parallax={true}
          animationSpeed={0.2}
          gradientStart="#0891b2"
          gradientMid="#94a3b8"
          gradientEnd="#ffffff"
        />
      </div>

      {/* Back Button */}
      <div className="listing__top-bar container">
        <Link to="/dashboard" className="listing__back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="listing__layout container">
        {/* Left Panel — Opportunity Details */}
        <div className="listing__details glass-strong" id="opportunity-details">
          <div className="listing__details-scroll">
            <div className="listing__detail-header">
              <span className={`badge badge-${opportunity.type}`}>
                {opportunity.type}
              </span>
              <h1 className="listing__detail-title">{opportunity.title}</h1>
              <p className="listing__detail-org">{opportunity.organization}</p>
            </div>

            <div className="listing__match-section">
              <MatchingBar score={opportunity.matchScore} size="large" />
            </div>

            {/* AI Advantage Section */}
            {(isTailoring || tailoredAnalysis) && (
              <div className="listing__ai-card">
                <div className="listing__ai-card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ai-pulse">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a10 10 0 0 1 0 20M2 12h20" />
                  </svg>
                  <span>AI Advantage Report</span>
                </div>
                {isTailoring ? (
                  <div className="listing__ai-loading">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <p>Analyzing your profile fit...</p>
                  </div>
                ) : (
                  <div className="listing__ai-content">
                    {tailoredAnalysis.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
                <div className="listing__ai-card-glow" />
              </div>
            )}

            <div className="listing__detail-meta">
              <div className="listing__meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{opportunity.location}</span>
              </div>
              <div className="listing__meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="listing__meta-item listing__meta-item--highlight">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <span>{opportunity.stipend}</span>
              </div>
            </div>

            <div className="listing__section">
              <h3 className="listing__section-title">About</h3>
              <p className="listing__section-text">{opportunity.fullDescription}</p>
            </div>

            <div className="listing__section">
              <h3 className="listing__section-title">Requirements</h3>
              <ul className="listing__requirements">
                {opportunity.requirements.map((req, i) => (
                  <li key={i} className="listing__requirement">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="listing__section">
              <h3 className="listing__section-title">Eligibility</h3>
              <p className="listing__section-text">{opportunity.eligibility}</p>
            </div>

            <div className="listing__section">
              <h3 className="listing__section-title">Tags</h3>
              <div className="listing__tags">
                {opportunity.tags.map(tag => (
                  <span key={tag} className="opp-card__tag">{tag}</span>
                ))}
              </div>
            </div>

            <a
              href={opportunity.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary listing__apply-btn"
              id="apply-now-btn"
            >
              Apply Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Panel — AI Chatbot */}
        <div className="listing__chat glass-strong" id="ai-chatbot">
          <div className="listing__chat-header">
            <div className="listing__chat-header-left">
              <div className="listing__chat-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
                  <circle cx="12" cy="17" r="4" />
                </svg>
              </div>
              <div>
                <h3 className="listing__chat-title">Altezza AI</h3>
                <span className="listing__chat-status">
                  <span className="listing__chat-status-dot" />
                  {isStreaming ? 'Thinking...' : 'Online'}
                </span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="listing__chat-messages">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {isStreaming && messages[messages.length - 1]?.content === '' && (
              <div className="chat-msg chat-msg--ai chat-msg--typing">
                <div className="chat-msg__avatar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="17" r="4" />
                  </svg>
                </div>
                <div className="chat-msg__bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="listing__chat-actions">
            <button
              className="listing__action-btn"
              onClick={handleCoverLetter}
              disabled={isStreaming}
              id="generate-cover-letter-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Generate Cover Letter
            </button>
            <button
              className="listing__action-btn"
              onClick={handleColdEmail}
              disabled={isStreaming}
              id="draft-cold-email-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Draft Cold Email
            </button>
          </div>

          {/* Chat Input */}
          <form className="listing__chat-input-area" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="listing__chat-input"
              placeholder="Ask about this opportunity..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isStreaming}
              id="chat-input"
            />
            <button
              type="submit"
              className="listing__chat-send"
              disabled={!input.trim() || isStreaming}
              id="chat-send-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
