import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Contests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) navigate('/login');
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/contests');
      setContests(res.data);
    } catch (err) {
      console.error('Error fetching contests');
    }
    setLoading(false);
  };

  const getStatus = (startTime, duration) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    if (now < start) return { label: 'Upcoming', color: 'text-blue-400' };
    if (now >= start && now <= end) return { label: 'Live', color: 'text-green-400' };
    return { label: 'Ended', color: 'text-gray-400' };
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-purple-400">CodeHire 🚀</h1>
        <a href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</a>
      </nav>

      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6">Contests</h2>
        {loading ? (
          <p className="text-gray-400">Loading contests...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => {
              const status = getStatus(contest.start_time, contest.duration_minutes);
              return (
                <div key={contest.id} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-purple-500 transition">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold">{contest.title}</h3>
                    <span className={`text-sm font-semibold ${status.color}`}>{status.label}</span>
                  </div>
                  <div className="text-gray-400 text-sm mb-4">
                    <p>⏱ Duration: {contest.duration_minutes} minutes</p>
                    <p>📅 Start: {new Date(contest.start_time).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/contests/${contest.id}`)}
                    className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-semibold transition"
                  >
                    View Contest
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Contests;