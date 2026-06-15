import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tenant, Floor, Room, Equipment, Holiday, ApprovalRule, Booking } from '../types';
import { getTenantData, getAllTenants, getBookingsByDate } from '../mock';

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
  
  setCurrentTenant: (tenantId: string | null) => void;
  setSelectedDate: (date: string) => void;
  refreshBookings: () => void;
}

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
      
      setCurrentTenant: (tenantId) => {
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
        const { currentTenantId, selectedDate } = get();
        if (currentTenantId) {
          const bookings = getBookingsByDate(currentTenantId, selectedDate);
          set({ bookings });
        }
      },
    }),
    {
      name: 'tenant-storage',
      partialize: (state) => ({ currentTenantId: state.currentTenantId }),
      onRehydrateStorage: () => (state) => {
        if (state?.currentTenantId) {
          state.setCurrentTenant(state.currentTenantId);
        }
      },
    }
  )
);
