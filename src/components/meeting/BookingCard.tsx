import React from 'react';
import type { Booking, Equipment } from '../../types';
import { useTenantStore } from '../../stores/tenantStore';
import { timeToMinutes, getDurationMinutes, formatDuration } from '../../utils/date';
import { cn } from '../../lib/utils';
import { Clock, Users } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  top: number;
  height: number;
  onClick?: () => void;
}

const statusColors = {
  approved: 'bg-[#165DFF]',
  pending: 'bg-orange-500',
  rejected: 'bg-red-500',
  cancelled: 'bg-gray-400',
};

const statusLabels = {
  approved: '已审批',
  pending: '待审批',
  rejected: '已驳回',
  cancelled: '已取消',
};

const BookingCard: React.FC<BookingCardProps> = ({ booking, top, height, onClick }) => {
  const { equipment } = useTenantStore();
  
  const bookingEquipment = booking.equipmentIds
    .map(id => equipment.find(e => e.id === id))
    .filter(Boolean) as Equipment[];

  return (
    <div
      onClick={onClick}
      className={cn(
        'absolute left-1 right-1 rounded-md px-2 py-1.5 cursor-pointer',
        'transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:z-10',
        statusColors[booking.status],
        'text-white'
      )}
      style={{ top, height }}
    >
      <div className="text-sm font-medium truncate">{booking.title}</div>
      <div className="flex items-center gap-2 text-xs opacity-90 mt-0.5">
        <span className="flex items-center gap-0.5">
          <Clock className="w-3 h-3" />
          {booking.startTime}-{booking.endTime}
        </span>
        <span className="flex items-center gap-0.5">
          <Users className="w-3 h-3" />
          {booking.attendeeCount}人
        </span>
      </div>
      {height > 60 && bookingEquipment.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {bookingEquipment.slice(0, 3).map(eq => (
            <span key={eq.id} className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
              {eq.name}
            </span>
          ))}
          {bookingEquipment.length > 3 && (
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
              +{bookingEquipment.length - 3}
            </span>
          )}
        </div>
      )}
      {booking.status === 'pending' && (
        <span className="absolute top-1 right-1 text-[10px] bg-white/25 px-1.5 py-0.5 rounded font-medium">
          {statusLabels[booking.status]}
        </span>
      )}
    </div>
  );
};

export default BookingCard;
