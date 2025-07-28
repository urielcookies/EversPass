// src/components/NavbarInteractive.tsx
import { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react'
import { $authStore } from '@clerk/astro/client'
import { APP_SITE_URL } from '@/lib/constants';

interface NavbarInteractiveProps {
  type: 'theme-toggle' | 'auth-buttons' | 'mobile-menu-toggle' | 'mobile-menu' | 'sessions-link';
  isMobile?: boolean;
  currentPage?: string;
  linkClasses?: string;
  activeLinkClasses?: string;
  inactiveLinkClasses?: string;
}

// Shared mobile menu state (expose globally for AuthNavbar)
let sharedMobileMenuState = false;
const mobileMenuListeners: Array<(isOpen: boolean) => void> = [];

const setSharedMobileMenuState = (isOpen: boolean) => {
  sharedMobileMenuState = isOpen;
  // Also set it globally for AuthNavbar to access
  (window as any).sharedMobileMenuState = isOpen;
  mobileMenuListeners.forEach(listener => listener(isOpen));
};

const NavbarInteractive = ({ 
  type, 
  isMobile = false, 
  currentPage = "/",
  linkClasses = "",
  activeLinkClasses = "",
  inactiveLinkClasses = ""
}: NavbarInteractiveProps) => {
  const { userId } = useStore($authStore);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(sharedMobileMenuState);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Subscribe to shared mobile menu state
  useEffect(() => {
    const listener = (isOpen: boolean) => {
      setIsMobileMenuOpen(isOpen);
    };
    mobileMenuListeners.push(listener);
    
    return () => {
      const index = mobileMenuListeners.indexOf(listener);
      if (index > -1) {
        mobileMenuListeners.splice(index, 1);
      }
    };
  }, []);

  // Click outside handler for mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (type === 'mobile-menu' && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target as Node) &&
          isMobileMenuOpen) {
        
        // Also check if the click was on the mobile menu toggle button
        const toggleButton = document.querySelector('[data-mobile-menu-toggle]');
        if (toggleButton && !toggleButton.contains(event.target as Node)) {
          setSharedMobileMenuState(false);
        }
      }
    };

    if (type === 'mobile-menu' && isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [type, isMobileMenuOpen]);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');

    // Dispatch custom event to notify React components
    window.dispatchEvent(new Event('themeChange'));
  };

  const handleAuthRedirect = (authType: string) => {
    window.location.href = `${APP_SITE_URL}${authType}`;
  };

  const getLinkClassName = (page: string) => {
    return `${linkClasses} ${currentPage === page ? activeLinkClasses : inactiveLinkClasses}`;
  };

  // Helper function to close mobile menu when link is clicked
  const handleLinkClick = () => {
    setSharedMobileMenuState(false);
  };

  // Theme Toggle Component
  if (type === 'theme-toggle') {
    return (
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
  }

  // Auth Buttons Component
  if (type === 'auth-buttons') {
    const authButtonClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300";
    const loginButtonClasses = "text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800";
    const signupButtonClasses = "bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600";

    return (
      <>
        {userId ? (
          <button 
            className={`${authButtonClasses} ${signupButtonClasses}`}
            onClick={() => handleAuthRedirect('/')}>
            Go to App
          </button>
        ) : (
          <div className="flex items-center space-x-3">
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
          </div>
        )}
      </>
    );
  }

  // Mobile Menu Toggle Component
  if (type === 'mobile-menu-toggle') {
    return (
      <button
        data-mobile-menu-toggle
        onClick={() => setSharedMobileMenuState(!isMobileMenuOpen)}
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
    );
  }

  // Sessions Link Component (for desktop nav)
  if (type === 'sessions-link') {
    if (userId) {
      // Return empty div to maintain spacing when user is logged in
      return <div className="hidden"></div>;
    }
    
    return <a href="/sessions" className={getLinkClassName("/sessions")}>Sessions</a>;
  }

  // Mobile Menu Component
  if (type === 'mobile-menu') {
    const authButtonClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300";
    const loginButtonClasses = "text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800";
    const signupButtonClasses = "bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600";

    return (
      <div 
        ref={mobileMenuRef}
        className={`absolute top-16 left-0 right-0 z-40 bg-white dark:bg-slate-900 p-4 lg:hidden transition-all duration-300 ease-in-out transform origin-top ${
          isMobileMenuOpen 
            ? 'opacity-100 scale-100 pointer-events-auto' 
            : 'opacity-0 scale-95 pointer-events-none'
        }`}>
        <div className="space-y-1">
          <a href="/" className={`block ${getLinkClassName("/")}`} onClick={handleLinkClick}>Home</a>
          {!userId && <a href="/sessions" className={`block ${getLinkClassName("/sessions")}`} onClick={handleLinkClick}>Sessions</a>}
          <a href="/pricing" className={`block ${getLinkClassName("/pricing")}`} onClick={handleLinkClick}>Pricing</a>
          <hr className="border-t border-slate-200 dark:border-slate-700 my-2" />
          
          {/* Auth buttons for mobile dropdown */}
          <div className="pt-4 space-y-2">
            {userId ? (
              <button 
                className={`block w-full text-left ${authButtonClasses} ${loginButtonClasses}`}
                onClick={() => {
                  handleLinkClick();
                  handleAuthRedirect('/');
                }}>
                Go to App
              </button>
            ) : (
              <>
                <button 
                  className={`block w-full text-left ${authButtonClasses} ${loginButtonClasses}`}
                  onClick={() => {
                    handleLinkClick();
                    handleAuthRedirect('/signin');
                  }}>
                  Login
                </button>
                <button 
                  className={`block w-full text-left ${authButtonClasses} ${signupButtonClasses}`}
                  onClick={() => {
                    handleLinkClick();
                    handleAuthRedirect('/signup');
                  }}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default NavbarInteractive;