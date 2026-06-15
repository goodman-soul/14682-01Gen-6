import type { TenantData } from '../../types';

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const tenant2Data: TenantData = {
  tenant: {
    id: 'tenant-2',
    name: '市财政局',
    shortName: '财政局',
    workDays: [1, 2, 3, 4, 5, 6],
    bookingStartTime: '08:30',
    bookingEndTime: '18:30',
    minBookingDuration: 60,
    maxBookingDuration: 360,
    themeColor: '#00B42A',
  },
  floors: [
    { id: 'floor-2-1', tenantId: 'tenant-2', name: '3层', sortOrder: 1 },
    { id: 'floor-2-2', tenantId: 'tenant-2', name: '5层', sortOrder: 2 },
    { id: 'floor-2-3', tenantId: 'tenant-2', name: '7层', sortOrder: 3 },
  ],
  rooms: [
    { id: 'room-2-1', tenantId: 'tenant-2', floorId: 'floor-2-1', name: '预算评审室', capacity: 12, description: '预算项目评审专用', equipmentIds: ['equip-2-1', 'equip-2-3'], sortOrder: 1 },
    { id: 'room-2-2', tenantId: 'tenant-2', floorId: 'floor-2-1', name: '第一会议室', capacity: 25, description: '中型会议', equipmentIds: ['equip-2-1', 'equip-2-2', 'equip-2-3'], sortOrder: 2 },
    { id: 'room-2-3', tenantId: 'tenant-2', floorId: 'floor-2-2', name: '党组会议室', capacity: 15, description: '党组会议', equipmentIds: ['equip-2-1', 'equip-2-3', 'equip-2-4'], sortOrder: 1 },
    { id: 'room-2-4', tenantId: 'tenant-2', floorId: 'floor-2-2', name: '局务会议室', capacity: 20, description: '局务会议', equipmentIds: ['equip-2-1', 'equip-2-2', 'equip-2-3', 'equip-2-4'], sortOrder: 2 },
    { id: 'room-2-5', tenantId: 'tenant-2', floorId: 'floor-2-3', name: '大会议厅', capacity: 120, description: '全局大会', equipmentIds: ['equip-2-1', 'equip-2-2', 'equip-2-3', 'equip-2-5'], sortOrder: 1 },
    { id: 'room-2-6', tenantId: 'tenant-2', floorId: 'floor-2-3', name: '会商室', capacity: 6, description: '小型会商', equipmentIds: ['equip-2-1', 'equip-2-3'], sortOrder: 2 },
  ],
  equipment: [
    { id: 'equip-2-1', tenantId: 'tenant-2', name: '投影仪', icon: 'projector', totalQuantity: 8 },
    { id: 'equip-2-2', tenantId: 'tenant-2', name: '音响', icon: 'speaker', totalQuantity: 5 },
    { id: 'equip-2-3', tenantId: 'tenant-2', name: '白板', icon: 'square', totalQuantity: 12 },
    { id: 'equip-2-4', tenantId: 'tenant-2', name: '视频会议', icon: 'video', totalQuantity: 3 },
    { id: 'equip-2-5', tenantId: 'tenant-2', name: '投票表决器', icon: 'check-square', totalQuantity: 150 },
  ],
  holidays: [
    { id: 'hol-2-1', tenantId: 'tenant-2', date: '2026-01-01', name: '元旦', type: 'holiday' },
    { id: 'hol-2-2', tenantId: 'tenant-2', date: '2026-02-16', name: '春节', type: 'holiday' },
    { id: 'hol-2-3', tenantId: 'tenant-2', date: '2026-02-17', name: '春节', type: 'holiday' },
    { id: 'hol-2-4', tenantId: 'tenant-2', date: '2026-02-18', name: '春节', type: 'holiday' },
    { id: 'hol-2-5', tenantId: 'tenant-2', date: '2026-05-01', name: '劳动节', type: 'holiday' },
    { id: 'hol-2-6', tenantId: 'tenant-2', date: '2026-05-02', name: '劳动节', type: 'holiday' },
    { id: 'hol-2-7', tenantId: 'tenant-2', date: '2026-10-01', name: '国庆节', type: 'holiday' },
    { id: 'hol-2-8', tenantId: 'tenant-2', date: '2026-10-07', name: '补班', type: 'makeup' },
  ],
  approvalRules: [
    {
      id: 'rule-2-1',
      tenantId: 'tenant-2',
      name: '大会议厅审批',
      enabled: true,
      conditions: { roomIds: ['room-2-5'] },
      approverIds: ['user-2-3'],
      approvalType: 'all',
    },
    {
      id: 'rule-2-2',
      tenantId: 'tenant-2',
      name: '超3小时会议审批',
      enabled: true,
      conditions: { durationThreshold: 180 },
      approverIds: ['user-2-2', 'user-2-3'],
      approvalType: 'any',
    },
  ],
  users: [
    { id: 'user-2-1', tenantId: 'tenant-2', username: 'zhaoliu', name: '赵六', role: 'employee', department: '预算处', password: '123456' },
    { id: 'user-2-2', tenantId: 'tenant-2', username: 'qianqi', name: '钱七', role: 'approver', department: '办公室', password: '123456' },
    { id: 'user-2-3', tenantId: 'tenant-2', username: 'sunba', name: '孙八', role: 'admin', department: '办公室', password: '123456' },
  ],
  bookings: [
    { id: 'bk-2-1', tenantId: 'tenant-2', roomId: 'room-2-1', userId: 'user-2-1', title: '2026年预算项目评审', date: today, startTime: '09:00', endTime: '12:00', attendeeCount: 10, equipmentIds: ['equip-2-1'], status: 'approved', createdAt: '2026-06-13T10:00:00Z', meetingType: '评审会议' },
    { id: 'bk-2-2', tenantId: 'tenant-2', roomId: 'room-2-3', userId: 'user-2-3', title: '局党组会议', date: today, startTime: '14:30', endTime: '16:30', attendeeCount: 12, equipmentIds: ['equip-2-1', 'equip-2-4'], status: 'approved', createdAt: '2026-06-10T08:00:00Z', meetingType: '党组会议' },
    { id: 'bk-2-3', tenantId: 'tenant-2', roomId: 'room-2-5', userId: 'user-2-1', title: '上半年财政运行分析会', date: today, startTime: '09:30', endTime: '11:30', attendeeCount: 90, equipmentIds: ['equip-2-1', 'equip-2-2', 'equip-2-5'], status: 'approved', createdAt: '2026-06-11T09:00:00Z', meetingType: '工作会议' },
    { id: 'bk-2-4', tenantId: 'tenant-2', roomId: 'room-2-2', userId: 'user-2-1', title: '专项资金研讨会', date: tomorrow, startTime: '10:00', endTime: '11:30', attendeeCount: 18, equipmentIds: ['equip-2-1'], status: 'pending', createdAt: '2026-06-14T15:00:00Z', meetingType: '研讨会议' },
    { id: 'bk-2-5', tenantId: 'tenant-2', roomId: 'room-2-4', userId: 'user-2-2', title: '局务会议', date: today, startTime: '15:00', endTime: '17:00', attendeeCount: 16, equipmentIds: ['equip-2-1', 'equip-2-2', 'equip-2-4'], status: 'approved', createdAt: '2026-06-12T14:00:00Z', meetingType: '局务会议' },
    { id: 'bk-2-6', tenantId: 'tenant-2', roomId: 'room-2-6', userId: 'user-2-1', title: '财务会商', date: today, startTime: '13:30', endTime: '14:30', attendeeCount: 4, equipmentIds: ['equip-2-1'], status: 'approved', createdAt: '2026-06-14T09:00:00Z', meetingType: '会商' },
  ],
};
