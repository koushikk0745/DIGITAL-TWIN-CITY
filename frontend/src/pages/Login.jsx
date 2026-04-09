import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AppProviders';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md space-y-8 animate-in fade-in duration-700">
        {/* Branding Area */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black tracking-tighter text-white">
            TWINCITY
          </h1>
          <p className="text-sm font-light tracking-[0.3em] text-slate-400 uppercase">
            {isLogin ? 'Citizen Authentication' : 'Citizen Registration'}
          </p>
        </div>

        {/* Form Area */}
        <div className="bg-[#1e293b]/50 backdrop-blur-xl p-10 rounded-3xl border border-white/5 shadow-2xl space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-slate-600"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-slate-600"
                placeholder="citizen@city.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-slate-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] mt-4"
            >
              {isLogin ? 'Verify Identity' : 'Initialize ID'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              {isLogin ? "New here? Initialize your ID" : "Already have an ID? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
