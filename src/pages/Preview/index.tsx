import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Eye, Calendar, ChevronLeft, ChevronRight, Users, Clock, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import TimelineView from '../../components/meeting/TimelineView';
import { useTenantStore } from '../../stores/tenantStore';
import { getAllTenants, getTenantData } from '../../mock';
import { addDaysStr, formatDateChinese, isToday, formatDuration, getDurationMinutes } from '../../utils/date';
import { Badge } from '../../components/ui/Badge';
import type { Booking, Tenant } from '../../types';

const Preview: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentTenant, setSelectedDate, selectedDate, floors, rooms, equipment, bookings, currentTenant } = useTenantStore();
  
  const [allTenants] = useState<Tenant[]>(getAllTenants());
  const [selectedTenantId, setSelectedTenantId] = useState<string>(allTenants[0]?.id || '');
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (selectedTenantId) {
      setCurrentTenant(selectedTenantId);
    }
  }, [selectedTenantId, setCurrentTenant]);

  useEffect(() => {
    return () => {
      // 离开预览页面时不重置租户，保持用户登录状态
    };
  }, []);

  const handlePrevDay = () => {
    setSelectedDate(addDaysStr(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDaysStr(selectedDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const tenantOptions = allTenants.map(t => ({
    value: t.id,
    label: t.name,
  }));

  const stats = {
    totalRooms: rooms.length,
    totalFloors: floors.length,
    totalEquipment: equipment.length,
    todayMeetings: bookings.length,
  };

  const totalMeetingHours = bookings.reduce((acc, b) => {
    return acc + getDurationMinutes(b.startTime, b.endTime);
  }, 0);

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-lg">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">预览模式</h1>
              <p className="text-gray-300">选择单位，模拟查看单日会议安排</p>
            </div>

            <div className="space-y-6">
              <Select
                label="选择单位"
                options={[{ value: '', label: '请选择要预览的单位' }, ...tenantOptions]}
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  预览模式说明
                </h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    无需登录，可查看任意单位的会议室布局
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    可切换日期，查看不同日期的会议安排
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    仅支持浏览，无法创建或修改预约
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    每个单位有独立的楼层、设备和审批规则
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                  onClick={() => navigate('/login')}
                >
                  返回登录
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={() => setShowIntro(false)}
                  disabled={!selectedTenantId}
                >
                  开始预览
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航 */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900 leading-tight flex items-center gap-2">
                预览模式
                <Badge variant="warning">预览中</Badge>
              </h1>
            </div>
          </div>

          <div className="w-px h-6 bg-gray-200" />

          <div className="w-64">
            <Select
              options={tenantOptions}
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevDay}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-800 min-w-[140px] text-center">
                {formatDateChinese(selectedDate)}
              </span>
              {!isToday(selectedDate) && (
                <button
                  onClick={handleToday}
                  className="text-xs text-[#165DFF] hover:text-[#0E4BD6] font-medium px-2 py-0.5 rounded hover:bg-blue-50 transition-colors"
                >
                  今天
                </button>
              )}
            </div>
            <button
              onClick={handleNextDay}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowIntro(true)}
          >
            切换单位
          </Button>
          
          <Button
            size="sm"
            onClick={() => navigate('/login')}
          >
            返回登录
          </Button>
        </div>
      </header>

      {/* 统计信息 */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">楼层数</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalFloors}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-green-50 rounded-lg">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">会议室</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalRooms}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-purple-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">今日会议</p>
              <p className="text-xl font-bold text-gray-900">{stats.todayMeetings}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-orange-50 rounded-lg">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">会议总时长</p>
              <p className="text-xl font-bold text-gray-900">{formatDuration(totalMeetingHours)}</p>
            </div>
          </div>

          <div className="ml-auto text-sm text-gray-500">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              <Eye className="w-3 h-3" />
              当前预览：{currentTenant?.name}
            </span>
          </div>
        </div>
      </div>

      {/* 主内容区 - 简化版时间轴（不带侧边栏） */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* 简化的楼层导航 */}
          <aside className="w-48 bg-white border-r border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">楼层列表</h2>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {floors.sort((a, b) => a.sortOrder - b.sortOrder).map(floor => (
                <div key={floor.id} className="px-4 py-2 text-sm text-gray-700">
                  <div className="font-medium">{floor.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {rooms.filter(r => r.floorId === floor.id).length} 个会议室
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* 时间轴 - 只读模式 */}
          <div className="flex-1 overflow-auto relative">
            <TimelineView
              selectedFloorId={null}
              isPreview={true}
            />
          </div>
        </div>
      </div>

      {/* 底部水印提示 */}
      <div className="h-8 bg-gray-100 border-t border-gray-200 flex items-center justify-center">
        <span className="text-xs text-gray-400">
          预览模式 - 仅供参观浏览，不支持预约操作
        </span>
      </div>
    </div>
  );
};

export default Preview;
