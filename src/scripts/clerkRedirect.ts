declare global {
  interface Window {
    processURLDataAndSave?: () => boolean;
  }
}

function waitForClerkReady(callback: () => void): void {
  if (window.Clerk && window.Clerk.loaded) {
    callback();
  } else {
    setTimeout(() => waitForClerkReady(callback), 100);
  }
}

async function checkUserAndRedirect(): Promise<void> {
  try {
    await window.Clerk.load();
    const user = window.Clerk.user;
    console.log('User after load():', user);

    // If user is authenticated, redirect to /app
    if (user) {
      // Special handling for photo sessions with URL data
      const pathname: string = window.location.pathname;
      if (pathname.includes('/sessions/photos')) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('data') && window.processURLDataAndSave) {
          const success = window.processURLDataAndSave();
          console.log(success ? 'URL data processed successfully' : 'Failed to process URL data');
        }
      }
      
      console.log('Redirecting authenticated user to /app');
      window.location.href = '/app';
    } else {
      console.log('User not authenticated, staying on current page');
    }
  } catch (e) {
    console.error('Error loading Clerk user:', e);
  }
}

export function initClerkRedirect(): void {
  waitForClerkReady(checkUserAndRedirect);
}