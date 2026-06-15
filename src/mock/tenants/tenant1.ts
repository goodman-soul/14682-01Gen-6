import type { TenantData } from '../../types';

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const tenant1Data: TenantData = {
  tenant: {
    id: 'tenant-1',
    name: '市政府办公厅',
    shortName: '市政府',
    workDays: [1, 2, 3, 4, 5],
    bookingStartTime: '08:00',
    bookingEndTime: '20:00',
    minBookingDuration: 30,
    maxBookingDuration: 480,
    themeColor: '#165DFF',
  },
  floors: [
    { id: 'floor-1-1', tenantId: 'tenant-1', name: '1楼', sortOrder: 1 },
    { id: 'floor-1-2', tenantId: 'tenant-1', name: '2楼', sortOrder: 2 },
    { id: 'floor-1-3', tenantId: 'tenant-1', name: '3楼', sortOrder: 3 },
    { id: 'floor-1-5', tenantId: 'tenant-1', name: '5楼', sortOrder: 5 },
  ],
  rooms: [
    { id: 'room-1-1', tenantId: 'tenant-1', floorId: 'floor-1-1', name: '迎宾厅', capacity: 30, description: '一楼大堂东侧，用于接待访客', equipmentIds: ['equip-1-1', 'equip-1-3'], sortOrder: 1 },
    { id: 'room-1-2', tenantId: 'tenant-1', floorId: 'floor-1-1', name: '新闻发布厅', capacity: 80, description: '可举办新闻发布会、媒体通报会', equipmentIds: ['equip-1-1', 'equip-1-2', 'equip-1-3', 'equip-1-4'], sortOrder: 2 },
    { id: 'room-1-3', tenantId: 'tenant-1', floorId: 'floor-1-2', name: '常务会议室', capacity: 20, description: '市政府常务会议专用', equipmentIds: ['equip-1-1', 'equip-1-2', 'equip-1-3', 'equip-1-5'], sortOrder: 1 },
    { id: 'room-1-4', tenantId: 'tenant-1', floorId: 'floor-1-2', name: '党组会议室', capacity: 15, description: '党组会议专用', equipmentIds: ['equip-1-1', 'equip-1-3', 'equip-1-5'], sortOrder: 2 },
    { id: 'room-1-5', tenantId: 'tenant-1', floorId: 'floor-1-3', name: '多功能厅', capacity: 100, description: '大型会议、培训、活动', equipmentIds: ['equip-1-1', 'equip-1-2', 'equip-1-3', 'equip-1-4', 'equip-1-6'], sortOrder: 1 },
    { id: 'room-1-6', tenantId: 'tenant-1', floorId: 'floor-1-3', name: '小会议室A', capacity: 8, description: '小型部门会议', equipmentIds: ['equip-1-1', 'equip-1-3'], sortOrder: 2 },
    { id: 'room-1-7', tenantId: 'tenant-1', floorId: 'floor-1-3', name: '小会议室B', capacity: 8, description: '小型部门会议', equipmentIds: ['equip-1-1', 'equip-1-3'], sortOrder: 3 },
    { id: 'room-1-8', tenantId: 'tenant-1', floorId: 'floor-1-5', name: '市长会见厅', capacity: 12, description: '市领导重要外事、会见活动', equipmentIds: ['equip-1-1', 'equip-1-2', 'equip-1-3', 'equip-1-5', 'equip-1-6'], sortOrder: 1 },
  ],
  equipment: [
    { id: 'equip-1-1', tenantId: 'tenant-1', name: '投影仪', icon: 'projector', totalQuantity: 10 },
    { id: 'equip-1-2', tenantId: 'tenant-1', name: '音响系统', icon: 'speaker', totalQuantity: 6 },
    { id: 'equip-1-3', tenantId: 'tenant-1', name: '白板', icon: 'square', totalQuantity: 15 },
    { id: 'equip-1-4', tenantId: 'tenant-1', name: '视频会议终端', icon: 'video', totalQuantity: 4 },
    { id: 'equip-1-5', tenantId: 'tenant-1', name: '会议麦克风', icon: 'mic', totalQuantity: 20 },
    { id: 'equip-1-6', tenantId: 'tenant-1', name: '同声传译设备', icon: 'languages', totalQuantity: 2 },
  ],
  holidays: [
    { id: 'hol-1-1', tenantId: 'tenant-1', date: '2026-01-01', name: '元旦', type: 'holiday' },
    { id: 'hol-1-2', tenantId: 'tenant-1', date: '2026-02-16', name: '春节', type: 'holiday' },
    { id: 'hol-1-3', tenantId: 'tenant-1', date: '2026-02-17', name: '春节', type: 'holiday' },
    { id: 'hol-1-4', tenantId: 'tenant-1', date: '2026-05-01', name: '劳动节', type: 'holiday' },
    { id: 'hol-1-5', tenantId: 'tenant-1', date: '2026-10-01', name: '国庆节', type: 'holiday' },
    { id: 'hol-1-6', tenantId: 'tenant-1', date: '2026-10-02', name: '国庆节', type: 'holiday' },
    { id: 'hol-1-7', tenantId: 'tenant-1', date: '2026-10-03', name: '国庆节', type: 'holiday' },
  ],
  approvalRules: [
    {
      id: 'rule-1-1',
      tenantId: 'tenant-1',
      name: '大型会议审批',
      enabled: true,
      conditions: { minCapacity: 50 },
      approverIds: ['user-1-2', 'user-1-3'],
      approvalType: 'any',
    },
    {
      id: 'rule-1-2',
      tenantId: 'tenant-1',
      name: '五楼会议室审批',
      enabled: true,
      conditions: { roomIds: ['room-1-8'] },
      approverIds: ['user-1-3'],
      approvalType: 'all',
    },
    {
      id: 'rule-1-3',
      tenantId: 'tenant-1',
      name: '超长时间会议审批',
      enabled: true,
      conditions: { durationThreshold: 240 },
      approverIds: ['user-1-2'],
      approvalType: 'any',
    },
  ],
  users: [
    { id: 'user-1-1', tenantId: 'tenant-1', username: 'zhangsan', name: '张三', role: 'employee', department: '秘书处', password: '123456' },
    { id: 'user-1-2', tenantId: 'tenant-1', username: 'lisi', name: '李四', role: 'approver', department: '行政处', password: '123456' },
    { id: 'user-1-3', tenantId: 'tenant-1', username: 'wangwu', name: '王五', role: 'admin', department: '办公室', password: '123456' },
  ],
  bookings: [
    { id: 'bk-1-1', tenantId: 'tenant-1', roomId: 'room-1-1', userId: 'user-1-1', title: '部门工作例会', date: today, startTime: '09:00', endTime: '10:00', attendeeCount: 12, equipmentIds: ['equip-1-1'], status: 'approved', createdAt: '2026-06-14T10:00:00Z', meetingType: '例行会议' },
    { id: 'bk-1-2', tenantId: 'tenant-1', roomId: 'room-1-3', userId: 'user-1-1', title: '市政府第45次常务会议', date: today, startTime: '14:00', endTime: '17:00', attendeeCount: 18, equipmentIds: ['equip-1-1', 'equip-1-2', 'equip-1-5'], status: 'approved', createdAt: '2026-06-10T08:00:00Z', meetingType: '常务会议' },
    { id: 'bk-1-3', tenantId: 'tenant-1', roomId: 'room-1-2', userId: 'user-1-2', title: '上半年经济运行情况新闻发布会', date: today, startTime: '10:00', endTime: '11:30', attendeeCount: 60, equipmentIds: ['equip-1-1', 'equip-1-2', 'equip-1-3', 'equip-1-4'], status: 'approved', createdAt: '2026-06-12T09:00:00Z', meetingType: '新闻发布' },
    { id: 'bk-1-4', tenantId: 'tenant-1', roomId: 'room-1-5', userId: 'user-1-1', title: '全市安全生产工作会议', date: tomorrow, startTime: '09:00', endTime: '12:00', attendeeCount: 80, equipmentIds: ['equip-1-1', 'equip-1-2', 'equip-1-3', 'equip-1-6'], status: 'pending', createdAt: '2026-06-14T15:00:00Z', meetingType: '工作会议' },
    { id: 'bk-1-5', tenantId: 'tenant-1', roomId: 'room-1-6', userId: 'user-1-2', title: '项目评审会', date: today, startTime: '14:30', endTime: '16:30', attendeeCount: 6, equipmentIds: ['equip-1-1'], status: 'approved', createdAt: '2026-06-13T11:00:00Z', meetingType: '评审会议' },
    { id: 'bk-1-6', tenantId: 'tenant-1', roomId: 'room-1-7', userId: 'user-1-1', title: '业务培训', date: today, startTime: '15:00', endTime: '17:00', attendeeCount: 7, equipmentIds: ['equip-1-1', 'equip-1-3'], status: 'approved', createdAt: '2026-06-13T14:00:00Z', meetingType: '培训' },
    { id: 'bk-1-7', tenantId: 'tenant-1', roomId: 'room-1-8', userId: 'user-1-3', title: '外事会见活动', date: tomorrow, startTime: '10:00', endTime: '11:00', attendeeCount: 10, equipmentIds: ['equip-1-1', 'equip-1-5', 'equip-1-6'], status: 'pending', createdAt: '2026-06-14T16:00:00Z', meetingType: '外事活动' },
  ],
};
