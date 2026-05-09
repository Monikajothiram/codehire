import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';

const LANGUAGES = [
  { label: 'Python', value: 'python', id: 71 },
  { label: 'JavaScript', value: 'javascript', id: 63 },
  { label: 'C++', value: 'cpp', id: 54 },
  { label: 'Java', value: 'java', id: 62 },
  { label: 'C', value: 'c', id: 50 },
];

const DEFAULT_CODE = {
  python: '# Collaborative coding session\nprint("Hello, CodeHire!")',
  javascript: '// Collaborative coding session\nconsole.log("Hello, CodeHire!");',
  cpp: '#include<iostream>\nusing namespace std;\nint main(){\n    cout<<"Hello, CodeHire!";\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CodeHire!");\n    }\n}',
  c: '#include<stdio.h>\nint main(){\n    printf("Hello, CodeHire!");\n    return 0;\n}',
};

const socket = io('http://localhost:5000');

function Collaborate() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(DEFAULT_CODE['python']);
  const [connected, setConnected] = useState(false);
  const isRemoteChange = useRef(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) navigate('/login');

    socket.emit('join-room', roomId);
    setConnected(true);

    socket.on('code-update', (newCode) => {
      isRemoteChange.current = true;
      setCode(newCode);
    });

    socket.on('language-update', (newLang) => {
      const found = LANGUAGES.find(l => l.value === newLang);
      if (found) {
        setLanguage(found);
        setCode(DEFAULT_CODE[found.value]);
      }
    });

    return () => {
      socket.off('code-update');
      socket.off('language-update');
    };
  }, [roomId]);

  const handleCodeChange = (val) => {
    if (isRemoteChange.current) {
      isRemoteChange.current = false;
      return;
    }
    setCode(val);
    socket.emit('code-change', { roomId, code: val });
  };

  const handleLanguageChange = (e) => {
    const selected = LANGUAGES.find(l => l.value === e.target.value);
    setLanguage(selected);
    setCode(DEFAULT_CODE[selected.value]);
    socket.emit('language-change', { roomId, language: selected.value });
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Room link copied! Share it with your interviewer.');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <nav className="bg-gray-900 px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-purple-400">CodeHire 🚀</h1>
        <div className="flex items-center gap-4">
          <span className={`text-sm px-3 py-1 rounded-full ${connected ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
            {connected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
          <span className="text-gray-400 text-sm">Room: <span className="text-white font-mono">{roomId}</span></span>
          <button onClick={copyRoomLink} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm transition">
            Copy Room Link
          </button>
          <a href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</a>
        </div>
      </nav>

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
        <span className="text-gray-400 text-sm">Changes sync in real-time with everyone in this room 🔄</span>
      </div>

      <div style={{height: 'calc(100vh - 120px)'}}>
        <Editor
          height="100%"
          language={language.value}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}

export default Collaborate;