import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getActivityStatus(startDate, endDate) {
  if (!startDate) return null;
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (now < start) return { label: '即将开始', color: 'bg-blue-100 text-blue-700' };
  if (end && now > end) return { label: '已结束', color: 'bg-gray-100 text-gray-500' };
  return { label: '进行中', color: 'bg-green-100 text-green-700' };
}
