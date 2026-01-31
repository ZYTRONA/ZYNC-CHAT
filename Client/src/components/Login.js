import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/chat');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 px-3 sm:px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent"></div>
      <div className="max-w-md w-full bg-dark-800 border-2 border-primary-500/50 shadow-2xl p-6 sm:p-8 hover-lift animate-fadeIn relative z-10" style={{borderRadius: '32px'}}>
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-500 mb-2">ZYNC-CHAT</h1>
          <p className="text-sm sm:text-base text-gray-400">Sign in to start chatting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {error && (
            <div className="bg-red-900/30 border-2 border-red-500/50 text-red-300 px-3 sm:px-4 py-2 sm:py-3 animate-fadeIn text-sm" style={{borderRadius: '24px'}}>
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
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-dark-700 border-2 border-primary-500/40 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-300 hover:border-primary-500/50"
              style={{borderRadius: '24px'}}
              placeholder="Enter your username"
              disabled={loading}
            />
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
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-dark-700 border-2 border-primary-500/40 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-300 hover:border-primary-500/50"
              style={{borderRadius: '24px'}}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-2.5 sm:py-3 px-4 text-sm sm:text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-glow transform hover:scale-105"
            style={{borderRadius: '24px'}}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-sm sm:text-base text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors duration-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
