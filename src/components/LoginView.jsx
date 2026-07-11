import React, { useState } from 'react';
import { User, Lock, ShieldAlert, Sun, Droplet, Zap, ArrowRight } from 'lucide-react';

const LoginView = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate small latency for premium login feel
    setTimeout(() => {
      const res = onLogin(username, password);
      setIsLoading(false);
      if (!res.success) {
        setError(res.error || 'Invalid credentials');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-900 relative overflow-hidden font-sans select-none">
      
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/20 rounded-full filter blur-[80px] animate-pulse duration-[6s] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-[100px] animate-pulse duration-[8s] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-amber-500/15 rounded-full filter blur-[90px] animate-pulse duration-[7s] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

      {/* Form Container */}
      <div className="relative w-full max-w-md p-2 sm:p-4 z-10 animate-fade-in">
        
        {/* Logo / Header Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-sky-500 to-amber-500 text-white font-bold text-2xl shadow-xl shadow-indigo-950/50 mb-3 animate-bounce duration-[3s]">
            SK
          </div>
          <h2 className="font-display font-black text-2xl tracking-tight text-white">
            SK POWERTECH
          </h2>
          <p className="text-xs text-slate-400 font-medium tracking-wide mt-1 uppercase">
            Business Portal & Ledger
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          <h3 className="font-display font-bold text-lg text-white mb-1">
            Welcome back
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Sign in to manage sales, commission, and installation tickets.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs animate-shake">
                <ShieldAlert size={16} className="shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/80 focus:bg-slate-900 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all duration-150"
                  placeholder="Enter administrator username"
                  autoComplete="off"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 focus:border-indigo-500/80 focus:bg-slate-900 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all duration-150"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 mt-6"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Product Badges context */}
          <div className="mt-8 border-t border-slate-800/80 pt-6">
            <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3">
              <span>Managed Portfolios</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center space-x-1 p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/10 text-emerald-400">
                <Sun size={12} className="shrink-0" />
                <span className="text-[9px] font-bold truncate">Solar</span>
              </div>
              <div className="flex items-center space-x-1 p-2 rounded-lg bg-sky-950/20 border border-sky-500/10 text-sky-400">
                <Droplet size={12} className="shrink-0" />
                <span className="text-[9px] font-bold truncate">Purifier</span>
              </div>
              <div className="flex items-center space-x-1 p-2 rounded-lg bg-amber-950/20 border border-amber-500/10 text-amber-400">
                <Zap size={12} className="shrink-0" />
                <span className="text-[9px] font-bold truncate">UPS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Warning Notice / Help Box */}
        <div className="mt-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            Demo Credentials
          </p>
          <div className="mt-1 text-xs text-slate-300 font-mono">
            <span className="text-slate-400">User:</span> admin &nbsp;|&nbsp; <span className="text-slate-400">Pass:</span> admin123
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginView;
