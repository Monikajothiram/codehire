import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Admin() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('problems');
  const [newProblem, setNewProblem] = useState({
    title: '', description: '', difficulty: 'Easy', testcases: '[{"input":"","output":""}]'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) { navigate('/login'); return; }
    const parsed = JSON.parse(user);
    if (parsed.role !== 'admin') { navigate('/dashboard'); return; }
    fetchProblems();
    fetchUsers();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/problems');
      setProblems(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { authorization: token }
      });
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAddProblem = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/problems', {
        ...newProblem,
        testcases: JSON.parse(newProblem.testcases)
      }, { headers: { authorization: token } });
      setMessage('✅ Problem added successfully!');
      setNewProblem({ title: '', description: '', difficulty: 'Easy', testcases: '[{"input":"","output":""}]' });
      fetchProblems();
    } catch (err) {
      setMessage('❌ Error adding problem');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-purple-400">CodeHire 🚀 <span className="text-sm text-red-400 ml-2">Admin Panel</span></h1>
        <a href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</a>
      </nav>

      <div className="p-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'problems' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            Problems ({problems.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'add' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            Add Problem
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'users' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            Users ({users.length})
          </button>
        </div>

        {message && <div className="mb-6 p-4 bg-gray-900 rounded-xl border border-gray-800">{message}</div>}

        {activeTab === 'problems' && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-gray-400">#</th>
                  <th className="text-left px-6 py-4 text-gray-400">Title</th>
                  <th className="text-left px-6 py-4 text-gray-400">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((p, i) => (
                  <tr key={p.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                    <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                    <td className="px-6 py-4 font-semibold">{p.title}</td>
                    <td className={`px-6 py-4 font-semibold ${p.difficulty === 'Easy' ? 'text-green-400' : p.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                      {p.difficulty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Add New Problem</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Problem Title"
                value={newProblem.title}
                onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
                className="bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <textarea
                placeholder="Problem Description"
                value={newProblem.description}
                onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                rows={4}
                className="bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <select
                value={newProblem.difficulty}
                onChange={(e) => setNewProblem({...newProblem, difficulty: e.target.value})}
                className="bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
              <textarea
                placeholder='Test Cases JSON: [{"input":"","output":""}]'
                value={newProblem.testcases}
                onChange={(e) => setNewProblem({...newProblem, testcases: e.target.value})}
                rows={3}
                className="bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
              />
              <button
                onClick={handleAddProblem}
                className="bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition"
              >
                Add Problem
              </button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-gray-400">#</th>
                  <th className="text-left px-6 py-4 text-gray-400">Name</th>
                  <th className="text-left px-6 py-4 text-gray-400">Email</th>
                  <th className="text-left px-6 py-4 text-gray-400">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                    <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                    <td className="px-6 py-4 font-semibold">{u.name}</td>
                    <td className="px-6 py-4 text-gray-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${u.role === 'admin' ? 'bg-red-900 text-red-400' : 'bg-gray-800 text-gray-400'}`}>
                        {u.role}
                      </span>
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

export default Admin;