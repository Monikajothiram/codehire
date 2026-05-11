import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) navigate('/login');
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await API.get('/api/problems');
      setProblems(res.data);
    } catch (err) {
      console.error('Error fetching problems');
    }
    setLoading(false);
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Easy') return 'text-green-400';
    if (difficulty === 'Medium') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-purple-400">CodeHire 🚀</h1>
        <a href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</a>
      </nav>

      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6">Practice Problems</h2>
        {loading ? (
          <p className="text-gray-400">Loading problems...</p>
        ) : (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold">#</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold">Title</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold">Difficulty</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <tr key={problem.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                    <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                    <td className="px-6 py-4 font-semibold">{problem.title}</td>
                    <td className={`px-6 py-4 font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/problems/${problem.id}`)}
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm transition"
                      >
                        Solve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Problems;