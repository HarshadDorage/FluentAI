import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Simple Icons
const Icons = {
  Home: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Mic: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
  Chart: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Sun: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Moon: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 24.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  Daily: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
};

const Layout: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const toggleTheme = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors duration-200 ${
      isActive ? 'text-primary dark:text-secondary' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
    }`;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Top Bar for Desktop/Tablet branding */}
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-sm z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
            F
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            FluentAI
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          aria-label="Toggle Theme"
        >
          {settings.darkMode ? <Icons.Sun /> : <Icons.Moon />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 scroll-smooth">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation (Mobile/Tablet) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 h-16 z-50">
        <div className="flex justify-around items-center h-full">
          <NavLink to="/" className={navClass}>
            <Icons.Home />
            <span className="mt-1">Home</span>
          </NavLink>
          <NavLink to="/topics" className={navClass}>
            <Icons.Mic />
            <span className="mt-1">Practice</span>
          </NavLink>
          <NavLink to="/daily" className={navClass}>
            <Icons.Daily />
            <span className="mt-1">Daily</span>
          </NavLink>
          <NavLink to="/dashboard" className={navClass}>
            <Icons.Chart />
            <span className="mt-1">Progress</span>
          </NavLink>
        </div>
      </nav>

      {/* Desktop Navigation - Hidden on Mobile */}
      <nav className="hidden md:flex fixed left-0 top-16 bottom-0 w-20 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 items-center py-6 z-40 space-y-8">
        <NavLink to="/" className={navClass}>
          <div className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"><Icons.Home /></div>
        </NavLink>
        <NavLink to="/topics" className={navClass}>
          <div className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"><Icons.Mic /></div>
        </NavLink>
        <NavLink to="/daily" className={navClass}>
          <div className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"><Icons.Daily /></div>
        </NavLink>
        <NavLink to="/dashboard" className={navClass}>
          <div className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"><Icons.Chart /></div>
        </NavLink>
      </nav>
      
      {/* Desktop margin adjustment */}
      <div className="hidden md:block fixed top-0 bottom-0 left-0 w-20 pointer-events-none"></div>
    </div>
  );
};

export default Layout;