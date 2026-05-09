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
          <Route path="/" element={<h1 className="text-4xl font-bold text-center pt-20 text-purple-400">Welcome to CodeHire 🚀</h1>} />
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