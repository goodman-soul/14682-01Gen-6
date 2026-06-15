import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Building2,
  Layers,
  Monitor,
  Calendar as CalendarIcon,
  FileCheck,
  Settings as SettingsIcon,
  Clock,
  Users,
  Check,
  X,
  Info,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useUserStore } from '../../stores/userStore';
import { useTenantStore } from '../../stores/tenantStore';
import { cn } from '../../lib/utils';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUserStore();
  const {
    currentTenant,
    currentTenantId,
    setCurrentTenant,
    floors,
    rooms,
    equipment,
    holidays,
    approvalRules,
  } = useTenantStore();

  const [activeTab, setActiveTab] = useState<'basic' | 'floors' | 'equipment' | 'approval' | 'holidays'>('basic');

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [isLoggedIn, user, navigate]);

  useEffect(() => {
    if (isLoggedIn && currentTenantId && !currentTenant) {
      setCurrentTenant(currentTenantId);
    }
  }, [isLoggedIn, currentTenantId, currentTenant, setCurrentTenant]);

  if (!isLoggedIn || !user || user.role !== 'admin') {
    return null;
  }

  const tabs = [
    { id: 'basic', label: '基本设置', icon: SettingsIcon },
    { id: 'floors', label: '楼层管理', icon: Layers },
    { id: 'equipment', label: '设备清单', icon: Monitor },
    { id: 'approval', label: '审批规则', icon: FileCheck },
    { id: 'holidays', label: '节假日', icon: CalendarIcon },
  ] as const;

  const workDayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  const sortedFloors = [...floors].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedHolidays = [...holidays].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">单位配置</h1>
            <p className="text-xs text-gray-500">{currentTenant?.name}</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* 侧边栏 */}
          <aside className="w-56 flex-shrink-0">
            <nav className="bg-white rounded-xl border border-gray-200 p-2 sticky top-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors',
                      activeTab === tab.id
                        ? 'bg-blue-50 text-[#165DFF] font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* 主内容 */}
          <div className="flex-1">
            {/* 基本设置 */}
            {activeTab === 'basic' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#165DFF]" />
                  单位基本信息
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        单位名称
                      </label>
                      <div className="h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-gray-700">
                        {currentTenant?.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        单位简称
                      </label>
                      <div className="h-10 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-gray-700">
                        {currentTenant?.shortName}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      预约时间设置
                    </h3>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          最早预约时间
                        </label>
                        <div className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-700">
                          {currentTenant?.bookingStartTime}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          最晚预约时间
                        </label>
                        <div className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-700">
                          {currentTenant?.bookingEndTime}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          主题色
                        </label>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-9 h-9 rounded-md border border-gray-200"
                            style={{ backgroundColor: currentTenant?.themeColor }}
                          />
                          <span className="text-sm text-gray-600 font-mono">
                            {currentTenant?.themeColor}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      工作日设置
                    </h3>
                    <div className="flex gap-2">
                      {workDayNames.map((day, idx) => (
                        <div
                          key={day}
                          className={cn(
                            'flex-1 py-2 px-3 rounded-lg text-center text-sm',
                            currentTenant?.workDays.includes(idx)
                              ? 'bg-blue-50 text-[#165DFF] font-medium border border-blue-200'
                              : 'bg-gray-50 text-gray-400 border border-gray-200'
                          )}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                      预约时长限制
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          最短预约时长
                        </label>
                        <div className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-700">
                          {currentTenant?.minBookingDuration} 分钟
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          最长预约时长
                        </label>
                        <div className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-md flex items-center text-sm text-gray-700">
                          {currentTenant ? currentTenant.maxBookingDuration / 60 : 0} 小时
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 楼层管理 */}
            {activeTab === 'floors' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#165DFF]" />
                    楼层管理
                  </h2>
                  <Badge variant="info">共 {sortedFloors.length} 层</Badge>
                </div>

                <div className="space-y-3">
                  {sortedFloors.map((floor) => {
                    const floorRooms = rooms.filter(r => r.floorId === floor.id);
                    return (
                      <div
                        key={floor.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{floor.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {floorRooms.length} 个会议室
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="info">{floorRooms.length} 间</Badge>
                          </div>
                        </div>

                        {floorRooms.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                            {floorRooms
                              .sort((a, b) => a.sortOrder - b.sortOrder)
                              .map((room) => (
                                <div
                                  key={room.id}
                                  className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">
                                      {room.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {room.capacity} 人
                                    </p>
                                  </div>
                                  <Users className="w-4 h-4 text-gray-400" />
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 设备清单 */}
            {activeTab === 'equipment' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-[#165DFF]" />
                    设备清单
                  </h2>
                  <Badge variant="info">共 {equipment.length} 种</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {equipment.map((eq) => (
                    <div
                      key={eq.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Monitor className="w-6 h-6 text-[#165DFF]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{eq.name}</h3>
                        <p className="text-sm text-gray-500">
                          总计 {eq.totalQuantity} 件
                        </p>
                      </div>
                      <Badge variant="success">
                        {eq.totalQuantity} 件
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">设备使用说明</p>
                    <p className="text-blue-600">
                      所有会议室设备均可在预约时选择使用，系统将自动检测设备可用情况。
                      部分特殊设备可能需要额外审批。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 审批规则 */}
            {activeTab === 'approval' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-[#165DFF]" />
                    审批规则
                  </h2>
                  <Badge variant="warning">
                    {approvalRules.filter(r => r.enabled).length} 条启用
                  </Badge>
                </div>

                <div className="space-y-4">
                  {approvalRules.map((rule) => (
                    <div
                      key={rule.id}
                      className={cn(
                        'p-4 border rounded-lg transition-colors',
                        rule.enabled
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-100 bg-gray-50 opacity-60'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">
                              {rule.name}
                            </h3>
                            {rule.enabled ? (
                              <Badge variant="success">已启用</Badge>
                            ) : (
                              <Badge variant="default">已禁用</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            审批方式：{rule.approvalType === 'any' ? '任意一人通过即可' : '全部通过方可生效'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-500 mb-2">触发条件</p>
                        <div className="space-y-1.5">
                          {rule.conditions.minCapacity && (
                            <div className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-500" />
                              <span className="text-gray-600">
                                会议室容量 ≥ {rule.conditions.minCapacity} 人
                              </span>
                            </div>
                          )}
                          {rule.conditions.durationThreshold && (
                            <div className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-500" />
                              <span className="text-gray-600">
                                会议时长 ≥ {rule.conditions.durationThreshold / 60} 小时
                              </span>
                            </div>
                          )}
                          {rule.conditions.roomIds && rule.conditions.roomIds.length > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-500" />
                              <span className="text-gray-600">
                                指定会议室：{rule.conditions.roomIds.map(
                                  rid => rooms.find(r => r.id === rid)?.name
                                ).join('、')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-500 mb-2">审批人</p>
                        <div className="flex flex-wrap gap-2">
                          {rule.approverIds.map((aid) => (
                            <Badge key={aid} variant="info">
                              {aid}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 节假日 */}
            {activeTab === 'holidays' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-[#165DFF]" />
                    节假日设置
                  </h2>
                  <Badge variant="info">共 {sortedHolidays.length} 天</Badge>
                </div>

                <div className="space-y-3">
                  {sortedHolidays.map((holiday) => (
                    <div
                      key={holiday.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'w-12 h-12 rounded-lg flex items-center justify-center',
                          holiday.type === 'holiday' ? 'bg-red-50' : 'bg-green-50'
                        )}>
                          {holiday.type === 'holiday' ? (
                            <X className="w-6 h-6 text-red-500" />
                          ) : (
                            <Check className="w-6 h-6 text-green-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{holiday.name}</h3>
                          <p className="text-sm text-gray-500">{holiday.date}</p>
                        </div>
                      </div>
                      <Badge variant={holiday.type === 'holiday' ? 'danger' : 'success'}>
                        {holiday.type === 'holiday' ? '休' : '班'}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
                  <Info className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium mb-1">节假日说明</p>
                    <p className="text-yellow-600">
                      节假日期间系统将禁止预约（调休补班日除外）。
                      如需在节假日预约会议，请联系管理员特殊审批。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
