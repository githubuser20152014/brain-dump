import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const ThoughtDumper = () => {
  const [thought, setThought] = useState('');
  const [currentSummary, setCurrentSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [entries, setEntries] = useState(() => {
    // Load entries from localStorage on initial render
    const savedEntries = localStorage.getItem('thoughtEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('thoughtEntries', JSON.stringify(entries));
  }, [entries]);

  const handleThoughtSubmit = async () => {
    if (!thought.trim()) {
      setError('Please enter a thought first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thought,
          timestamp
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Set current summary first
      setCurrentSummary(data.summary);
      
      // Then add to history after a 5-second delay
      setTimeout(() => {
        setEntries(prevEntries => [{
          thought,
          summary: data.summary,
          timestamp
        }, ...prevEntries]);
        
        // Clear the input and summary for new thought
        setThought('');
        setCurrentSummary('');
      }, 5000);
      
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to get summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = (index) => {
    setEntries(prevEntries => prevEntries.filter((_, i) => i !== index));
  };

  const handleClearCurrent = () => {
    setThought('');
    setCurrentSummary('');
    setError(null);
  };

  const ThoughtEntry = ({ entry, onDelete }) => (
    <div className="thought-entry">
      <div className="thought-input-box">
        <div className="header-row">
          <h2>What's on your mind?</h2>
          <button 
            className="delete-btn"
            onClick={onDelete}
            aria-label="Delete entry"
          >
            ×
          </button>
        </div>
        <p className="subtitle">(only one big idea please...)</p>
        <div className="thought-text">
          {entry.thought}
        </div>
        <div className="timestamp">
          {entry.timestamp}
        </div>
      </div>
      
      <div className="thought-summary-box">
        <div className="summary-content">
          {entry.summary.split('\n').map((line, index) => (
            <div key={index} className={`summary-line ${line.startsWith('-') ? 'bullet-point' : 'section-header'}`}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="thought-dumper">
      {/* Current input form */}
      <div className="thought-entry current">
        <div className="thought-input-box">
          <div className="header-row">
            <h2>What's on your mind?</h2>
            {(thought || currentSummary) && (
              <button 
                className="delete-btn"
                onClick={handleClearCurrent}
                aria-label="Clear current entry"
              >
                ×
              </button>
            )}
          </div>
          <p className="subtitle">(only one big idea please...)</p>
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="Share your thought here..."
          />
          <div className="timestamp">
            {format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
          </div>
        </div>
        
        <div className="thought-summary-box">
          <button 
            className="summarize-btn"
            onClick={handleThoughtSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Summarize'}
          </button>
          {error && <div className="error-message">{error}</div>}
          <div className="summary-content">
            {currentSummary ? (
              currentSummary.split('\n').map((line, index) => (
                <div key={index} className={`summary-line ${line.startsWith('-') ? 'bullet-point' : 'section-header'}`}>
                  {line}
                </div>
              ))
            ) : (
              <div className="empty">Summarized content will appear here...</div>
            )}
          </div>
        </div>
      </div>

      {/* History of previous entries */}
      {entries.map((entry, index) => (
        <ThoughtEntry 
          key={index} 
          entry={entry} 
          onDelete={() => handleDeleteEntry(index)}
        />
      ))}
    </div>
  );
};

export default ThoughtDumper; 