import React, { useEffect, useState } from 'react';

export default function ChuckNorris({ token, onLogout }) {
  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFact = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3333/fact', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setFact(data.fact || data);
    } catch (err) {
      setError(err.message || 'Failed to fetch fact');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div style={{ maxWidth: 640, margin: '24px auto', padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Chuck Norris Fact</h2>
        {onLogout && (
          <button onClick={onLogout} style={{ marginLeft: 12 }}>
            Logout
          </button>
        )}
      </div>

      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 6, minHeight: 80 }}>
        {loading && <div>Loading...</div>}

        {error && <div style={{ color: 'red' }}>{error}</div>}

        {!loading && !error && fact && <div>{fact}</div>}

        {!loading && !error && !fact && <div>No fact loaded yet.</div>}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={fetchFact} disabled={loading}>
          {loading ? 'Please wait...' : 'Get another fact'}
        </button>
      </div>
    </div>
  );
}
