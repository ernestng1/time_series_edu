import React, { useState, useEffect } from 'react';
import InteractiveBuilder from './pages/InteractiveBuilder';
import MatchGame from './pages/MatchGame';
import { Sun, Moon, Presentation, Target } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('builder');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference or localStorage on load
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans transition-colors duration-200">
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-50 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 hidden sm:flex">
            Time Series Model
          </h1>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'builder' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <Presentation className="w-4 h-4" />
            <span className="hidden sm:inline">Interactive Builder</span>
            <span className="sm:hidden">Builder</span>
          </button>
          <button
            onClick={() => setActiveTab('match')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'match' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Match the Graph</span>
            <span className="sm:hidden">Match</span>
          </button>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'builder' ? (
          <InteractiveBuilder isDarkMode={isDarkMode} />
        ) : (
          <MatchGame isDarkMode={isDarkMode} />
        )}
      </main>
    </div>
  );
}

export default App;
