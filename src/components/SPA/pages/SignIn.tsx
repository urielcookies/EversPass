import { SignIn } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

const SignInPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from DOM class instead of localStorage
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    // Listen for theme changes
    const handleThemeChange = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Listen for custom theme change events from Navbar
    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  return (
    <div className={`flex items-center justify-center ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div>
        <SignIn 
          appearance={{
            variables: {
              colorPrimary: '#0ea5e9',
              colorBackground: isDarkMode ? '#020617' : '#ffffff',
              colorInputBackground: isDarkMode ? '#1e293b' : '#f8fafc',
              colorInputText: isDarkMode ? '#f1f5f9' : '#1e293b',
              colorText: isDarkMode ? '#f1f5f9' : '#1e293b',
              borderRadius: '0.5rem',
            },
            elements: {
              card: {
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                boxShadow: isDarkMode 
                  ? '0 10px 25px -3px rgba(0, 0, 0, 0.5)' 
                  : '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
              },
              formButtonPrimary: {
                backgroundColor: '#0ea5e9',
                '&:hover': {
                  backgroundColor: '#0284c7',
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default SignInPage;