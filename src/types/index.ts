export interface Tenant {
  id: string;
  name: string;
  shortName: string;
  workDays: number[];
  bookingStartTime: string;
  bookingEndTime: string;
  minBookingDuration: number;
  maxBookingDuration: number;
  themeColor: string;
}

export interface Floor {
  id: string;
  tenantId: string;
  name: string;
  sortOrder: number;
}

export interface Room {
  id: string;
  tenantId: string;
  floorId: string;
  name: string;
  capacity: number;
  description?: string;
  equipmentIds: string[];
  sortOrder: number;
}

export interface Equipment {
  id: string;
  tenantId: string;
  name: string;
  icon: string;
  totalQuantity: number;
}

export interface Holiday {
  id: string;
  tenantId: string;
  date: string;
  name: string;
  type: 'holiday' | 'makeup';
}

export interface ApprovalRule {
  id: string;
  tenantId: string;
  name: string;
  enabled: boolean;
  conditions: {
    minCapacity?: number;
    durationThreshold?: number;
    roomIds?: string[];
  };
  approverIds: string[];
  approvalType: 'any' | 'all';
}

export interface Booking {
  id: string;
  tenantId: string;
  roomId: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  attendeeCount: number;
  equipmentIds: string[];
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
  meetingType?: string;
}

export interface User {
  id: string;
  tenantId: string;
  username: string;
  name: string;
  role: 'employee' | 'approver' | 'admin' | 'superAdmin';
  department?: string;
  avatar?: string;
  password: string;
}

export type BookingStatus = Booking['status'];

export interface TenantData {
  tenant: Tenant;
  floors: Floor[];
  rooms: Room[];
  equipment: Equipment[];
  holidays: Holiday[];
  approvalRules: ApprovalRule[];
  users: User[];
  bookings: Booking[];
}
