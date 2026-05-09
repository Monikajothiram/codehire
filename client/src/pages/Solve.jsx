import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const LANGUAGES = [
  { label: 'Python', value: 'python', id: 71 },
  { label: 'JavaScript', value: 'javascript', id: 63 },
  { label: 'C++', value: 'cpp', id: 54 },
  { label: 'Java', value: 'java', id: 62 },
  { label: 'C', value: 'c', id: 50 },
];

const DEFAULT_CODE = {
  python: '# Write your solution here\n',
  javascript: '// Write your solution here\n',
  cpp: '#include<iostream>\nusing namespace std;\nint main(){\n    // Write your solution here\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}',
  c: '#include<stdio.h>\nint main(){\n    // Write your solution here\n    return 0;\n}',
};

function Solve() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(DEFAULT_CODE['python']);
  const [output, setOutput] = useState('');
  const [verdict, setVerdict] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) navigate('/login');
    fetchProblem();
  }, []);

  const fetchProblem = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/problems/${id}`);
      setProblem(res.data);
    } catch (err) {
      console.error('Error fetching problem');
    }
  };

  const handleLanguageChange = (e) => {
    const selected = LANGUAGES.find(l => l.value === e.target.value);
    setLanguage(selected);
    setCode(DEFAULT_CODE[selected.value]);
  };

  const runCode = async () => {
    setLoading(true);
    setOutput('Running...');
    setVerdict('');
    try {
      const res = await axios.post('http://localhost:5000/api/code/run', {
        source_code: code,
        language_id: language.id,
      });
      const result = res.data.output?.trim();
      setOutput(result);

      if (problem?.testcases) {
        const testcases = typeof problem.testcases === 'string'
          ? JSON.parse(problem.testcases)
          : problem.testcases;
        const expected = testcases[0]?.output?.trim();
        if (result === expected) {
          setVerdict('✅ Accepted!');
        } else {
          setVerdict(`❌ Wrong Answer. Expected: ${expected}`);
        }
      }
    } catch (err) {
      setOutput('Error running code.');
    }
    setLoading(false);
  };

  if (!problem) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-purple-400">CodeHire 🚀</h1>
        <a href="/problems" className="text-gray-400 hover:text-white transition">← Problems</a>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 p-6 overflow-auto border-r border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold">{problem.title}</h2>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              problem.difficulty === 'Easy' ? 'bg-green-900 text-green-400' :
              problem.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-400' :
              'bg-red-900 text-red-400'
            }`}>{problem.difficulty}</span>
          </div>
          <p className="text-gray-300 leading-relaxed mb-6">{problem.description}</p>

          {problem.testcases && (
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Example Test Case</h3>
              {(typeof problem.testcases === 'string' ? JSON.parse(problem.testcases) : problem.testcases).map((tc, i) => (
                <div key={i} className="mb-2">
                  <p className="text-sm text-gray-400">Input: <span className="text-white font-mono">{tc.input}</span></p>
                  <p className="text-sm text-gray-400">Output: <span className="text-white font-mono">{tc.output}</span></p>
                </div>
              ))}
            </div>
          )}

          {verdict && (
            <div className={`mt-4 p-4 rounded-xl font-semibold ${
              verdict.includes('✅') ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
            }`}>
              {verdict}
            </div>
          )}
        </div>

        <div className="w-1/2 flex flex-col">
          <div className="flex items-center gap-4 px-4 py-3 bg-gray-900 border-b border-gray-800">
            <select
              value={language.value}
              onChange={handleLanguageChange}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {LANGUAGES.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <button
              onClick={runCode}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition"
            >
              {loading ? 'Running...' : '▶ Run & Check'}
            </button>
          </div>

          <div className="flex-1 overflow-hidden" style={{height: '60%'}}>
            <Editor
              height="100%"
              language={language.value}
              value={code}
              onChange={(val) => setCode(val)}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          <div className="border-t border-gray-800" style={{height: '40%'}}>
            <div className="px-4 py-2 bg-gray-900 border-b border-gray-800">
              <span className="text-gray-400 text-sm font-semibold">Output</span>
            </div>
            <div className="p-4 font-mono text-sm text-green-400 bg-gray-950 overflow-auto h-full whitespace-pre-wrap">
              {output || 'Click "Run & Check" to see output...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Solve;