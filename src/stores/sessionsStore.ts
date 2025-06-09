import { atom } from 'nanostores';
import { loadSessionsByDeviceId, type SessionRecord } from '@/services/loadSessions';

interface SessionsStore {
  sessions: SessionRecord[];
  isLoading: boolean;
  error: string | null;
  deviceId: string | null;
}

const $sessions = atom<SessionsStore>({
  sessions: [],
  isLoading: false,
  error: null,
  deviceId: null,
});

const fetchSessions = async (deviceId: string, forceRefresh: boolean = false) => {
  const store = $sessions.get();

  // The condition checks if the data we have is for the correct device.
  const isDataValid = store.deviceId === deviceId && store.sessions.length > 0;

  if (store.isLoading) {
    return; // Prevent concurrent fetches
  }

  if (!forceRefresh && isDataValid) {
    return; // Data is valid and for the correct device, so we can use the cache.
  }

  $sessions.set({ ...store, isLoading: true, error: null });

  try {
    const records = await loadSessionsByDeviceId(deviceId);
    $sessions.set({ sessions: records, isLoading: false, error: null, deviceId: deviceId });
  } catch (e: any) {
    $sessions.set({ ...$sessions.get(), isLoading: false, error: e.message });
  }
}

export { $sessions, fetchSessions };
export type { SessionRecord, SessionsStore };
