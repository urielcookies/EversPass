// src/stores/activePhotoSessionStore.ts

import { atom } from 'nanostores';
import fetchPhotosForSession, { type PagedPhotoResponse, type PhotoRecord } from '@/services/fetchPhotosForSession';

interface ActivePhotoSessionStore {
  photos: PhotoRecord[];
  isLoading: boolean;
  isLoadingMore: boolean; // For loading subsequent pages
  error: string | null;
  sessionId: string | null; // The ID of the currently active session
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  sessionSize: number;
  totalDeviceSessionsSize: number;
}

const $activePhotoSession = atom<ActivePhotoSessionStore>({
  photos: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  sessionId: null,
  page: 0,
  perPage: 50,
  totalPages: 0,
  totalItems: 0,
  sessionSize: 0,
  totalDeviceSessionsSize: 0,
});

/**
 * Fetches photos for a photo session. If the session ID is new, it clears
 * the old session's data. If it's the same session, it can fetch subsequent pages.
 * @param sessionId The ID of the session to display.
 * @param pageToFetch The page number to fetch. Defaults to 1.
 */
const fetchPhotoSession = async (sessionId: string, pageToFetch: number = 1) => {
  const store = $activePhotoSession.get();
  const isNewSession = sessionId !== store.sessionId;
  const isFetchingFirstPage = pageToFetch === 1;

  // Prevent redundant fetches
  if (store.isLoading || store.isLoadingMore) {
    return;
  }

  // If it's a new session, we need to clear the old photos immediately for a clean UI transition
  const initialState = isNewSession ? { ...$activePhotoSession.get(), photos: [], sessionId, page: 0, totalPages: 0 } : store;
  
  // Set the appropriate loading state
  if (isFetchingFirstPage) {
    $activePhotoSession.set({ ...initialState, isLoading: true, error: null });
  } else {
    $activePhotoSession.set({ ...initialState, isLoadingMore: true, error: null });
  }

  try {
    const response: PagedPhotoResponse = await fetchPhotosForSession(sessionId, pageToFetch, store.perPage);

    // If fetching the first page (or a new session), replace photos. Otherwise, append.
    const newPhotos = isFetchingFirstPage ? response.items : [...store.photos, ...response.items];

    $activePhotoSession.set({
      ...store,
      photos: newPhotos,
      isLoading: false,
      isLoadingMore: false,
      error: null,
      sessionId,
      page: response.page,
      perPage: response.perPage,
      totalPages: response.totalPages,
      totalItems: response.totalItems,
      sessionSize: response.sessionSize,
      totalDeviceSessionsSize: response.totalDeviceSessionsSize,
    });

  } catch (e: any) {
    $activePhotoSession.set({ ...$activePhotoSession.get(), isLoading: false, isLoadingMore: false, error: e.message });
  }
}

/**
 * Fetches the next page for the currently active photo session, if one exists.
 */
const fetchNextPageForActiveSession = async () => {
  const store = $activePhotoSession.get();
  
  // Exit if we're already loading or if there are no more pages
  if (store.isLoading || store.isLoadingMore || !store.sessionId || store.page >= store.totalPages) {
    return;
  }
  
  const nextPage = store.page + 1;
  await fetchPhotoSession(store.sessionId, nextPage);
}

/**
 * Clears all photos from the store and resets relevant pagination data.
 */
const clearPhotos = () => {
  $activePhotoSession.set({
    ...$activePhotoSession.get(),
    photos: [],
    page: 0,
    totalPages: 0,
    totalItems: 0,
    sessionSize: 0,
    totalDeviceSessionsSize: 0,
    sessionId: null, // Optionally clear the sessionId if clearing photos implies no active session
    isLoading: false, // Ensure loading states are reset
    isLoadingMore: false,
    error: null,
  });
};


export { $activePhotoSession, fetchPhotoSession, fetchNextPageForActiveSession, clearPhotos }; // Export the new method
export type { PhotoRecord, ActivePhotoSessionStore };