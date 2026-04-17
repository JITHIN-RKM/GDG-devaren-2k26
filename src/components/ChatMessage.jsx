import './ChatMessage.css';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`chat-msg ${isUser ? 'chat-msg--user' : 'chat-msg--ai'}`}>
      {!isUser && (
        <div className="chat-msg__avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
            <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
            <circle cx="12" cy="17" r="4" />
          </svg>
        </div>
      )}
      <div className="chat-msg__bubble">
        <div className="chat-msg__content">
          {message.content.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < message.content.split('\n').length - 1 && <br />}
            </span>
          ))}
        </div>
        {message.timestamp && (
          <span className="chat-msg__time">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}
