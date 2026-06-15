import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import FloorSidebar from '../../components/layout/FloorSidebar';
import TimelineView from '../../components/meeting/TimelineView';
import BookingModal from '../../components/meeting/BookingModal';
import { useTenantStore } from '../../stores/tenantStore';
import { useUserStore } from '../../stores/userStore';
import { addDaysStr, isToday } from '../../utils/date';
import { Button } from '../../components/ui/Button';
import { Plus, Calendar, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';
import type { Room, Booking } from '../../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, myBookings, pendingBookings } = useUserStore();
  const { selectedDate, setSelectedDate, ensureAuthoritativeTenant, bookings, rooms } = useTenantStore();
  
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    ensureAuthoritativeTenant();
  }, [isLoggedIn, navigate, ensureAuthoritativeTenant]);

  const handlePrevDay = () => {
    setSelectedDate(addDaysStr(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDaysStr(selectedDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleSlotClick = (room: Room, time: string) => {
    setSelectedRoom(room);
    setSelectedTime(time);
    setBookingModalOpen(true);
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailModalOpen(true);
  };

  const handleNewBooking = () => {
    setSelectedRoom(null);
    setSelectedTime('');
    setBookingModalOpen(true);
  };

  const totalRooms = rooms.length;
  const todayBookings = bookings.length;
  const pendingCount = pendingBookings.length;

  const getBookingRoom = (roomId: string) => rooms.find(r => r.id === roomId);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onToday={handleToday}
      />

      <div className="flex-1 flex overflow-hidden">
        <FloorSidebar
          selectedFloorId={selectedFloorId}
          onSelectFloor={setSelectedFloorId}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 统计卡片 */}
          <div className="px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-[#165DFF] rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">会议室总数</p>
                    <p className="text-xl font-bold text-gray-900">{totalRooms}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">今日会议</p>
                    <p className="text-xl font-bold text-gray-900">{todayBookings}</p>
                  </div>
                </div>

                {user?.role === 'approver' || user?.role === 'admin' ? (
                  <div className="flex items-center gap-3 px-4 py-2 bg-orange-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">待审批</p>
                      <p className="text-xl font-bold text-gray-900">{pendingCount}</p>
                    </div>
                  </div>
                ) : null}
              </div>

              <Button onClick={handleNewBooking}>
                <Plus className="w-4 h-4 mr-1.5" />
                新建预约
              </Button>
            </div>
          </div>

          {/* 时间轴 */}
          <TimelineView
            selectedFloorId={selectedFloorId}
            onBookingClick={handleBookingClick}
            onSlotClick={handleSlotClick}
          />
        </div>
      </div>

      {/* 新建预约弹窗 */}
      <BookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialRoom={selectedRoom}
        initialTime={selectedTime}
        initialDate={selectedDate}
      />

      {/* 预约详情弹窗 */}
      {selectedBooking && (
        <div className={`fixed inset-0 z-50 ${detailModalOpen ? 'flex' : 'hidden'} items-center justify-center`}>
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDetailModalOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">会议详情</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{selectedBooking.title}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {getBookingRoom(selectedBooking.roomId)?.name}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{selectedBooking.date}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{selectedBooking.startTime} - {selectedBooking.endTime}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{selectedBooking.attendeeCount} 人参会</span>
                </div>
              </div>

              {selectedBooking.description && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-600">{selectedBooking.description}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
                  关闭
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
