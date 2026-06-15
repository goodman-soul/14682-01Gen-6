import React, { useState, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { useTenantStore } from '../../stores/tenantStore';
import { useUserStore } from '../../stores/userStore';
import { generateTimeSlots, getDurationMinutes, formatDuration, timeToMinutes } from '../../utils/date';
import { checkTimeConflict, createBooking } from '../../mock';
import type { Room, Equipment } from '../../types';
import { cn } from '../../lib/utils';
import { Calendar, Clock, Users, Monitor, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  initialRoom?: Room | null;
  initialTime?: string;
  initialDate?: string;
  onSuccess?: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  open,
  onClose,
  initialRoom,
  initialTime,
  initialDate,
  onSuccess,
}) => {
  const { rooms, selectedDate, equipment, approvalRules, currentTenant, refreshBookings } = useTenantStore();
  const { user, refreshMyBookings, refreshPendingBookings } = useUserStore();
  
  // 关键：写操作必须以用户所属单位为准，不依赖 tenantStore.currentTenantId
  // 防止预览模式切换租户后污染登录态下的预约
  const safeTenantId = user?.tenantId!;

  const [step, setStep] = useState<'form' | 'result'>('form');
  const [title, setTitle] = useState('');
  const [roomId, setRoomId] = useState(initialRoom?.id || '');
  const [date, setDate] = useState(initialDate || selectedDate);
  const [startTime, setStartTime] = useState(initialTime || '09:00');
  const [endTime, setEndTime] = useState('');
  const [attendeeCount, setAttendeeCount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [meetingType, setMeetingType] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resultStatus, setResultStatus] = useState<'success' | 'pending'>('success');
  const [resultMessage, setResultMessage] = useState('');

  const timeSlots = useMemo(() => {
    if (!currentTenant) return [];
    return generateTimeSlots(currentTenant.bookingStartTime, currentTenant.bookingEndTime, 30);
  }, [currentTenant]);

  const selectedRoom = rooms.find(r => r.id === roomId);
  const duration = startTime && endTime ? getDurationMinutes(startTime, endTime) : 0;
  const hasConflict = roomId && startTime && endTime && date
    ? checkTimeConflict(safeTenantId, roomId, date, startTime, endTime)
    : false;

  const needsApproval = useMemo(() => {
    if (!approvalRules || !selectedRoom || duration <= 0) return false;
    
    return approvalRules.some(rule => {
      if (!rule.enabled) return false;
      const { conditions } = rule;
      
      if (conditions.minCapacity && selectedRoom.capacity >= conditions.minCapacity) {
        return true;
      }
      if (conditions.durationThreshold && duration >= conditions.durationThreshold) {
        return true;
      }
      if (conditions.roomIds?.includes(roomId)) {
        return true;
      }
      return false;
    });
  }, [approvalRules, selectedRoom, duration, roomId]);

  const meetingTypes = [
    { value: '', label: '请选择会议类型' },
    { value: '例行会议', label: '例行会议' },
    { value: '工作会议', label: '工作会议' },
    { value: '培训', label: '培训' },
    { value: '评审会议', label: '评审会议' },
    { value: '视频会议', label: '视频会议' },
    { value: '其他', label: '其他' },
  ];

  const roomOptions = [
    { value: '', label: '请选择会议室' },
    ...rooms.map(r => ({ value: r.id, label: `${r.name} (${r.capacity}人)` })),
  ];

  const handleEquipmentToggle = (equipId: string) => {
    setSelectedEquipment(prev =>
      prev.includes(equipId)
        ? prev.filter(id => id !== equipId)
        : [...prev, equipId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('请输入会议主题');
      return;
    }
    if (!roomId) {
      setError('请选择会议室');
      return;
    }
    if (!startTime || !endTime) {
      setError('请选择开始和结束时间');
      return;
    }
    if (duration <= 0) {
      setError('结束时间必须晚于开始时间');
      return;
    }
    if (currentTenant && duration < currentTenant.minBookingDuration) {
      setError(`会议时长不能少于${currentTenant.minBookingDuration}分钟`);
      return;
    }
    if (currentTenant && duration > currentTenant.maxBookingDuration) {
      setError(`会议时长不能超过${currentTenant.maxBookingDuration / 60}小时`);
      return;
    }
    if (hasConflict) {
      setError('该时间段会议室已被预约，请选择其他时间');
      return;
    }
    if (!attendeeCount || parseInt(attendeeCount) <= 0) {
      setError('请输入参会人数');
      return;
    }
    if (selectedRoom && parseInt(attendeeCount) > selectedRoom.capacity) {
      setError(`参会人数超过会议室容量（最多${selectedRoom.capacity}人）`);
      return;
    }

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const booking = createBooking(safeTenantId, {
        roomId,
        userId: user!.id,
        title,
        description,
        date,
        startTime,
        endTime,
        attendeeCount: parseInt(attendeeCount),
        equipmentIds: selectedEquipment,
        status: needsApproval ? 'pending' : 'approved',
        meetingType,
      });

      setResultStatus(needsApproval ? 'pending' : 'success');
      setResultMessage(
        needsApproval
          ? '预约已提交，等待审批人审批'
          : '预约成功！会议室已为您预留'
      );
      setStep('result');
      
      refreshBookings();
      refreshMyBookings();
      if (needsApproval) {
        refreshPendingBookings();
      }
      
      onSuccess?.();
    } catch (err) {
      setError('预约失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setTitle('');
    setRoomId(initialRoom?.id || '');
    setStartTime(initialTime || '09:00');
    setEndTime('');
    setAttendeeCount('');
    setDescription('');
    setSelectedEquipment([]);
    setMeetingType('');
    setError('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={step === 'form' ? '新建会议预约' : '预约结果'}
      width="max-w-xl"
    >
      {step === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="会议主题"
            placeholder="请输入会议主题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="会议室"
              options={roomOptions}
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <Input
              label="参会人数"
              type="number"
              min={1}
              placeholder="请输入人数"
              value={attendeeCount}
              onChange={(e) => setAttendeeCount(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Calendar className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
              <Input
                label="会议日期"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              label="会议类型"
              options={meetingTypes}
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="开始时间"
              options={[{ value: '', label: '请选择' }, ...timeSlots.map(t => ({ value: t, label: t }))]}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Select
              label="结束时间"
              options={[
                { value: '', label: '请选择' },
                ...timeSlots
                  .filter(t => !startTime || timeToMinutes(t) > timeToMinutes(startTime))
                  .map(t => ({ value: t, label: t }))
              ]}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          {duration > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">会议时长：</span>
              <span className="font-medium text-gray-700">{formatDuration(duration)}</span>
              
              {hasConflict && (
                <span className="flex items-center gap-1 text-red-500 ml-2">
                  <AlertCircle className="w-4 h-4" />
                  时间冲突
                </span>
              )}
              
              {needsApproval && !hasConflict && (
                <Badge variant="warning" className="ml-2">
                  需要审批
                </Badge>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              设备需求
            </label>
            <div className="flex flex-wrap gap-2">
              {equipment.map(eq => (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => handleEquipmentToggle(eq.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border transition-colors',
                    selectedEquipment.includes(eq.id)
                      ? 'bg-blue-50 border-blue-300 text-[#165DFF]'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  )}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  {eq.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              会议备注
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#165DFF] focus:border-transparent resize-none"
              rows={3}
              placeholder="请输入会议备注信息（选填）"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              取消
            </Button>
            <Button type="submit" isLoading={submitting}>
              提交预约
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center py-6">
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
            resultStatus === 'success' ? 'bg-green-100' : 'bg-orange-100'
          )}>
            {resultStatus === 'success' ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <Clock className="w-8 h-8 text-orange-500" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {resultStatus === 'success' ? '预约成功' : '预约已提交'}
          </h3>
          <p className="text-gray-500 mb-6">{resultMessage}</p>
          
          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">会议主题</span>
              <span className="font-medium text-gray-800">{title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">会议室</span>
              <span className="font-medium text-gray-800">{selectedRoom?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">时间</span>
              <span className="font-medium text-gray-800">
                {date} {startTime}-{endTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">参会人数</span>
              <span className="font-medium text-gray-800">{attendeeCount}人</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={handleClose}>
              关闭
            </Button>
            <Button
              onClick={() => {
                setStep('form');
                setTitle('');
                setEndTime('');
                setAttendeeCount('');
                setDescription('');
                setSelectedEquipment([]);
              }}
            >
              继续预约
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BookingModal;
