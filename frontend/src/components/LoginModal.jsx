import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck, AlertCircle, Building2, KeyRound } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('engineer@oilindia.in');
  const [password, setPassword] = useState('password123');
  const [rig, setRig] = useState('Duliajan-Rig-01 (Assam Basin)');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please provide both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate enterprise authentication
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        username: username.split('@')[0],
        email: username,
        rig: rig,
        role: 'Senior Drilling Engineer',
        authTime: new Date().toLocaleTimeString(),
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0b66b3] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center font-bold text-lg">
              W
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">eRTMAC Operator Login</h3>
              <p className="text-xs text-blue-100">Oil India Limited • WellSense AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Operator Email / ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. s.basu@oilindia.in"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Assigned Rig / Location
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <select
                value={rig}
                onChange={(e) => setRig(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="Duliajan-Rig-01 (Assam Basin)">Duliajan Rig-01 (Assam Shelf - Well W-001)</option>
                <option value="Moran-Field-Rig-03">Moran Field Rig-03</option>
                <option value="Nahorkatiya-Rig-02">Nahorkatiya Rig-02</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>Remember this workstation</span>
            </label>
            <span className="text-blue-600 hover:underline cursor-pointer">Security clearance info</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-[#0b66b3] hover:bg-[#095494] text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Sign In to Decision Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 text-center">
          Protected by eRTMAC Institutional Access Policies • SIH 2026 PS 26121
        </div>
      </div>
    </div>
  );
}
