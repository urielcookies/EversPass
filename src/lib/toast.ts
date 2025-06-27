export type ToastType = 'default' | 'success' | 'error' | 'info' | 'warning';

// Using rgba for colors to allow for opacity in the backdrop-filter
// and to better control the border and text color for a softer look.
const typeStyles = {
  success: {
    bg: 'rgba(212, 252, 222, 0.7)', // Lighter, slightly desaturated green
    border: 'rgba(64, 172, 107, 0.2)', // Softer green border
    text: '#225533', // Darker but not harsh green text
    icon: '✔️',
  },
  error: {
    bg: 'rgba(255, 230, 230, 0.7)', // Lighter, slightly desaturated red
    border: 'rgba(239, 68, 68, 0.2)', // Softer red border
    text: '#882222', // Darker but not harsh red text
    icon: '❌',
  },
  info: {
    bg: 'rgba(210, 235, 255, 0.7)', // Lighter, slightly desaturated blue
    border: 'rgba(59, 130, 246, 0.2)', // Softer blue border
    text: '#204070', // Darker but not harsh blue text
    icon: 'ℹ️',
  },
  warning: {
    bg: 'rgba(255, 245, 200, 0.7)', // Lighter, slightly desaturated yellow
    border: 'rgba(234, 179, 8, 0.2)', // Softer yellow border
    text: '#78500f', // Darker but not harsh orange-brown text
    icon: '⚠️',
  },
  default: {
    bg: 'rgba(248, 250, 252, 0.7)', // Light gray
    border: 'rgba(203, 213, 225, 0.3)', // Softer gray border
    text: '#334155', // Slate text
    icon: '💬',
  },
};

export function showToast(message: string, type: ToastType = 'default', duration: number = 4000) {
  const containerId = 'astro-global-toast-container';
  let container = document.getElementById(containerId);

  // Ensure the container is positioned correctly and can hold multiple toasts
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const styles = typeStyles[type];

  // Tailwind classes for the main toast appearance
  toast.className = `
    relative p-4 rounded-xl shadow-lg flex items-center gap-3 w-full
    transition-all duration-300 ease-out transform
    opacity-0 scale-95
    group // Enable group for child hover states
  `;

  // Apply dynamic styles (background, border, text color, and crucial backdrop-filter)
  Object.assign(toast.style, {
    background: styles.bg,
    color: styles.text,
    border: `1px solid ${styles.border}`,
    // The key for the frosted glass effect: backdrop-filter
    backdropFilter: 'blur(10px)', // Adjust blur amount as needed
    WebkitBackdropFilter: 'blur(10px)', // For Safari compatibility
  });

  const icon = document.createElement('span');
  icon.textContent = styles.icon;
  icon.className = 'text-2xl leading-none'; // Larger icon, ensure no extra line height

  const text = document.createElement('span');
  text.textContent = message;
  text.className = 'flex-1 text-base font-medium'; // Adjust font size/weight

  const closeButton = document.createElement('button');
  closeButton.textContent = '✕';
  closeButton.className = `
    ml-auto p-1 rounded-full text-lg leading-none
    transition-opacity duration-200
    opacity-0 group-hover:opacity-100 // Hidden by default, visible on toast hover
    focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50
  `;
  Object.assign(closeButton.style, { color: styles.text }); // Ensure close button color matches text

  closeButton.onclick = () => {
    // Start exit animation immediately on click
    toast.style.opacity = '0';
    toast.style.transform = 'scale(0.95)';
    setTimeout(() => toast.remove(), 300); // Remove after animation
  };

  toast.appendChild(icon);
  toast.appendChild(text);
  toast.appendChild(closeButton);

  container.prepend(toast); // Prepend to show new toasts at the top

  // Trigger entry animation
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'scale(1)';
  });

  // Auto-remove after duration
  setTimeout(() => {
    // Check if toast still exists before trying to animate/remove
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'scale(0.95)';
      setTimeout(() => toast.remove(), 300); // Remove after animation
    }
  }, duration);
}

// Global access
declare global {
  interface Window {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
  }
}

window.showToast = showToast;