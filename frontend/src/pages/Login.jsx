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
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black relative overflow-hidden">
      {/* Decorative bg elements */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="glass-panel p-6 md:p-8 w-[92%] max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="relative mb-10 flex flex-col items-center">
            <div className="w-20 h-1.5 bg-cyan-400 rounded-full mb-1"></div>
            <div className="w-1.5 h-16 bg-blue-600 rounded-full"></div>
            <div className="absolute -bottom-3 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-widest uppercase mb-1">TwinCity</h2>
          <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">{isLogin ? 'Operations Portal' : 'Citizen Registration'}</p>
        </div>

        {error && <div className="p-3 mb-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="glass-input" 
                placeholder="John Doe"
                required={!isLogin} 
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="glass-input" 
              placeholder="citizen@smartcity.gov"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="glass-input" 
              placeholder="••••••••"
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary w-full mt-6 py-2.5">
            {isLogin ? 'Authenticate' : 'Initialize ID'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {isLogin ? "Don't have an ID? Register here" : "Already have an ID? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
