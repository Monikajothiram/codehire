import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-purple-400">CodeHire 🚀</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Welcome, <span className="text-white font-semibold">{user?.name}</span></span>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition">Logout</button>
        </div>
      </nav>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-gray-400 text-sm mb-2">Problems Solved</h3>
            <p className="text-4xl font-bold text-purple-400">0</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-gray-400 text-sm mb-2">Contests Joined</h3>
            <p className="text-4xl font-bold text-purple-400">0</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-gray-400 text-sm mb-2">Your Rank</h3>
            <p className="text-4xl font-bold text-purple-400">#--</p>
          </div>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate('/problems')}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition font-semibold">
              Practice Problems
            </button>
            <button
              onClick={() => navigate('/contests')}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition font-semibold">
              Join Contest
            </button>
            <button
              onClick={() => navigate('/editor')}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition font-semibold">
              Code Editor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;