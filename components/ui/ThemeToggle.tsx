import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaMoon, FaSun, FaDesktop } from 'react-icons/fa';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-lg rounded-full border border-gray-200 dark:border-gray-700 transition-all duration-300 group hover:rounded-2xl">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        title="Light Mode"
        aria-label="Light Mode"
      >
        <FaSun size={18} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        title="Dark Mode"
        aria-label="Dark Mode"
      >
        <FaMoon size={18} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-full transition-colors ${theme === 'system' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        title="System Theme"
        aria-label="System Theme"
      >
        <FaDesktop size={18} />
      </button>
    </div>
  );
};

export default ThemeToggle;
