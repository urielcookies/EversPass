import { atom } from 'nanostores';
import { loadSessionsByDeviceId, type SessionRecord } from '@/services/loadSessions';

interface SessionsStore {
  sessions: SessionRecord[];
  isLoading: boolean;
  error: string | null;
  deviceId: string | null;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

const $sessions = atom<SessionsStore>({
  sessions: [],
  isLoading: false,
  error: null,
  deviceId: null,
  page: 1,
  totalPages: 1,
  hasMore: false,
});

const fetchSessions = async (
  deviceId: string,
  page = 1,
  perPage = 10,
  forceRefresh = false
) => {
  const store = $sessions.get();

  const isDataValid = store.deviceId === deviceId && store.sessions.length > 0;

  if (store.isLoading) return;
  if (!forceRefresh && isDataValid && page === store.page) return;

  $sessions.set({ ...store, isLoading: true, error: null });

  try {
    const { items, total_pages } = await loadSessionsByDeviceId(deviceId, page, perPage);
    const mergedSessions = page === 1 ? items : [...store.sessions, ...items];

    $sessions.set({
      sessions: mergedSessions,
      isLoading: false,
      error: null,
      deviceId,
      page,
      totalPages: total_pages,
      hasMore: page < total_pages
    });
  } catch (e: any) {
    $sessions.set({ ...store, isLoading: false, error: e.message });
  }
};

export { $sessions, fetchSessions };
export type { SessionRecord, SessionsStore };
