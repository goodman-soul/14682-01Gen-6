import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Clock, ChevronLeft, CheckCircle, XCircle, AlertCircle, MinusCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useUserStore } from '../../stores/userStore';
import { useTenantStore } from '../../stores/tenantStore';
import { cancelBooking, approveBooking, rejectBooking } from '../../mock';
import type { Booking } from '../../types';
import { cn } from '../../lib/utils';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, myBookings, pendingBookings, refreshMyBookings, refreshPendingBookings } = useUserStore();
  const { rooms, refreshBookings, ensureAuthoritativeTenant } = useTenantStore();
  const [activeTab, setActiveTab] = useState<'my' | 'pending'>('my');
  
  const safeTenantId = user?.tenantId;

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    ensureAuthoritativeTenant();
  }, [isLoggedIn, navigate, ensureAuthoritativeTenant]);

  const getRoomName = (roomId: string) => {
    return rooms.find(r => r.id === roomId)?.name || '未知会议室';
  };

  const handleCancelBooking = (bookingId: string) => {
    if (!safeTenantId) return;
    if (confirm('确定要取消这个预约吗？')) {
      cancelBooking(safeTenantId, bookingId);
      refreshMyBookings();
      refreshBookings();
    }
  };

  const handleApprove = (bookingId: string) => {
    if (!safeTenantId) return;
    approveBooking(safeTenantId, bookingId);
    refreshPendingBookings();
    refreshMyBookings();
    refreshBookings();
  };

  const handleReject = (bookingId: string) => {
    if (!safeTenantId) return;
    rejectBooking(safeTenantId, bookingId);
    refreshPendingBookings();
    refreshMyBookings();
    refreshBookings();
  };

  const statusConfig = {
    approved: { label: '已通过', variant: 'success' as const, icon: CheckCircle },
    pending: { label: '待审批', variant: 'warning' as const, icon: AlertCircle },
    rejected: { label: '已驳回', variant: 'danger' as const, icon: XCircle },
    cancelled: { label: '已取消', variant: 'default' as const, icon: MinusCircle },
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  const displayBookings = activeTab === 'my' ? myBookings : pendingBookings;
  const isApprover = user.role === 'approver' || user.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">个人中心</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#165DFF] to-[#4080FF] rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.department}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="info">{user.role === 'admin' ? '管理员' : user.role === 'approver' ? '审批人' : '普通员工'}</Badge>
                <span className="text-xs text-gray-400">账号：{user.username}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('my')}
              className={cn(
                'flex-1 px-6 py-3 text-sm font-medium transition-colors relative',
                activeTab === 'my' ? 'text-[#165DFF]' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              我的预约
              <span className="ml-2 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">
                {myBookings.length}
              </span>
              {activeTab === 'my' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165DFF]" />
              )}
            </button>
            {isApprover && (
              <button
                onClick={() => setActiveTab('pending')}
                className={cn(
                  'flex-1 px-6 py-3 text-sm font-medium transition-colors relative',
                  activeTab === 'pending' ? 'text-[#165DFF]' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                待我审批
                {pendingBookings.length > 0 && (
                  <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                    {pendingBookings.length}
                  </span>
                )}
                {activeTab === 'pending' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165DFF]" />
                )}
              </button>
            )}
          </div>

          {/* 预约列表 */}
          <div className="divide-y divide-gray-100">
            {displayBookings.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">暂无预约记录</p>
              </div>
            ) : (
              displayBookings.map(booking => {
                const status = statusConfig[booking.status];
                const StatusIcon = status.icon;
                
                return (
                  <div key={booking.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{booking.title}</h3>
                          <Badge variant={status.variant}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {booking.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {booking.startTime} - {booking.endTime}
                          </span>
                          <span>{getRoomName(booking.roomId)}</span>
                          <span>{booking.attendeeCount}人</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {activeTab === 'my' && booking.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            取消
                          </Button>
                        )}
                        {activeTab === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(booking.id)}
                              className="text-red-500 border-red-200 hover:bg-red-50"
                            >
                              驳回
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(booking.id)}
                            >
                              通过
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
