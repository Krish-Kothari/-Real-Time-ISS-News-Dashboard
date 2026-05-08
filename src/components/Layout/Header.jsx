import React, { useEffect } from 'react';
import { useThemeStore } from '../../utils/store.js';
import { Moon, Sun } from 'lucide-react';

export const Header = () => {
  const { isDark, toggleTheme } = useThemeStore();

  // Set initial theme on mount
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span>🛰️</span> ISS Dashboard
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Track the International Space Station, latest news & AI chatbot
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="bg-blue-700 hover:bg-blue-500 p-3 rounded-lg transition-all flex items-center gap-2"
            title="Toggle dark mode"
          >
            {isDark ? (
              <>
                <Sun size={20} />
                <span className="text-sm font-medium">Light</span>
              </>
            ) : (
              <>
                <Moon size={20} />
                <span className="text-sm font-medium">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
