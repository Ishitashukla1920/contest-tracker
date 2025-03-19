import React, { createContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(savedTheme === "true" || (savedTheme === null && prefersDark));
  }, []);

  useEffect(() => {
    // Apply theme using CSS variables
    const root = document.documentElement;
    
    if (darkMode) {
      // Dark theme variables
      root.style.setProperty('--background-color', '#121212');
      root.style.setProperty('--text-color', '#f5f5f5');
      root.style.setProperty('--nav-background', '#1e1e1e');
      root.style.setProperty('--card-background', '#2d2d2d');
      root.style.setProperty('--border-color', '#444444');
      root.style.setProperty('--primary-color', '#3b82f6');
      root.style.setProperty('--hover-color', 'rgba(255, 255, 255, 0.1)');
    } else {
      // Light theme variables
      root.style.setProperty('--background-color', '#f9fafb');
      root.style.setProperty('--text-color', '#111827');
      root.style.setProperty('--nav-background', '#ffffff');
      root.style.setProperty('--card-background', '#ffffff');
      root.style.setProperty('--border-color', '#e5e7eb');
      root.style.setProperty('--primary-color', '#2563eb');
      root.style.setProperty('--hover-color', 'rgba(0, 0, 0, 0.05)');
    }
    
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };