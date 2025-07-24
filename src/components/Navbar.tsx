import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react'
import { $authStore } from '@clerk/astro/client'

const Navbar = ({ currentPage = "/" }) => {
  const { userId } = useStore($authStore)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsLoginModalOpen(false);
        setIsSignupModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Handle body overflow for modals
  useEffect(() => {
    if (isLoginModalOpen || isSignupModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoginModalOpen, isSignupModalOpen]);

  const toggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');

      // Dispatch custom event to notify React components
      window.dispatchEvent(new Event('themeChange'));
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const showLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
    closeMobileMenu();
  };

  const showSignupModal = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
    closeMobileMenu();
  };

  const handleAuthRedirect = (type) => {
    const isDev = process.env.NODE_ENV === 'development';
    const baseUrl = isDev ? 'http://app.localhost:4321' : 'https://app.everspass.com';
    window.location.href = `${baseUrl}/${type}`;
  };

  // CSS classes
  const linkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300";
  const activeLinkClasses = "bg-slate-200 dark:bg-slate-700 text-sky-600 dark:text-sky-400";
  const inactiveLinkClasses = "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100";
  const authButtonClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300";
  const loginButtonClasses = "text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800";
  const signupButtonClasses = "bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600";

  const getLinkClassName = (page) => {
    return `${linkClasses} ${currentPage === page ? activeLinkClasses : inactiveLinkClasses}`;
  };

  const ThemeToggleIcon = ({ isMobile = false }) => (
    <button
      onClick={toggleTheme}
      className={`${isMobile ? 'lg:hidden' : 'hidden lg:block'} p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-sky-500 ${!isMobile ? 'ml-4' : ''}`}>
      <span className="sr-only">Toggle theme</span>
      {isDarkMode ? (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );

  return (
    <>
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 relative">

            {/* LEFT GROUP: Navigation Links (Desktop) + Theme Toggle (Mobile) */}
            <div className="flex items-center flex-shrink-0">
              {/* Theme Toggle for Mobile/Tablet */}
              <ThemeToggleIcon isMobile={true} />
              
              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center space-x-4">
                <a href="/" className={getLinkClassName("/")}>Home</a>
                {!userId && <a href="/sessions" className={getLinkClassName("/sessions")}>Sessions</a>}
                <a href="/pricing" className={getLinkClassName("/pricing")}>Pricing</a>
              </div>
            </div>

            {/* CENTER GROUP: EversPass Logo/Title */}
            {/* Desktop Centered */}
            <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 pointer-events-none">
              <span className="text-2xl font-bold text-slate-800 dark:text-white pointer-events-auto">EversPass</span>
            </div>
            {/* Mobile/Medium Centered */}
            <div className="flex lg:hidden flex-grow justify-center">
              <span className="text-2xl font-bold text-slate-800 dark:text-white">EversPass</span>
            </div>

            {/* RIGHT GROUP: Auth Buttons, Theme Toggle, Mobile Menu Toggle */}
            <div className="flex items-center flex-shrink-0">
              {/* Auth buttons for desktop */}
              <div className="hidden lg:flex items-center space-x-3">
                {userId
                ? (
                  <button 
                    className={`${authButtonClasses} ${signupButtonClasses}`}
                    onClick={() => handleAuthRedirect('/')}>
                    Go to App
                  </button>
                )
                : (
                  <>
                    <button 
                      className={`${authButtonClasses} ${loginButtonClasses}`}
                      onClick={() => handleAuthRedirect('signin')}>
                        Login
                    </button>
                    <button 
                      className={`${authButtonClasses} ${signupButtonClasses}`}
                      onClick={() => handleAuthRedirect('signup')}>
                        Sign Up
                    </button>
                  </>
                )}
  
              </div>

              {/* Theme Toggle for Desktop */}
              <ThemeToggleIcon />
              
              {/* Mobile Menu Toggle */}
              <div className="flex lg:hidden ml-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        <div className={`absolute top-16 left-0 right-0 z-40 bg-white dark:bg-slate-900 p-4 lg:hidden transition-all duration-300 ease-in-out transform origin-top ${
          isMobileMenuOpen 
            ? 'opacity-100 scale-100 pointer-events-auto' 
            : 'opacity-0 scale-95 pointer-events-none'
        }`}>
          <div className="space-y-1">
            <a href="/" className={`block ${getLinkClassName("/")}`}>Home</a>
            {!userId && <a href="/sessions" className={`block ${getLinkClassName("/sessions")}`}>Sessions</a>}
            <a href="/pricing" className={`block ${getLinkClassName("/pricing")}`}>Pricing</a>
            <hr className="border-t border-slate-200 dark:border-slate-700 my-2" />
            
            {/* Auth buttons for mobile dropdown */}
            <div className="pt-4 space-y-2">
              {userId
                ? (
                  <button 
                    className={`block w-full text-left ${authButtonClasses} ${loginButtonClasses}`}
                    onClick={() => handleAuthRedirect('/')}>
                    Go to App
                  </button>
                )
                : (
                  <>
                    <button 
                      className={`block w-full text-left ${authButtonClasses} ${loginButtonClasses}`}
                      onClick={() => handleAuthRedirect('/signin')}>
                      Login
                    </button>
                    <button 
                      className={`block w-full text-left ${authButtonClasses} ${signupButtonClasses}`}
                      onClick={() => handleAuthRedirect('/signup')}>
                      Sign Up
                    </button>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;