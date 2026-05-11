import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditorPage from './pages/Editor';
import Problems from './pages/Problems';
import Solve from './pages/Solve';
import Contests from './pages/Contests';
import Collaborate from './pages/Collaborate';
import VideoCall from './pages/VideoCall';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
              <h1 className="text-5xl font-bold text-purple-400 mb-4">CodeHire 🚀</h1>
              <p className="text-gray-400 text-xl mb-8">The ultimate coding interview platform</p>
              <div className="flex gap-4">
                <a href="/register" className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition text-white">Get Started</a>
                <a href="/login" className="bg-gray-800 hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold transition text-white">Login</a>
              </div>
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<Solve />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/collaborate/:roomId" element={<Collaborate />} />
          <Route path="/video/:roomId" element={<VideoCall />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;