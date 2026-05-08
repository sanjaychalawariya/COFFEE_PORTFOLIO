import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('adminToken'));
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [portfolioData, setPortfolioData] = useState('');
  const [status, setStatus] = useState('');

  // Cursor Fix
  useEffect(() => {
    document.body.style.cursor = 'default';
    return () => { document.body.style.cursor = 'none'; };
  }, []);

  // Fetch Protected Data
  useEffect(() => {
    if (!isAuthenticated) return;
    const token = sessionStorage.getItem('adminToken');

    fetch('/api/messages', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => setMessages(data))
      .catch(console.error);

    fetch('/api/portfolio-data')
      .then(res => res.json())
      .then(data => setPortfolioData(JSON.stringify(data, null, 2)))
      .catch(console.error);
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        sessionStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Invalid password');
      }
    } catch(err) {
      setAuthError('Connection error');
    }
  };

  const handleSaveData = async () => {
    try {
      const parsed = JSON.parse(portfolioData); // Validate JSON
      setStatus('Saving...');
      const token = sessionStorage.getItem('adminToken');
      
      const res = await fetch('/api/portfolio-data', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(parsed)
      });
      if (res.ok) setStatus('Saved successfully!');
      else setStatus('Error saving data');
      
      setTimeout(() => setStatus(''), 3000);
    } catch (e) {
      setStatus('Invalid JSON format');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a0d04] flex items-center justify-center font-mono">
        <form onSubmit={handleLogin} className="bg-[#2a1d14] p-8 border border-[#C68642] rounded-xl flex flex-col gap-4">
          <h2 className="text-[#C68642] text-xl mb-2 text-center">Admin Access</h2>
          <input 
            type="password"
            placeholder="Enter password..."
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
            className="p-3 rounded bg-[#0a0502] border border-[#C68642] text-white outline-none"
          />
          {authError && <p className="text-red-400 text-sm">{authError}</p>}
          <button type="submit" className="bg-[#C68642] text-black font-bold p-3 rounded hover:bg-yellow-500 transition">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a0d04] text-[#fdf5e6] p-8 font-mono">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end border-b border-[#C68642] pb-4 mb-8">
          <h1 className="text-4xl">Admin Dashboard</h1>
          <button onClick={handleLogout} className="text-sm border border-red-400 text-red-400 px-3 py-1 rounded hover:bg-red-400 hover:text-black transition">
            Logout
          </button>
        </div>
        
        <div className="flex gap-4 mb-8">
          <button 
            className={`px-4 py-2 border rounded ${activeTab === 'messages' ? 'bg-[#C68642] text-black border-[#C68642]' : 'border-[#C68642] text-[#C68642]'}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button 
            className={`px-4 py-2 border rounded ${activeTab === 'data' ? 'bg-[#C68642] text-black border-[#C68642]' : 'border-[#C68642] text-[#C68642]'}`}
            onClick={() => setActiveTab('data')}
          >
            Edit Portfolio Data
          </button>
          <a href="/" className="px-4 py-2 border border-white rounded ml-auto hover:bg-white hover:text-black transition">
            View Live Site
          </a>
        </div>

        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? <p>No messages yet.</p> : null}
            {messages.slice().reverse().map((msg, i) => (
              <div key={i} className="border border-[#C68642] bg-[#2a1d14] p-4 rounded-xl">
                <div className="flex justify-between text-sm mb-2 opacity-70">
                  <span>From: {msg.name} ({msg.email})</span>
                  <span>{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <p className="whitespace-pre-wrap">{msg.message}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'data' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="opacity-70">Edit your data.json content here (must be valid JSON):</p>
              <div className="flex items-center gap-4">
                {status && <span className="text-yellow-400">{status}</span>}
                <button 
                  onClick={handleSaveData}
                  className="bg-[#C68642] text-black px-6 py-2 rounded font-bold hover:bg-yellow-500 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
            
            <textarea 
              value={portfolioData}
              onChange={(e) => setPortfolioData(e.target.value)}
              className="w-full h-[600px] bg-[#0a0502] text-green-400 p-4 font-mono text-sm border-2 border-[#C68642] rounded-xl outline-none"
              spellCheck="false"
            />
          </div>
        )}

      </div>
    </div>
  );
}
