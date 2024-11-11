import { create } from 'zustand';

interface AuthenticatedState {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (value: boolean) => void;
}

const useAuthenticatedStore = create<AuthenticatedState>((set) => ({
  isAuthenticated: null,
  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
}));

export default useAuthenticatedStore;
