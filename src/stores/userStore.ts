import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Booking } from '../types';
import { authenticateUser, getUserBookings, getPendingBookings } from '../mock';

interface UserState {
  user: Omit<User, 'password'> | null;
  isLoggedIn: boolean;
  myBookings: Booking[];
  pendingBookings: Booking[];
  
  login: (tenantId: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshMyBookings: () => void;
  refreshPendingBookings: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      myBookings: [],
      pendingBookings: [],
      
      login: async (tenantId, username, password) => {
        const user = authenticateUser(tenantId, username, password);
        if (user) {
          const { password: _password, ...userWithoutPassword } = user;
          const myBookings = getUserBookings(tenantId, user.id);
          const pendingBookings = getPendingBookings(tenantId);
          
          set({
            user: userWithoutPassword,
            isLoggedIn: true,
            myBookings,
            pendingBookings,
          });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
          myBookings: [],
          pendingBookings: [],
        });
      },
      
      refreshMyBookings: () => {
        const { user } = get();
        if (user) {
          const bookings = getUserBookings(user.tenantId, user.id);
          set({ myBookings: bookings });
        }
      },
      
      refreshPendingBookings: () => {
        const { user } = get();
        if (user) {
          const bookings = getPendingBookings(user.tenantId);
          set({ pendingBookings: bookings });
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
);
