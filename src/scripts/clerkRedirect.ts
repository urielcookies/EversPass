declare global {
  interface Window {
    processURLDataAndSave?: () => boolean;
  }
}

function waitForClerkFullyLoaded(callback: () => void, maxWait: number = 10000): void {
  const startTime = Date.now();
  
  function check() {
    // Check multiple indicators that Clerk is truly ready
    const clerkLoaded = window.Clerk && window.Clerk.loaded;
    const clerkUser = window.Clerk?.user !== undefined; // undefined means not checked yet, null means checked and no user
    const clerkSession = window.Clerk?.session !== undefined;
    
    if (clerkLoaded && (clerkUser || clerkSession)) {
      console.log('Clerk fully loaded and user state determined');
      callback();
    } else if (Date.now() - startTime < maxWait) {
      setTimeout(check, 200); // Check less frequently to give Clerk more time
    } else {
      console.log('Clerk took too long to fully load, proceeding anyway');
      callback();
    }
  }
  
  check();
}

async function checkUserAndRedirect(): Promise<void> {
  try {
    if (!window.Clerk) {
      console.log('Clerk not available');
      return;
    }

    // Ensure Clerk is fully loaded before checking auth status
    await window.Clerk.load();
    
    // Wait a tiny bit more to ensure everything is settled
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const user = window.Clerk.user;
    const session = window.Clerk.session;
    
    console.log('Clerk check - User:', user, 'Session:', session);

    if (user && session) {
      handleAuthenticatedUser();
    } else {
      console.log('User not authenticated, staying on current page');
    }
  } catch (e) {
    console.error('Error loading Clerk user:', e);
  }
}

function handleAuthenticatedUser(): void {
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
}

export function initClerkRedirect(): void {
  // Wait for Clerk to be truly ready (including the dev warning you see)
  waitForClerkFullyLoaded(checkUserAndRedirect);
}