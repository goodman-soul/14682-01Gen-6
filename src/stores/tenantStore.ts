import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tenant, Floor, Room, Equipment, Holiday, ApprovalRule, Booking } from '../types';
import { getTenantData, getAllTenants, getBookingsByDate } from '../mock';
import { useUserStore } from './userStore';

interface TenantState {
  currentTenantId: string | null;
  currentTenant: Tenant | null;
  floors: Floor[];
  rooms: Room[];
  equipment: Equipment[];
  holidays: Holiday[];
  approvalRules: ApprovalRule[];
  allTenants: Tenant[];
  selectedDate: string;
  bookings: Booking[];
  
  setCurrentTenant: (tenantId: string | null, force?: boolean) => void;
  setSelectedDate: (date: string) => void;
  refreshBookings: () => void;
  ensureAuthoritativeTenant: () => void;
}

const getAuthoritativeTenantId = (): string | null => {
  const userState = useUserStore.getState();
  if (userState.isLoggedIn && userState.user?.tenantId) {
    return userState.user.tenantId;
  }
  return null;
};

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      currentTenantId: null,
      currentTenant: null,
      floors: [],
      rooms: [],
      equipment: [],
      holidays: [],
      approvalRules: [],
      allTenants: getAllTenants(),
      selectedDate: new Date().toISOString().split('T')[0],
      bookings: [],
      
      setCurrentTenant: (tenantId, force = false) => {
        if (!force) {
          const authTenantId = getAuthoritativeTenantId();
          if (authTenantId && tenantId !== authTenantId) {
            return;
          }
        }

        if (!tenantId) {
          set({
            currentTenantId: null,
            currentTenant: null,
            floors: [],
            rooms: [],
            equipment: [],
            holidays: [],
            approvalRules: [],
            bookings: [],
          });
          return;
        }
        
        const tenantData = getTenantData(tenantId);
        if (tenantData) {
          const bookings = getBookingsByDate(tenantId, get().selectedDate);
          set({
            currentTenantId: tenantId,
            currentTenant: tenantData.tenant,
            floors: tenantData.floors,
            rooms: tenantData.rooms,
            equipment: tenantData.equipment,
            holidays: tenantData.holidays,
            approvalRules: tenantData.approvalRules,
            bookings,
          });
        }
      },
      
      setSelectedDate: (date) => {
        set({ selectedDate: date });
        const { currentTenantId } = get();
        if (currentTenantId) {
          const bookings = getBookingsByDate(currentTenantId, date);
          set({ bookings });
        }
      },
      
      refreshBookings: () => {
        const authTenantId = getAuthoritativeTenantId();
        const effectiveTenantId = authTenantId || get().currentTenantId;
        if (effectiveTenantId) {
          const bookings = getBookingsByDate(effectiveTenantId, get().selectedDate);
          set({ bookings });
        }
      },

      ensureAuthoritativeTenant: () => {
        const authTenantId = getAuthoritativeTenantId();
        if (authTenantId && get().currentTenantId !== authTenantId) {
          get().setCurrentTenant(authTenantId, true);
        }
      },
    }),
    {
      name: 'tenant-storage',
      partialize: () => ({}),
    }
  )
);
