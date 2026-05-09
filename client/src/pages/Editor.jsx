import { useState } from 'react';
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
  python: '# Write your Python code here\nprint("Hello, CodeHire!")',
  javascript: '// Write your JavaScript code here\nconsole.log("Hello, CodeHire!");',
  cpp: '#include<iostream>\nusing namespace std;\nint main(){\n    cout<<"Hello, CodeHire!";\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CodeHire!");\n    }\n}',
  c: '#include<stdio.h>\nint main(){\n    printf("Hello, CodeHire!");\n    return 0;\n}',
};

function EditorPage() {
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(DEFAULT_CODE['python']);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (e) => {
    const selected = LANGUAGES.find(l => l.value === e.target.value);
    setLanguage(selected);
    setCode(DEFAULT_CODE[selected.value]);
  };

  const runCode = async () => {
    setLoading(true);
    setOutput('Running...');
    try {
      const res = await axios.post('http://localhost:5000/api/code/run', {
        source_code: code,
        language_id: language.id,
      });
      setOutput(res.data.output || res.data.stderr || 'No output');
    } catch (err) {
      setOutput('Error running code. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-purple-400">CodeHire 🚀</h1>
        <a href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</a>
      </nav>

      <div className="flex flex-col h-[calc(100vh-64px)]">
        <div className="flex items-center gap-4 px-6 py-3 bg-gray-900 border-b border-gray-800">
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
            {loading ? 'Running...' : '▶ Run Code'}
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/2 border-r border-gray-800">
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

          <div className="w-1/2 flex flex-col">
            <div className="px-4 py-2 bg-gray-900 border-b border-gray-800">
              <span className="text-gray-400 text-sm font-semibold">Output</span>
            </div>
            <div className="flex-1 p-4 font-mono text-sm text-green-400 bg-gray-950 overflow-auto whitespace-pre-wrap">
              {output || 'Click "Run Code" to see output here...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;