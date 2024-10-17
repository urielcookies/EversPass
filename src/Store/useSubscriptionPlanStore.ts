import { create } from 'zustand';

interface SubscriptionPlanState {
  isSubscriber: boolean;
}

export const useSubscriptionPlanStore = create<SubscriptionPlanState>(() => ({
  isSubscriber: false,
}));

export default useSubscriptionPlanStore;
