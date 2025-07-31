declare global {
  interface Window {
    iziToast: any;
    showLimitedToast?: (options: any) => void;
  }
}

const MAX_IZITOASTS = 2;

export function initToastSystem(): void {
  window.showLimitedToast = (options: any) => {
    const toasts = document.querySelectorAll('.iziToast');

    if (toasts.length >= MAX_IZITOASTS) {
      const oldest = toasts[0];
      if (oldest) {
        window.iziToast.hide({ transitionOut: 'fadeOutUp' }, oldest);
      }
    }

    window.iziToast.show(options);
  };
}