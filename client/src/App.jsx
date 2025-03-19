import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ContestList from './pages/ContestList';
import BookmarkedContests from './pages/BookmarkedContests';
import AddSolution from './pages/AddSolution';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import SolutionsPage from './pages/solutionPage';

function App() {
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    // In a real app, this would be from auth
    const userEmail = localStorage.getItem('userEmail') || '';
    setEmail(userEmail || 'guest@example.com');
  }, []);
  
  const handleSetEmail = (newEmail) => {
    setEmail(newEmail);
    localStorage.setItem('userEmail', newEmail);
  };
  
  return (
    <ThemeProvider>
      <UserProvider email={email}>
        <Router>
          <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar onSetEmail={handleSetEmail} />
            <div className="container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<ContestList />} />
                <Route path="/bookmarks" element={<BookmarkedContests />} />
                <Route path="/solutions" element={<AddSolution />} />
                <Route path="/solutions-page" element={<SolutionsPage />} />
              </Routes>
            </div>
          </div>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;