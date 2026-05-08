import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import Header from './components/Layout/Header.jsx';
import Tabs from './components/Layout/Tabs.jsx';
import Chatbot from './components/Chatbot/Chatbot.jsx';
import { useThemeStore } from './utils/store.js';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

function App() {
  const { isDark } = useThemeStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs />
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-600 dark:text-slate-400">
            <p>© 2026 ISS Dashboard • Real-time tracking with AI assistance</p>
          </div>
        </footer>

        {/* Chatbot */}
        <Chatbot />

        {/* Toast Notifications */}
        <ToastContainer
          theme={isDark ? 'dark' : 'light'}
          position="top-right"
          autoClose={3000}
        />
      </div>
    </div>
  );
}

export default App;
