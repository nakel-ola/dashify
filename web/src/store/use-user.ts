import { fetchUser } from '@/app/services/fetch-user';
import { useEffect } from 'react';
import { create } from 'zustand';

type UserStoreType = {
  loading: boolean;
  user: UserType | null;
  setUser: () => void;
};
export const useUserStore = create<UserStoreType>((set, get) => ({
  loading: false,
  user: null,
  setUser: () => {
    set({ loading: true });
    fetchUser()
      .then(({ ok, user }) => {
        if (ok && user) set({ user });
      })
      .finally(() => set({ loading: false }));
  },
}));

export const useUser = () => {
  const { loading, user, setUser } = useUserStore();

  useEffect(() => {
    if (!user) setUser();
  }, [user, setUser]);

  return { loading, user, setUser };
};
