import type { TenantData } from '../../types';

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const tenant3Data: TenantData = {
  tenant: {
    id: 'tenant-3',
    name: '市科技局',
    shortName: '科技局',
    workDays: [1, 2, 3, 4, 5],
    bookingStartTime: '09:00',
    bookingEndTime: '21:00',
    minBookingDuration: 30,
    maxBookingDuration: 600,
    themeColor: '#722ED1',
  },
  floors: [
    { id: 'floor-3-1', tenantId: 'tenant-3', name: '2F', sortOrder: 1 },
    { id: 'floor-3-2', tenantId: 'tenant-3', name: '3F', sortOrder: 2 },
    { id: 'floor-3-3', tenantId: 'tenant-3', name: '4F', sortOrder: 3 },
    { id: 'floor-3-4', tenantId: 'tenant-3', name: '5F', sortOrder: 4 },
  ],
  rooms: [
    { id: 'room-3-1', tenantId: 'tenant-3', floorId: 'floor-3-1', name: '路演厅', capacity: 50, description: '项目路演、成果发布', equipmentIds: ['equip-3-1', 'equip-3-2', 'equip-3-3', 'equip-3-4'], sortOrder: 1 },
    { id: 'room-3-2', tenantId: 'tenant-3', floorId: 'floor-3-1', name: '创客空间', capacity: 20, description: '开放式讨论空间', equipmentIds: ['equip-3-1', 'equip-3-3'], sortOrder: 2 },
    { id: 'room-3-3', tenantId: 'tenant-3', floorId: 'floor-3-2', name: '会议室A', capacity: 10, description: '小型会议', equipmentIds: ['equip-3-1', 'equip-3-3'], sortOrder: 1 },
    { id: 'room-3-4', tenantId: 'tenant-3', floorId: 'floor-3-2', name: '会议室B', capacity: 10, description: '小型会议', equipmentIds: ['equip-3-1', 'equip-3-3'], sortOrder: 2 },
    { id: 'room-3-5', tenantId: 'tenant-3', floorId: 'floor-3-2', name: '视频会议室', capacity: 8, description: '远程视频会议', equipmentIds: ['equip-3-1', 'equip-3-2', 'equip-3-4', 'equip-3-5'], sortOrder: 3 },
    { id: 'room-3-6', tenantId: 'tenant-3', floorId: 'floor-3-3', name: '学术报告厅', capacity: 100, description: '学术报告、大型培训', equipmentIds: ['equip-3-1', 'equip-3-2', 'equip-3-3', 'equip-3-4', 'equip-3-6'], sortOrder: 1 },
    { id: 'room-3-7', tenantId: 'tenant-3', floorId: 'floor-3-4', name: '党组会议室', capacity: 12, description: '党组会议', equipmentIds: ['equip-3-1', 'equip-3-3', 'equip-3-5'], sortOrder: 1 },
  ],
  equipment: [
    { id: 'equip-3-1', tenantId: 'tenant-3', name: '投影仪', icon: 'projector', totalQuantity: 12 },
    { id: 'equip-3-2', tenantId: 'tenant-3', name: '音响系统', icon: 'speaker', totalQuantity: 6 },
    { id: 'equip-3-3', tenantId: 'tenant-3', name: '智能白板', icon: 'square', totalQuantity: 10 },
    { id: 'equip-3-4', tenantId: 'tenant-3', name: '视频会议终端', icon: 'video', totalQuantity: 5 },
    { id: 'equip-3-5', tenantId: 'tenant-3', name: '无线麦克风', icon: 'mic', totalQuantity: 20 },
    { id: 'equip-3-6', tenantId: 'tenant-3', name: '录播系统', icon: 'film', totalQuantity: 2 },
  ],
  holidays: [
    { id: 'hol-3-1', tenantId: 'tenant-3', date: '2026-01-01', name: '元旦', type: 'holiday' },
    { id: 'hol-3-2', tenantId: 'tenant-3', date: '2026-02-16', name: '春节', type: 'holiday' },
    { id: 'hol-3-3', tenantId: 'tenant-3', date: '2026-02-17', name: '春节', type: 'holiday' },
    { id: 'hol-3-4', tenantId: 'tenant-3', date: '2026-05-01', name: '劳动节', type: 'holiday' },
    { id: 'hol-3-5', tenantId: 'tenant-3', date: '2026-05-30', name: '科技工作者日', type: 'holiday' },
    { id: 'hol-3-6', tenantId: 'tenant-3', date: '2026-10-01', name: '国庆节', type: 'holiday' },
    { id: 'hol-3-7', tenantId: 'tenant-3', date: '2026-10-02', name: '国庆节', type: 'holiday' },
  ],
  approvalRules: [
    {
      id: 'rule-3-1',
      tenantId: 'tenant-3',
      name: '路演厅审批',
      enabled: true,
      conditions: { roomIds: ['room-3-1', 'room-3-6'] },
      approverIds: ['user-3-2'],
      approvalType: 'any',
    },
  ],
  users: [
    { id: 'user-3-1', tenantId: 'tenant-3', username: 'zhoujiu', name: '周九', role: 'employee', department: '高新处', password: '123456' },
    { id: 'user-3-2', tenantId: 'tenant-3', username: 'wushi', name: '吴十', role: 'approver', department: '办公室', password: '123456' },
    { id: 'user-3-3', tenantId: 'tenant-3', username: 'zhengshiyi', name: '郑十一', role: 'admin', department: '办公室', password: '123456' },
  ],
  bookings: [
    { id: 'bk-3-1', tenantId: 'tenant-3', roomId: 'room-3-1', userId: 'user-3-1', title: '科技创新创业大赛路演', date: today, startTime: '09:00', endTime: '12:00', attendeeCount: 45, equipmentIds: ['equip-3-1', 'equip-3-2', 'equip-3-4'], status: 'approved', createdAt: '2026-06-12T10:00:00Z', meetingType: '路演' },
    { id: 'bk-3-2', tenantId: 'tenant-3', roomId: 'room-3-6', userId: 'user-3-2', title: '全市科技工作会议', date: today, startTime: '14:00', endTime: '17:00', attendeeCount: 95, equipmentIds: ['equip-3-1', 'equip-3-2', 'equip-3-4', 'equip-3-6'], status: 'approved', createdAt: '2026-06-10T08:00:00Z', meetingType: '工作会议' },
    { id: 'bk-3-3', tenantId: 'tenant-3', roomId: 'room-3-3', userId: 'user-3-1', title: '项目研讨会', date: today, startTime: '10:00', endTime: '11:30', attendeeCount: 8, equipmentIds: ['equip-3-1'], status: 'approved', createdAt: '2026-06-14T09:00:00Z', meetingType: '研讨' },
    { id: 'bk-3-4', tenantId: 'tenant-3', roomId: 'room-3-5', userId: 'user-3-1', title: '省厅视频会议', date: today, startTime: '15:00', endTime: '16:30', attendeeCount: 6, equipmentIds: ['equip-3-2', 'equip-3-4', 'equip-3-5'], status: 'approved', createdAt: '2026-06-13T14:00:00Z', meetingType: '视频会议' },
    { id: 'bk-3-5', tenantId: 'tenant-3', roomId: 'room-3-2', userId: 'user-3-2', title: '创客沙龙', date: tomorrow, startTime: '19:00', endTime: '21:00', attendeeCount: 15, equipmentIds: ['equip-3-1'], status: 'pending', createdAt: '2026-06-14T16:00:00Z', meetingType: '沙龙' },
    { id: 'bk-3-6', tenantId: 'tenant-3', roomId: 'room-3-7', userId: 'user-3-3', title: '党组理论学习', date: today, startTime: '09:30', endTime: '11:00', attendeeCount: 10, equipmentIds: ['equip-3-1', 'equip-3-5'], status: 'approved', createdAt: '2026-06-11T10:00:00Z', meetingType: '学习' },
  ],
};
