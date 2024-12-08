import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const login = async (email, password) => {
    // Mock login - accept any valid email format for demo
    if (email && password.length >= 6) {
      const user = {
        id: 'user1',
        email,
        username: email.split('@')[0],
      };
      setCurrentUser(user);
      toast.success('Logged in successfully!');
      navigate('/');
      return Promise.resolve(user);
    }
    toast.error('Invalid credentials. Password must be at least 6 characters.');
    return Promise.reject(new Error('Invalid credentials. Password must be at least 6 characters.'));
  };

  const register = async (email, password, username) => {
    // Mock registration - accept any valid email format for demo
    if (email && password.length >= 6) {
      const user = {
        id: Date.now().toString(),
        email,
        username: username || email.split('@')[0],
      };
      setCurrentUser(user);
      toast.success('Registration successful!');
      navigate('/');
      return Promise.resolve(user);
    }
    toast.error('Invalid registration. Password must be at least 6 characters.');
    return Promise.reject(new Error('Invalid registration. Password must be at least 6 characters.'));
  };

  const logout = () => {
    setCurrentUser(null);
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const loginWithGoogle = async () => {
    // Mock Google login
    const user = {
      id: 'google-user',
      email: 'google@example.com',
      username: 'GoogleUser',
    };
    setCurrentUser(user);
    toast.success('Logged in with Google successfully!');
    navigate('/');
    return Promise.resolve(user);
  };

  const loginWithGithub = async () => {
    // Mock Github login
    const user = {
      id: 'github-user',
      email: 'github@example.com',
      username: 'GithubUser',
    };
    setCurrentUser(user);
    toast.success('Logged in with Github successfully!');
    navigate('/');
    return Promise.resolve(user);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithGithub,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
