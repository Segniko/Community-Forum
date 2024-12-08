import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './components/pages/Home';
import PostDetail from './components/pages/PostDetail';
import CreatePost from './components/pages/CreatePost';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import { PostProvider } from './context/PostContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PostProvider>
          <ThemeProvider>
            <NotificationProvider>
              <div className="min-h-screen">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/post/:postId" element={<PostDetail />} />
                  <Route path="/create" element={<CreatePost />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
                <Toaster position="bottom-right" />
              </div>
            </NotificationProvider>
          </ThemeProvider>
        </PostProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;