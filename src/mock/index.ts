import { tenant1Data } from './tenants/tenant1';
import { tenant2Data } from './tenants/tenant2';
import { tenant3Data } from './tenants/tenant3';
import type { TenantData, User, Booking, Tenant } from '../types';

const tenantsData: Record<string, TenantData> = {
  [tenant1Data.tenant.id]: tenant1Data,
  [tenant2Data.tenant.id]: tenant2Data,
  [tenant3Data.tenant.id]: tenant3Data,
};

export function getAllTenants(): Tenant[] {
  return Object.values(tenantsData).map((t) => t.tenant);
}

export function getTenantData(tenantId: string): TenantData | undefined {
  return tenantsData[tenantId];
}

export function getTenantById(tenantId: string): Tenant | undefined {
  return tenantsData[tenantId]?.tenant;
}

export function authenticateUser(
  tenantId: string,
  username: string,
  password: string
): User | null {
  const tenantData = tenantsData[tenantId];
  if (!tenantData) return null;

  const user = tenantData.users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  return null;
}

export function getBookingsByDate(tenantId: string, date: string): Booking[] {
  const tenantData = tenantsData[tenantId];
  if (!tenantData) return [];
  return tenantData.bookings.filter(
    (b) => b.date === date && b.status !== 'cancelled' && b.status !== 'rejected'
  );
}

export function getBookingsByRoom(tenantId: string, roomId: string, date: string): Booking[] {
  const tenantData = tenantsData[tenantId];
  if (!tenantData) return [];
  return tenantData.bookings.filter(
    (b) => b.roomId === roomId && b.date === date && b.status !== 'cancelled' && b.status !== 'rejected'
  );
}

export function createBooking(tenantId: string, booking: Omit<Booking, 'id' | 'tenantId' | 'createdAt'>): Booking {
  const tenantData = tenantsData[tenantId];
  if (!tenantData) throw new Error('Tenant not found');

  const newBooking: Booking = {
    ...booking,
    id: `bk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    tenantId,
    createdAt: new Date().toISOString(),
  };

  tenantData.bookings.push(newBooking);
  return newBooking;
}

export function cancelBooking(tenantId: string, bookingId: string): Booking | null {
  const tenantData = tenantsData[tenantId];
  if (!tenantData) return null;

  const booking = tenantData.bookings.find((b) => b.id === bookingId);
  if (booking) {
    booking.status = 'cancelled';
    return booking;
  }
  return null;
}

export function approveBooking(tenantId: string, bookingId: string): Booking | null {
  const tenantData = tenantsData[tenantId];
  if (!tenantData) return null;

  const booking = tenantData.bookings.find((b) => b.id === bookingId);
  if (booking && booking.status === 'pending') {
    booking.status = 'approved';
    return booking;
  }
  return null;
}

export function rejectBooking(tenantId: string, bookingId: string): Booking | null {
  const tenantData = tenantsData[tenantId];
  if (!tenantData) return null;

  const booking = tenantData.bookings.find((b) => b.id === bookingId);
  if (booking && booking.status === 'pending') {
    booking.status = 'rejected';
    return booking;
  }
  return null;
}

export function checkTimeConflict(
  tenantId: string,
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
): boolean {
  const bookings = getBookingsByRoom(tenantId, roomId, date);

  return bookings.some((booking) => {
    if (excludeBookingId && booking.id === excludeBookingId) return false;
    const startA = startTime;
    const endA = endTime;
    const startB = booking.startTime;
    const endB = booking.endTime;
    return startA < endB && endA > startB;
  });
}

export function getUserBookings(tenantId: string, userId: string): Booking[] {
  const tenantData = tenantsData[tenantId];
  if (!tenantData) return [];
  return tenantData.bookings.filter((b) => b.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getPendingBookings(tenantId: string): Booking[] {
  const tenantData = tenantsData[tenantId];
  if (!tenantData) return [];
  return tenantData.bookings.filter((b) => b.status === 'pending');
}
