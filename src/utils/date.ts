import {
  format,
  parse,
  addDays,
  addMinutes,
  startOfDay,
  isSameDay,
  differenceInMinutes,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function formatDate(date: Date | string, pattern = 'yyyy-MM-dd'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, pattern);
}

export function formatDateChinese(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'yyyy年MM月dd日 EEEE', { locale: zhCN });
}

export function formatTime(date: Date | string, pattern = 'HH:mm'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, pattern);
}

export function parseTime(timeStr: string): Date {
  return parse(timeStr, 'HH:mm', new Date());
}

export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  interval = 30
): string[] {
  const slots: string[] = [];
  let current = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  while (current <= end) {
    slots.push(minutesToTime(current));
    current += interval;
  }

  return slots;
}

export function isTimeOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  return start1 < end2 && end1 > start2;
}

export function getDurationMinutes(startTime: string, endTime: string): number {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}分钟`;
  if (m === 0) return `${h}小时`;
  return `${h}小时${m}分钟`;
}

export function getTodayStr(): string {
  return formatDate(new Date());
}

export function isToday(dateStr: string): boolean {
  return isSameDay(new Date(dateStr), new Date());
}

export function addDaysStr(dateStr: string, days: number): string {
  return formatDate(addDays(new Date(dateStr), days));
}

export function getWeekday(dateStr: string): number {
  return new Date(dateStr).getDay();
}

export function isWorkDay(dateStr: string, workDays: number[]): boolean {
  const weekday = getWeekday(dateStr);
  return workDays.includes(weekday);
}
