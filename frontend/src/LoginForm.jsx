import React, { useState } from 'react';

export default function LoginForm({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!username || !password) {
            setError('Please enter username and password.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://localhost:3333/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message || `HTTP ${res.status}`);
                return;
            }

            const token = data?.uuid || data?.token;
            if (token) {
                onLogin?.(token);
            } else {
                setError('Login succeeded but no token received.');
            }
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 360, margin: '40px auto', padding: 12 }}>
            <h2 style={{ textAlign: 'center' }}>Sign In</h2>
            <div style={{ marginBottom: 8, marginRight: 25 }}>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ width: '100%', padding: 8 }}
                />
            </div>
            <div style={{ marginBottom: 8, marginRight: 25  }}>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: 8 }}
                />
            </div>
            <div style={{ textAlign: 'center' }}>
                <button type="submit" disabled={loading} style={{ width: '150px', padding: 10 }}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </div>
            {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
        </form>
    );
}