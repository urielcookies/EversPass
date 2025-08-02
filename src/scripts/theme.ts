export function applyTheme(): void {
  const theme = localStorage.getItem('theme') || 'dark';
  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(theme);
  
  // Update theme toggle icons
  updateThemeIcons(theme === 'dark');
}

export function toggleTheme(): void {
  const currentTheme = localStorage.getItem('theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  applyTheme();
}

function updateThemeIcons(isDark: boolean): void {
  const lightIcon = document.getElementById('theme-toggle-light-icon');
  const darkIcon = document.getElementById('theme-toggle-dark-icon');
  const lightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');
  const darkIconMobile = document.getElementById('theme-toggle-dark-icon-mobile');
  
  if (lightIcon && darkIcon) {
    if (isDark) {
      lightIcon.classList.remove('hidden');
      darkIcon.classList.add('hidden');
    } else {
      lightIcon.classList.add('hidden');
      darkIcon.classList.remove('hidden');
    }
  }
  
  if (lightIconMobile && darkIconMobile) {
    if (isDark) {
      lightIconMobile.classList.remove('hidden');
      darkIconMobile.classList.add('hidden');
    } else {
      lightIconMobile.classList.add('hidden');
      darkIconMobile.classList.remove('hidden');
    }
  }
}

export function initThemeSystem(): void {
  applyTheme();
  
  // Make toggleTheme globally available for navbar buttons
  window.toggleTheme = toggleTheme;
  
  document.addEventListener('astro:after-swap', applyTheme);
}