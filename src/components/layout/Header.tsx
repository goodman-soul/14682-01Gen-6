import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Calendar, ChevronLeft, ChevronRight, User, LogOut, Settings, Bell } from 'lucide-react';
import { useTenantStore } from '../../stores/tenantStore';
import { useUserStore } from '../../stores/userStore';
import { formatDateChinese, isToday } from '../../utils/date';
import { Button } from '../ui/Button';

interface HeaderProps {
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  isPreview?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onPrevDay, onNextDay, onToday, isPreview = false }) => {
  const navigate = useNavigate();
  const { currentTenant, selectedDate } = useTenantStore();
  const { user, logout } = useUserStore();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dateStr = formatDateChinese(selectedDate);
  const isTodayDate = isToday(selectedDate);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#165DFF] rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900 leading-tight">
              {currentTenant?.name || '会议预约系统'}
            </h1>
            {isPreview && (
              <span className="text-xs text-orange-500 font-medium">预览模式</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevDay}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-800 min-w-[140px] text-center">
              {dateStr}
            </span>
            {!isTodayDate && (
              <button
                onClick={onToday}
                className="text-xs text-[#165DFF] hover:text-[#0E4BD6] font-medium px-2 py-0.5 rounded hover:bg-blue-50 transition-colors"
              >
                今天
              </button>
            )}
          </div>
          <button
            onClick={onNextDay}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        {!isPreview ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#165DFF] to-[#4080FF] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.department}
                </p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  个人中心
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    单位配置
                  </button>
                )}
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/login')}
          >
            返回登录
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
