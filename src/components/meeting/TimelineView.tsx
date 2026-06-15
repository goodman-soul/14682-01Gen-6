import React, { useMemo } from 'react';
import type { Room, Booking, Equipment } from '../../types';
import { useTenantStore } from '../../stores/tenantStore';
import { generateTimeSlots, timeToMinutes, getDurationMinutes } from '../../utils/date';
import { cn } from '../../lib/utils';
import BookingCard from './BookingCard';
import { Users, Monitor, Video, Mic, FileText } from 'lucide-react';

interface TimelineViewProps {
  selectedFloorId: string | null;
  onBookingClick?: (booking: Booking) => void;
  onSlotClick?: (room: Room, startTime: string) => void;
  isPreview?: boolean;
}

const TIMELINE_START = '08:00';
const TIMELINE_END = '21:00';
const SLOT_HEIGHT = 40; // 每30分钟的高度
const ROOM_WIDTH = 220; // 每个会议室列的宽度

const equipmentIcons: Record<string, React.ReactNode> = {
  projector: <Monitor className="w-3.5 h-3.5" />,
  speaker: <FileText className="w-3.5 h-3.5" />,
  video: <Video className="w-3.5 h-3.5" />,
  mic: <Mic className="w-3.5 h-3.5" />,
};

const TimelineView: React.FC<TimelineViewProps> = ({
  selectedFloorId,
  onBookingClick,
  onSlotClick,
  isPreview = false,
}) => {
  const { rooms, floors, bookings, equipment, currentTenant } = useTenantStore();

  const timeSlots = useMemo(() => {
    const start = currentTenant?.bookingStartTime || TIMELINE_START;
    const end = currentTenant?.bookingEndTime || TIMELINE_END;
    return generateTimeSlots(start, end, 30);
  }, [currentTenant]);

  const filteredRooms = useMemo(() => {
    let result = rooms;
    if (selectedFloorId) {
      result = rooms.filter(r => r.floorId === selectedFloorId);
    }
    return result.sort((a, b) => {
      const floorA = floors.find(f => f.id === a.floorId)?.sortOrder || 0;
      const floorB = floors.find(f => f.id === b.floorId)?.sortOrder || 0;
      if (floorA !== floorB) return floorA - floorB;
      return a.sortOrder - b.sortOrder;
    });
  }, [rooms, floors, selectedFloorId]);

  const startMinutes = timeToMinutes(currentTenant?.bookingStartTime || TIMELINE_START);
  const totalMinutes = timeToMinutes(currentTenant?.bookingEndTime || TIMELINE_END) - startMinutes;
  const totalHeight = (totalMinutes / 30) * SLOT_HEIGHT;

  const getRoomBookings = (roomId: string): Booking[] => {
    return bookings.filter(b => b.roomId === roomId);
  };

  const getBookingPosition = (booking: Booking) => {
    const bookingStart = timeToMinutes(booking.startTime) - startMinutes;
    const duration = getDurationMinutes(booking.startTime, booking.endTime);
    const top = (bookingStart / 30) * SLOT_HEIGHT;
    const height = (duration / 30) * SLOT_HEIGHT - 2;
    return { top, height: Math.max(height, 24) };
  };

  const getRoomEquipment = (room: Room): Equipment[] => {
    return room.equipmentIds
      .map(id => equipment.find(e => e.id === id))
      .filter(Boolean) as Equipment[];
  };

  const handleSlotClick = (room: Room, time: string) => {
    if (isPreview) return;
    onSlotClick?.(room, time);
  };

  const currentTimeLine = useMemo(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const start = timeToMinutes(currentTenant?.bookingStartTime || TIMELINE_START);
    if (currentMinutes < start || currentMinutes > timeToMinutes(currentTenant?.bookingEndTime || TIMELINE_END)) {
      return null;
    }
    return ((currentMinutes - start) / 30) * SLOT_HEIGHT;
  }, [currentTenant]);

  return (
    <div className="flex-1 overflow-auto relative">
      <div className="min-w-fit">
        {/* 时间刻度 */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="flex">
            <div
              className="w-48 flex-shrink-0 h-14 border-r border-gray-200 bg-gray-50 flex items-end pb-2 pl-4"
            >
              <span className="text-xs font-medium text-gray-500">会议室</span>
            </div>
            <div className="flex-1 relative">
              <div className="flex" style={{ minWidth: filteredRooms.length * ROOM_WIDTH }}>
                {timeSlots.filter((_, i) => i % 2 === 0).map((time, idx) => (
                  <div
                    key={time}
                    className="absolute text-xs text-gray-400 font-medium"
                    style={{ left: idx * 2 * ROOM_WIDTH / (timeSlots.filter((_, i) => i % 2 === 0).length - 1) }}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* 会议室列表 */}
          <div className="w-48 flex-shrink-0 border-r border-gray-200 bg-gray-50">
            {filteredRooms.map(room => (
              <div
                key={room.id}
                className="h-[160px] px-3 py-3 border-b border-gray-100 hover:bg-gray-100/50 transition-colors cursor-pointer"
              >
                <div className="text-sm font-medium text-gray-800 mb-1">
                  {room.name}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <Users className="w-3 h-3" />
                  <span>{room.capacity}人</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {getRoomEquipment(room).slice(0, 4).map(eq => (
                    <span
                      key={eq.id}
                      className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200"
                      title={eq.name}
                    >
                      {equipmentIcons[eq.icon] || <span className="w-3 h-3" />}
                      {eq.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 时间轴主区域 */}
          <div className="flex-1 relative">
            <div className="flex" style={{ minWidth: filteredRooms.length * ROOM_WIDTH }}>
              {filteredRooms.map(room => (
                <div
                  key={room.id}
                  className="relative border-r border-gray-100"
                  style={{ width: ROOM_WIDTH, height: filteredRooms.length > 0 ? totalHeight : 'auto' }}
                >
                  {/* 时间网格线 */}
                  {timeSlots.map((time, idx) => (
                    <div
                      key={time}
                      className={cn(
                        'absolute left-0 right-0 border-t border-gray-100',
                        idx % 2 === 0 ? 'border-gray-200' : 'border-gray-100'
                      )}
                      style={{ top: idx * SLOT_HEIGHT }}
                    />
                  ))}

                  {/* 可点击的时间段 */}
                  {timeSlots.slice(0, -1).map((time, idx) => (
                    <div
                      key={`slot-${time}`}
                      className="absolute left-0 right-0 hover:bg-blue-50/30 cursor-pointer transition-colors"
                      style={{
                        top: idx * SLOT_HEIGHT,
                        height: SLOT_HEIGHT,
                      }}
                      onClick={() => handleSlotClick(room, time)}
                    />
                  ))}

                  {/* 预约卡片 */}
                  {getRoomBookings(room.id).map(booking => {
                    const { top, height } = getBookingPosition(booking);
                    return (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        top={top}
                        height={height}
                        onClick={() => onBookingClick?.(booking)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* 当前时间线 */}
            {currentTimeLine !== null && (
              <div
                className="absolute left-48 right-0 z-10 pointer-events-none"
                style={{ top: currentTimeLine }}
              >
                <div className="relative h-px bg-red-500">
                  <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 预览模式水印 */}
      {isPreview && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 text-gray-200 text-6xl font-bold opacity-20 whitespace-nowrap">
            预览模式
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineView;
