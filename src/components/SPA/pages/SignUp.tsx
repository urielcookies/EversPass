import { SignUp } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

const SignUpPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initial theme setup
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);

    // Listen for theme changes
    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldUseDark = currentTheme === 'dark' || (!currentTheme && prefersDark);
      setIsDarkMode(shouldUseDark);
    };

    // Listen for storage changes (when theme is toggled in another tab/component)
    window.addEventListener('storage', handleThemeChange);
    
    // Listen for custom theme change events
    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  return (
    <div className={`flex items-center justify-center ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div>
        <SignUp 
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

export default SignUpPage;