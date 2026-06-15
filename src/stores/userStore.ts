import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Booking } from '../types';
import { authenticateUser, getUserBookings, getPendingBookings } from '../mock';
import { useTenantStore } from './tenantStore';

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
          // 关键安全校验：用户所属单位必须与前端选择的一致
          // 使用 user.tenantId 作为权威值，防止预览模式残留污染
          const realTenantId = user.tenantId;
          const { password: _password, ...userWithoutPassword } = user;
          const myBookings = getUserBookings(realTenantId, user.id);
          const pendingBookings = getPendingBookings(realTenantId);
          
          useTenantStore.getState().setCurrentTenant(realTenantId, true);
          
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
      // 页面刷新后恢复 user 时，自动根据 user.tenantId 重建租户上下文
      onRehydrateStorage: () => (state) => {
        if (state?.user?.tenantId) {
          useTenantStore.getState().setCurrentTenant(state.user.tenantId, true);
        }
      },
    }
  )
);
