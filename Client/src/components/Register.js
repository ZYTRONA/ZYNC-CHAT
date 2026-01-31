import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (username.length < 3 || username.length > 20) {
      setError('Username must be 3-20 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setLoading(true);
    const result = await register(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/chat');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent"></div>
      <div className="max-w-md w-full bg-dark-800 border-2 border-primary-500/50 shadow-2xl p-8 hover-lift animate-fadeIn relative z-10" style={{borderRadius: '32px'}}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-500 mb-2">ZYNC-CHAT</h1>
          <p className="text-gray-400">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/30 border-2 border-red-500/50 text-red-300 px-4 py-3 animate-fadeIn" style={{borderRadius: '24px'}}>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700 border-2 border-primary-500/40 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-300 hover:border-primary-500/50"
              style={{borderRadius: '24px'}}
              placeholder="Choose a username"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              3-20 characters, letters, numbers, and underscores only
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700 border-2 border-primary-500/40 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-300 hover:border-primary-500/50"
              style={{borderRadius: '24px'}}
              placeholder="Create a password"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700 border-2 border-primary-500/40 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-300 hover:border-primary-500/50"
              style={{borderRadius: '24px'}}
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-glow transform hover:scale-105"
            style={{borderRadius: '24px'}}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors duration-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
