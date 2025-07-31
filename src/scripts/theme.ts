export function applyTheme(): void {
  const theme = localStorage.getItem('theme') || 'dark';
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function initThemeSystem(): void {
  // Apply theme immediately
  applyTheme();
  
  // Apply theme after Astro page transitions
  document.addEventListener('astro:after-swap', applyTheme);
}